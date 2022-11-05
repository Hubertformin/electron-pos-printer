/*
 * Copyright (c) 2019-2022. Author Hubert Formin <hformin@gmail.com>
 */
import {PaperSize, PosPrintData, PosPrintOptions, SizeOptions} from "./models";
import {BrowserWindow, ipcMain} from 'electron';
import {join} from "path";

if ((process as any).type == 'renderer') {
    throw new Error('electron-pos-printer: use remote.require("electron-pos-printer") in the render process');
}

/**
 * @class PosPrinter
 * **/
export class PosPrinter {
    /**
     * @method: Print object
     * @param data {PosPrintData[]}
     * @param options {PosPrintOptions}
     * @return {Promise}
     */
    public static print(data: PosPrintData[], options: PosPrintOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            // Reject if printer name is not set in live mode
            if (!options.preview && !options.printerName && !options.silent) {
                reject(new Error("A printer name is required, if you don't want to specify a printer name, set silent to true").toString());
            }
            // else
            let printedState = false; // If the job has been printer or not
            let window_print_error: any = null; // The error returned if the printing fails
            let timeOut = options.timeOutPerLine ? (options.timeOutPerLine * data.length + 200) : (400 * data.length + 200);

            /**
             * If in live mode i.e. `options.preview` is false & if `options.silent` is false
             * Check after a timeOut if the print data has been rendered and printed,
             * If the data is rendered & printer, printerState will be set to true.
             *
             * This is done because we don't want the printing process to hang, so after a specific time, we check if the
             * printing was completed and resolve/reject the promise.
             *
             * The printing process can hang (i.e. the print promise never gets resolved) if the process is trying to
             * send a print job to a printer that is not connected.
             *
             */
            if (!options.preview || !options.silent) {
                setTimeout(() => {
                    if (!printedState) {
                        const errorMsg = window_print_error || '[TimedOutError] Make sure your printer is connected';
                        reject(errorMsg);
                        printedState = true;
                    }
                }, timeOut);
            }
            /**
             * Create Browser window
             * This window is the preview window, and it loads the data to be printer (in html)
             * The width and height of this window can be customized by the user
             *
             */
            let mainWindow = new BrowserWindow({
                ...parsePaperSize(options.pageSize),
                show: !!options.preview,
                webPreferences: {
                    nodeIntegration: true,        // For electron >= 4.0.0
                    contextIsolation: false
                }
            });

            // If the mainWindow is closed, reset the `mainWindow` var to null
            mainWindow.on('closed', () => {
                (mainWindow as any) = null;
            });

            mainWindow.loadFile(options.pathTemplate || join(__dirname, "renderer/index.html"));

            mainWindow.webContents.on('did-finish-load', async () => {
                // get system printers
                // const system_printers = mainWindow.webContents.getPrinters();
                // const printer_index = system_printers.findIndex(sp => sp.name === options.printerName);
                // // if system printer isn't found!!
                // if (!options.preview && printer_index == -1) {
                //     reject(new Error(options.printerName + ' not found. Check if this printer was added to your computer or try updating your drivers').toString());
                //     return;
                // }
                // else start initialize render process page
                await sendIpcMsg('body-init', mainWindow.webContents, options);
                /**
                 * Render print data as html in the mainWindow render process
                 *
                 */
                return PosPrinter.renderPrintDocument(mainWindow, data)
                    .then(() => {
                        // Get the height of content window
                        const contentHeight = mainWindow.getContentSize()[1];

                        if (!options.preview) {
                            mainWindow.webContents.print({
                                silent: !!options.silent,
                                printBackground: !!options.printBackground,
                                deviceName: options.printerName,
                                copies: options?.copies || 1,
                                pageSize: { width: parsePaperSize(options.pageSize).width, height: contentHeight },
                                ...(options.header && {color: options.header}),
                                ...(options.footer && {color: options.footer}),
                                ...(options.color && {color: options.color}),
                                ...(options.printBackground && {printBackground: options.printBackground}),
                                ...(options.margins && {margins: options.margins}),
                                ...(options.landscape && {landscape: options.landscape}),
                                ...(options.scaleFactor && {scaleFactor: options.scaleFactor}),
                                ...(options.pagesPerSheet && {pagesPerSheet: options.pagesPerSheet}),
                                ...(options.collate && {collate: options.collate}),
                                ...(options.pageRanges && {pageRanges: options.pageRanges}),
                                ...(options.duplexMode && {duplexMode: options.duplexMode}),
                                ...(options.dpi && {dpi: options.dpi}),
                            }, (arg, err) => {
                                // console.log(arg, err);
                                if (err) {
                                    window_print_error = err;
                                    reject(err);
                                }
                                if (!printedState) {
                                    resolve({complete: arg, options});
                                    printedState = true;
                                }
                                mainWindow.close();
                            })
                        } else {
                            resolve({complete: true, data, options});
                        }
                    })
                    .catch(err => reject(err));
            })
        });
    }

    /**
     * @Method
     * @Param data {any[]}
     * @Return {Promise}
     * @description Render the print data in the render process index.html
     *
     */
    private static renderPrintDocument(window: any, data: PosPrintData[]): Promise<any> {
        return new Promise(async (resolve, reject) => {
            // data.forEach(async (line, lineIndex) => );
            for (const [lineIndex, line] of data.entries()) {
                // ========== VALIDATION =========
                /**
                 * Throw an error if image is set without path or url.
                 */
                if (line.type === 'image' && !line.path && !line.url) {
                    window.close();
                    reject(new Error('An Image url/path is required for type image').toString());
                    break;
                }
                /**
                 * line.css is unsupported, throw an error if user sets css
                 */
                if ((line as any).css) {
                    window.close();
                    reject(new Error('`options.css` in {css: ' + (line as any).css.toString() + '} is no longer supported. Please use `options.style` instead. Example: {style: {fontSize: 12}}'))
                    break;
                }
                /**
                 * line.style is no longer a string but an object, throw and error if a use still sets a string
                 *
                 */
                if (!!line.style && typeof line.style !== "object") {
                    window.close();
                    reject(new Error('`options.styles` at "' + line.style + '" should be an object. Example: {style: {fontSize: 12}}'))
                    break;
                }

                await sendIpcMsg('render-line', window.webContents, {line, lineIndex})
                    .then((result: any) => {
                        if (!result.status) {
                            window.close();
                            reject(result.error);
                            return;
                        }
                    }).catch((error) => {
                        reject(error);
                        return;
                    });
            }
            // when the render process is done rendering the page, resolve
            resolve({message: 'page-rendered'});
        })
    }
}

/**
 * @function sendMsg
 * @description Sends messages to the render process to render the data specified in the PostPrintDate interface and receives a status of true
 *
 */
function sendIpcMsg(channel: any, webContents: any, arg: any) {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        ipcMain.once(`${channel}-reply`, function (event, result) {
            if (result.status) {
                resolve(result);
            } else {
                reject(result.error);
            }
        });
        webContents.send(channel, arg);
    });
}


function parsePaperSize(pageSize?: PaperSize | SizeOptions): { width: number, height: number } {
    let width = 219.212598, height = 1200;
    if (typeof pageSize == 'string') {
        switch (pageSize) {
            case "44mm":
                width = 166.299213;
                break
            case "57mm":
                width = 215.433071;
                break;
            case "58mm":
                width = 219.212598;
                break;
            case "76mm":
                width = 287.244095;
                break;
            case "78mm":
                width = 294.80315;
                break;
            case "80mm":
                width = 302.362205;
                break;
        }
    } else if (typeof pageSize == "object") {
        width = pageSize.width;
        height = pageSize.height;
    }

    return {
        width,
        height
    }
}