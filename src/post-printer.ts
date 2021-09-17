/*
 * Copyright (c) 2019-2020. Author Hubert Formin <hformin@gmail.com>
 */

import {PosPrintData, PosPrintOptions} from "./models";

if ((process as any).type == 'renderer') {
    throw new Error('electron-pos-printer: use remote.require("electron-pos-printer") in render process');
}


const {BrowserWindow, ipcMain} = require('electron');
// ipcMain.on('pos-print', (event, arg)=> {
//     const {data, options} = JSON.parse(arg);
//     PosPrinter.print(data, options).then((arg)=>{
//         event.sender.send('print-pos-reply', {status: true, error: {}});
//     }).catch((err)=>{
//         event.sender.send('print-pos-reply', {status: false, error: err});
//     });
// });
/**
 * @class PosPrinter
 * **/
export class PosPrinter {
    /**
     * @Method: Print object
     * @Param arg {any}
     * @Return {Promise}
     */
    public static print(data: PosPrintData[], options: PosPrintOptions): Promise<any> {
        return new Promise((resolve, reject) => {
            // reject if printer name is not set in no preview mode
            if (!options.preview && !options.printerName) {
                reject(new Error('A printer name is required').toString());
            }
            // else
            let printedState = false; // If the job has been printer or not
            let window_print_error = null; // The error returned if the printing fails
            let timeOutPerline = options.timeOutPerLine ? options.timeOutPerLine : 400;
            if (!options.preview || !options.silent) {
                setTimeout(() => {
                    if (!printedState) {
                        const errorMsg = window_print_error ? window_print_error: 'TimedOut';
                        reject(errorMsg);
                        printedState = true;
                    }
                }, timeOutPerline * data.length + 200);
            }
            // open electron window
            let mainWindow = new BrowserWindow({
                width: 210,
                height: 1200,
                show: !!options.preview,
                webPreferences: {
                    nodeIntegration: true,        // For electron >= 4.0.0
                    contextIsolation: false
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
                // get system printers
                // const system_printers = mainWindow.webContents.getPrinters();
                // const printer_index = system_printers.findIndex(sp => sp.name === options.printerName);
                // // if system printer isn't found!!
                // if (!options.preview && printer_index == -1) {
                //     reject(new Error(options.printerName + ' not found. Check if this printer was added to your computer or try updating your drivers').toString());
                //     return;
                // }
                // else start initialize render prcess page
                await sendIpcMsg('body-init', mainWindow.webContents, options);
                /**
                 * Render print data as html in the mainwindow render process
                 *
                 */
                return PosPrinter.renderPrintDocument(mainWindow, data)
                .then(() => {
                    if (!options.preview) {
                        mainWindow.webContents.print({
                            silent: !!options.silent,
                            printBackground: true,
                            deviceName: options.printerName,
                            copies: options.copies ? options.copies : 1,
                            pageSize: options.pageSize ? options.pageSize : 'A4'
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
                        resolve({complete: true});
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
     * @description Render the print data in the render process 
     * 
    */
    private static renderPrintDocument(window: any, data: PosPrintData[]): Promise<any> {
        return new Promise((resolve, reject) => {
            data.forEach(async (line, lineIndex) => {
                if (line.type === 'image' && !line.path) {
                    window.close();
                    reject(new Error('An Image path is required for type image').toString());
                    return;
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
            });
            // when the render process is done rendering the page, resolve
            resolve({message: 'page-rendered'});
        })
    } 
}
/**
 * @function sendMsg
 * @description Sends messages to the render process to render the data specified in the PostPrintDate interface and recieves a status of true 
 * 
*/
function sendIpcMsg(channel: any, webContents: any, arg: any) {
    return new Promise((resolve,reject)=>{
        ipcMain.once(`${channel}-reply`, function(event, result) {
            if (result.status) {
                resolve(result);
            } else {
                reject(result.error);
            }
        });
        webContents.send(channel,arg);
    });
}
