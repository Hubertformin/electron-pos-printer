"use strict";
/*
 * Copyright (c) 2019 created by Hubert Formin
 */
Object.defineProperty(exports, "__esModule", { value: true });
var BrowserWindow;
var ipcMain;
// if process if main
if (process.type === 'browser') {
    BrowserWindow = require('electron').BrowserWindow;
    ipcMain = require('electron').ipcMain;
}
else {
    BrowserWindow = require('electron').remote.BrowserWindow;
    ipcMain = require('electron').remote.ipcMain;
}
/**
 * @class PosPrinter
 * **/
var PosPrinter = /** @class */ (function () {
    function PosPrinter() {
    }
    /**
     * @Method: Print object
     * @Param arg {any}
     * @Return {Promise}
     */
    PosPrinter.print = function (data, options) {
        return new Promise(function (resolve, reject) {
            // some basic validation
            if (!options.printerName) {
                reject(new Error('A Printer name is required in the options object'));
            }
            if (!options.width) {
                options.width = '167px';
            }
            if (!options.margin) {
                options.margin = '0 0 0 0';
            }
            // else
            var resultSent = false;
            var timeOutPerline = options.timeOutPerLine ? options.timeOutPerLine : 200;
            if (!options.preview) {
                setTimeout(function () {
                    if (!resultSent) {
                        reject();
                        resultSent = true;
                    }
                }, timeOutPerline * data.length + 1000);
            }
            // open electron window
            var mainWindow = new BrowserWindow({
                width: 210,
                height: 1200,
                show: !!options.preview,
                webPreferences: {
                    nodeIntegration: true
                }
            });
            // mainWindow
            mainWindow.on('closed', function () {
                mainWindow = null;
            });
            mainWindow.loadFile(__dirname + '/print.html');
            mainWindow.webContents.on('did-finish-load', function () {
                sendMsg('print-body-init', mainWindow.webContents, options);
                // initialize page
                new Promise(function (resolve, reject) {
                    PrintLine(0);
                    function PrintLine(line) {
                        if (line >= data.length) {
                            resolve();
                            return;
                        }
                        var obj = data[line];
                        switch (obj.type) {
                            case 'text':
                                sendMsg('print-text', mainWindow.webContents, obj)
                                    .then(function (result) {
                                    // console.log(result);
                                    PrintLine(line + 1);
                                });
                                break;
                            case 'barCode':
                                sendMsg('print-barCode', mainWindow.webContents, obj)
                                    .then(function (result) {
                                    PrintLine(line + 1);
                                });
                                break;
                            case 'qrCode':
                                sendMsg('print-qrCode', mainWindow.webContents, obj)
                                    .then(function (result) {
                                    // console.log(result);
                                    PrintLine(line + 1);
                                });
                                break;
                            default:
                                PrintLine(line + 1);
                                break;
                        }
                    }
                }).then(function () {
                    if (!options.preview) {
                        mainWindow.webContents.print({
                            silent: true,
                            printBackground: true,
                            deviceName: options.printerName
                        }, function (arg) {
                            if (!resultSent) {
                                resolve(arg);
                                resultSent = true;
                            }
                            mainWindow.close();
                        });
                    }
                    else {
                        resolve(options);
                    }
                });
            });
        });
    };
    return PosPrinter;
}());
exports.PosPrinter = PosPrinter;
/*ipcMain.on('pos-print', (event, arg)=> {
    const {data, options} = require('')
    PosPrinter.print(arg, {printerName: 'xpc-80'}).then((arg)=>{
        event.sendMsg('print-pos-reply', arg);
    }).catch(()=>{
        event.sendMsg('print-pos-reply', false);
    });
});*/
function sendMsg(channel, webContents, arg) {
    return new Promise(function (resolve, reject) {
        ipcMain.once(channel + "-reply", function (event, result) {
            resolve(result);
        });
        webContents.send(channel, arg);
    });
}
