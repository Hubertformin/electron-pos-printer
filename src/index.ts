/*
 * Copyright (c) 2019 created by Hubert Formin
 */


let BrowserWindow;
let ipcMain;

// if process if main
if ((process as any).type === 'browser') {
    BrowserWindow = require('electron').BrowserWindow;
    ipcMain = require('electron').ipcMain
} else {
    BrowserWindow = require('electron').remote.BrowserWindow;
    ipcMain = require('electron').remote.ipcMain;
}
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
/**
 * @interface
 * @name PosPrintData
 * **/
export interface PosPrintData {
    type: PosPrinterDataType;
    value: string;
    css?: any;
    style?: string;
    width?: string;
    height?: string;
    fontsize?: string;
    displayValue?: string;
}
/**
 * @type
 * @name PosPrinterDataType
 * **/
declare type PosPrinterDataType  = 'text' | 'barCode' | 'qrCode';


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
            // some basic validation
            if (!options.printerName) {
                reject(new Error('A Printer name is required in the options object'));
            }
            if (!options.width) {
                options.width = '167px'
            }
            if (!options.margin) {
                options.margin = '0 0 0 0';
            }
            // else
            let resultSent = false;
            let timeOutPerline = options.timeOutPerLine ? options.timeOutPerLine : 200;
            if (!options.preview) {
                setTimeout(() => {
                    if (!resultSent) {
                        reject();
                        resultSent = true;
                    }
                }, timeOutPerline * data.length + 1000);
            }
            // open electron window
            let mainWindow = new BrowserWindow({
                width: 210,
                height: 1200,
                show: !!options.preview,
                webPreferences: {
                    nodeIntegration: true
                }
            });
            // mainWindow
            mainWindow.on('closed', () => {
                (mainWindow as any) = null;
            });
            mainWindow.loadFile(__dirname + '/print.html');
            mainWindow.webContents.on('did-finish-load', () => {
                sendMsg('print-body-init', mainWindow.webContents, options);
                // initialize page
                new Promise((resolve, reject) => {
                    PrintLine(0);
                    function PrintLine(line) {
                        if (line >= data.length) {
                            resolve();
                            return;
                        }
                        let obj = data[line];
                        switch (obj.type) {
                            case 'text':
                                sendMsg('print-text', mainWindow.webContents, obj)
                                    .then(result => {
                                        // console.log(result);
                                        PrintLine(line + 1);
                                    });
                                break;
                            case 'barCode':
                                sendMsg('print-barCode', mainWindow.webContents, obj)
                                    .then(result => {
                                        PrintLine(line + 1);
                                    });
                                break;
                            case 'qrCode':
                                sendMsg('print-qrCode', mainWindow.webContents, obj)
                                    .then((result)=> {
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
                            if (err) {
                                reject(err);
                            }
                            if (!resultSent) {
                                resolve(arg);
                                resultSent = true;
                            }
                            mainWindow.close();
                        })
                    } else {
                        resolve(options);
                    }
                }).catch(err => resolve(err));
            })
        });
    }   
}


/*ipcMain.on('pos-print', (event, arg)=> {
    const {data, options} = require('')
    PosPrinter.print(arg, {printerName: 'xpc-80'}).then((arg)=>{
        event.sendMsg('print-pos-reply', arg);
    }).catch(()=>{
        event.sendMsg('print-pos-reply', false);
    });
});*/

function sendMsg(channel: any, webContents: any, arg: any) {
    return new Promise((resolve,reject)=>{
        ipcMain.once(`${channel}-reply`, function(event, result) {
            resolve(result);
        });
        webContents.send(channel,arg);
    });
}
