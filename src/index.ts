/*
 * Copyright (c) 2019. Author Hubert Formin <hformin@gmail.com>
 */

if ((process as any).type == 'renderer') {
    throw new Error('electron-pos-printer: use remote.require("electron-pos-printer") in render process');
}


const {BrowserWindow, ipcMain} = require('electron');
export interface PosPrintOptions {
    /**
     * @field copies: number of copies to print
     * @field preview: bool，false=print，true=pop preview window
     * @field deviceName: string，default device name, check it at webContent.getPrinters()
     * @field timeoutPerLine: int，timeout，actual time is ：data.length * timeoutPerLine ms
     */
    copies?: number;
    preview?: boolean;
    printerName: string;
    margin?: string;
    timeOutPerLine?: number;
    width?: string;
}

declare type PosPrintPosition = 'left' | 'center' | 'right';

/**
 * @interface
 * @name PosPrintData
 * **/
export interface PosPrintData {
    /**
     * @property type
     * @description type data to print: 'text' | 'barCode' | 'qrcode' | 'image'
    */
    type: PosPrintType;
    value?: string;
    css?: any;
    style?: string;
    width?: string | number;
    height?: string | number;
    fontsize?: number;       // for barcodes
    displayValue?: boolean;  // for barcodes
    // options for images
    position?: PosPrintPosition;        // for type image, barcode and qrCode; values: 'left'| 'center' | 'right'
    path?: string;                      // image path
}
/**
 * @type
 * @name PosPrintType
 * **/
declare type PosPrintType  = 'text' | 'barCode' | 'qrCode' | 'image';


/**
 * @class PosPrinter
 * **/
export class PosPrinter {
    /**
     * @Method: Print object
     * @Param arg {any}
     * @Return {Promise}
     */
    static print(data: PosPrintData[], options: PosPrintOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            // reject if printer name is not set in no preview
            if (!options.preview && !options.printerName) {
                reject(new Error('A printer name is required').toString());
            }
            // else
            let printedState = false;
            let window_print_error = null;
            let timeOutPerline = options.timeOutPerLine ? options.timeOutPerLine : 400;
            if (!options.preview) {
                setTimeout(() => {
                    if (!printedState) {
                        const errorMsg = window_print_error ? window_print_error: 'TimedOut';
                        reject(errorMsg);
                        printedState = true;
                    }
                }, timeOutPerline * data.length + 2000);
            }
            // open electron window
            let mainWindow = new BrowserWindow({
                width: 210,
                height: 1200,
                show: !!options.preview,
                webPreferences: {
                    nodeIntegration: true        // For electron >= 4.0.0
                }
            });
            // mainWindow
            mainWindow.on('closed', () => {
                (mainWindow as any) = null;
            });
            /*mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'print.html'),
                protocol: 'file:',
                slashes: true,
                // baseUrl: 'dist'
            }));*/
            mainWindow.loadFile(__dirname + '/pos.html');
            mainWindow.webContents.on('did-finish-load', async () => {
                // get system printes
                const system_printers = mainWindow.webContents.getPrinters();
                const printer_index = system_printers.findIndex(sp => sp.name === options.printerName);
                // if system printer isn't found!!
                if (!options.preview && printer_index == -1) {
                    reject(new Error(options.printerName + ' not found. Make sure your printer drivers are up to date').toString());
                    return;
                }
                // else start previewing
                await sendMsg('print-body-init', mainWindow.webContents, options);
                // initialize page
                new Promise((resolve_1, reject_1) => {
                    PrintLine(0);
                    function PrintLine(line) {
                        if (line >= data.length) {
                            resolve_1();
                            return;
                        }
                        let obj = data[line];
                        switch (obj.type) {
                            case 'image':
                                if (!obj.path) {
                                    mainWindow.close();
                                    reject_1(new Error('An Image path is required for type image').toString());
                                    return;
                                }
                                sendMsg('print-image', mainWindow.webContents, obj)
                                    .then((result: any) => {
                                        if (!result.status) {
                                            mainWindow.close();
                                            reject_1(result.error);
                                            return;
                                        }
                                        PrintLine(line + 1);
                                    });
                                break;
                            case 'text':
                                sendMsg('print-text', mainWindow.webContents, obj)
                                    .then((result: any) => {
                                        // console.log(result);
                                        if (!result.status) {
                                            mainWindow.close();
                                            reject_1(result.error);
                                            return;
                                        }
                                        PrintLine(line + 1);
                                    });
                                break;
                            case 'barCode':
                                sendMsg('print-barCode', mainWindow.webContents, obj)
                                    .then((result: any) => {
                                        if (!result.status) {
                                            mainWindow.close();
                                            reject_1(result.error);
                                            return;
                                        }
                                        PrintLine(line + 1);
                                    });
                                break;
                            case 'qrCode':
                                sendMsg('print-qrCode', mainWindow.webContents, obj)
                                    .then((result: any)=> {
                                        if (!result.status) {
                                            mainWindow.close();
                                            reject_1(result.error);
                                            return;
                                        }
                                        // console.log(result);
                                        PrintLine(line + 1);
                                    });
                                break;
                            default:
                                PrintLine(line + 1);
                                break;
                        }
                    }
                }).then(() => {
                    if (!options.preview) {
                        mainWindow.webContents.print({
                            silent: true,
                            printBackground: true,
                            deviceName: options.printerName,
                            copies: options.copies ? options.copies : 1
                        }, (arg, err) => {
                            // console.log(arg, err);
                            if (err) {
                                window_print_error = err;
                                reject(err);
                            }
                            if (!printedState) {
                                resolve({complete: arg});
                                printedState = true;
                            }
                            mainWindow.close();
                        })
                    } else {
                        resolve({preview: true, complete: true});
                    }
                }).catch(err => reject(err));
            })
        });
    }   
}


// ipcMain.on('pos-print', (event, arg)=> {
//     const {data, options} = JSON.parse(arg);
//     PosPrinter.print(data, options).then((arg)=>{
//         event.sender.send('print-pos-reply', {status: true, error: {}});
//     }).catch((err)=>{
//         event.sender.send('print-pos-reply', {status: false, error: err});
//     });
// });

function sendMsg(channel: any, webContents: any, arg: any) {
    return new Promise((resolve,reject)=>{
        ipcMain.once(`${channel}-reply`, function(event, result) {
            resolve(result);
        });
        webContents.send(channel,arg);
    });
}
