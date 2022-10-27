"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosPrinter = void 0;
const electron_1 = require("electron");
if (process.type == 'renderer') {
    throw new Error('electron-pos-printer: use remote.require("electron-pos-printer") in render process');
}
/**
 * @class PosPrinter
 * **/
class PosPrinter {
    /**
     * @Method: Print object
     * @Param arg {any}
     * @Return {Promise}
     */
    static print(data, options) {
        return new Promise((resolve, reject) => {
            // Reject if printer name is not set in live mode
            if (!options.preview && !options.printerName && !options.silent) {
                reject(new Error("A printer name is required, if you don't want to specify a printer name, set silent to true").toString());
            }
            // else
            let printedState = false; // If the job has been printer or not
            let window_print_error = null; // The error returned if the printing fails
            let timeOut = options.timeOutPerLine ? options.timeOutPerLine * data.length + 200 : 400;
            if (!options.preview || !options.silent) {
                setTimeout(() => {
                    if (!printedState) {
                        const errorMsg = window_print_error || '[TimedOutError] Make sure your printer is connected';
                        reject(errorMsg);
                        printedState = true;
                    }
                }, timeOut);
            }
            // open electron window
            let mainWindow = new electron_1.BrowserWindow(Object.assign(Object.assign({}, formatPageSize(options.pageSize)), { show: !!options.preview, webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false
                } }));
            // mainWindow
            mainWindow.on('closed', () => {
                mainWindow = null;
            });
            /*mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'print.html'),
                protocol: 'file:',
                slashes: true,
                // baseUrl: 'dist'
            }));*/
            mainWindow.loadFile(options.pathTemplate || (__dirname + '/pos.html'));
            mainWindow.webContents.on('did-finish-load', () => __awaiter(this, void 0, void 0, function* () {
                // get system printers
                // const system_printers = mainWindow.webContents.getPrinters();
                // const printer_index = system_printers.findIndex(sp => sp.name === options.printerName);
                // // if system printer isn't found!!
                // if (!options.preview && printer_index == -1) {
                //     reject(new Error(options.printerName + ' not found. Check if this printer was added to your computer or try updating your drivers').toString());
                //     return;
                // }
                // else start initialize render prcess page
                yield sendIpcMsg('body-init', mainWindow.webContents, options);
                /**
                 * Render print data as html in the mainwindow render process
                 *
                 */
                return PosPrinter.renderPrintDocument(mainWindow, data)
                    .then(() => {
                    if (!options.preview) {
                        mainWindow.webContents.print(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ silent: !!options.silent, printBackground: true, deviceName: options.printerName, copies: (options === null || options === void 0 ? void 0 : options.copies) || 1, pageSize: (options === null || options === void 0 ? void 0 : options.pageSize) || 'Letter' }, (options.header && { color: options.header })), (options.footer && { color: options.footer })), (options.color && { color: options.color })), (options.printBackground && { printBackground: options.printBackground })), (options.margins && { margins: options.margins })), (options.landscape && { landscape: options.landscape })), (options.scaleFactor && { scaleFactor: options.scaleFactor })), (options.pagesPerSheet && { pagesPerSheet: options.pagesPerSheet })), (options.collate && { collate: options.collate })), (options.pageRanges && { pageRanges: options.pageRanges })), (options.duplexMode && { duplexMode: options.duplexMode })), (options.dpi && { dpi: options.dpi })), (arg, err) => {
                            // console.log(arg, err);
                            if (err) {
                                window_print_error = err;
                                reject(err);
                            }
                            if (!printedState) {
                                resolve({ complete: arg });
                                printedState = true;
                            }
                            mainWindow.close();
                        });
                    }
                    else {
                        resolve({ complete: true });
                    }
                })
                    .catch(err => reject(err));
            }));
        });
    }
    /**
     * @Method
     * @Param data {any[]}
     * @Return {Promise}
     * @description Render the print data in the render process
     *
     */
    static renderPrintDocument(window, data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
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
                if (line.css) {
                    window.close();
                    reject(new Error('`options.css` in {css: ' + line.css.toString() + '} is no longer supported. Please use `options.style` instead. Example: {style: {fontSize: 12}}'));
                    break;
                }
                /**
                 * line.style is no longer a string but an object, throw and error if a use still sets a string
                 *
                 */
                if (!!line.style && typeof line.style !== "object") {
                    window.close();
                    reject(new Error('`options.styles` at "' + line.style + '" should be an object. Example: {style: {fontSize: 12}}'));
                    break;
                }
                yield sendIpcMsg('render-line', window.webContents, { line, lineIndex })
                    .then((result) => {
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
            resolve({ message: 'page-rendered' });
        }));
    }
}
exports.PosPrinter = PosPrinter;
/**
 * @function sendMsg
 * @description Sends messages to the render process to render the data specified in the PostPrintDate interface and recieves a status of true
 *
 */
function sendIpcMsg(channel, webContents, arg) {
    return new Promise((resolve, reject) => {
        electron_1.ipcMain.once(`${channel}-reply`, function (event, result) {
            if (result.status) {
                resolve(result);
            }
            else {
                reject(result.error);
            }
        });
        webContents.send(channel, arg);
    });
}
function formatPageSize(pageSize) {
    let width = 220, height = 1200;
    if (typeof pageSize == "object") {
        width = pageSize.width;
        height = pageSize.height;
    }
    return {
        width,
        height
    };
}
