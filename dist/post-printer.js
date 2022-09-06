"use strict";
/*
 * Copyright (c) 2019-2020. Author Hubert Formin <hformin@gmail.com>
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosPrinter = void 0;
if (process.type == 'renderer') {
    throw new Error('electron-pos-printer: use remote.require("electron-pos-printer") in render process');
}
var _a = require('electron'), BrowserWindow = _a.BrowserWindow, ipcMain = _a.ipcMain;
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
var PosPrinter = /** @class */ (function () {
    function PosPrinter() {
    }
    /**
     * @Method: Print object
     * @Param arg {any}
     * @Return {Promise}
     */
    PosPrinter.print = function (data, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // reject if printer name is not set in no preview mode
            if (!options.preview && !options.printerName) {
                reject(new Error('A printer name is required').toString());
            }
            // else
            var printedState = false; // If the job has been printer or not
            var window_print_error = null; // The error returned if the printing fails
            var timeOutPerline = options.timeOutPerLine ? options.timeOutPerLine : 400;
            if (!options.preview || !options.silent) {
                setTimeout(function () {
                    if (!printedState) {
                        var errorMsg = window_print_error ? window_print_error : 'TimedOut';
                        reject(errorMsg);
                        printedState = true;
                    }
                }, timeOutPerline * data.length + 200);
            }
            // open electron window
            var mainWindow = new BrowserWindow({
                width: 210,
                height: 1200,
                show: !!options.preview,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false
                }
            });
            // mainWindow
            mainWindow.on('closed', function () {
                mainWindow = null;
            });
            /*mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'print.html'),
                protocol: 'file:',
                slashes: true,
                // baseUrl: 'dist'
            }));*/
            mainWindow.loadFile(__dirname + '/pos.html');
            mainWindow.webContents.on('did-finish-load', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // get system printers
                        // const system_printers = mainWindow.webContents.getPrinters();
                        // const printer_index = system_printers.findIndex(sp => sp.name === options.printerName);
                        // // if system printer isn't found!!
                        // if (!options.preview && printer_index == -1) {
                        //     reject(new Error(options.printerName + ' not found. Check if this printer was added to your computer or try updating your drivers').toString());
                        //     return;
                        // }
                        // else start initialize render prcess page
                        return [4 /*yield*/, sendIpcMsg('body-init', mainWindow.webContents, options)];
                        case 1:
                            // get system printers
                            // const system_printers = mainWindow.webContents.getPrinters();
                            // const printer_index = system_printers.findIndex(sp => sp.name === options.printerName);
                            // // if system printer isn't found!!
                            // if (!options.preview && printer_index == -1) {
                            //     reject(new Error(options.printerName + ' not found. Check if this printer was added to your computer or try updating your drivers').toString());
                            //     return;
                            // }
                            // else start initialize render prcess page
                            _a.sent();
                            /**
                             * Render print data as html in the mainwindow render process
                             *
                             */
                            return [2 /*return*/, PosPrinter.renderPrintDocument(mainWindow, data)
                                    .then(function () {
                                    if (!options.preview) {
                                        mainWindow.webContents.print({
                                            silent: !!options.silent,
                                            printBackground: true,
                                            deviceName: options.printerName,
                                            copies: options.copies ? options.copies : 1,
                                            pageSize: options.pageSize ? options.pageSize : 'A4'
                                        }, function (arg, err) {
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
                                    .catch(function (err) { return reject(err); })];
                    }
                });
            }); });
        });
    };
    /**
     * @Method
     * @Param data {any[]}
     * @Return {Promise}
     * @description Render the print data in the render process
     *
    */
    PosPrinter.renderPrintDocument = function (window, data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            data.forEach(function (line, lineIndex) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (line.type === 'image' && !line.path) {
                                window.close();
                                reject(new Error('An Image path is required for type image').toString());
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, sendIpcMsg('render-line', window.webContents, { line: line, lineIndex: lineIndex })
                                    .then(function (result) {
                                    if (!result.status) {
                                        window.close();
                                        reject(result.error);
                                        return;
                                    }
                                }).catch(function (error) {
                                    reject(error);
                                    return;
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            // when the render process is done rendering the page, resolve
            resolve({ message: 'page-rendered' });
        });
    };
    return PosPrinter;
}());
exports.PosPrinter = PosPrinter;
/**
 * @function sendMsg
 * @description Sends messages to the render process to render the data specified in the PostPrintDate interface and recieves a status of true
 *
*/
function sendIpcMsg(channel, webContents, arg) {
    return new Promise(function (resolve, reject) {
        ipcMain.once("".concat(channel, "-reply"), function (event, result) {
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
