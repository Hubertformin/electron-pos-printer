"use strict";
/*
 * Copyright (c) 2019. Author Hubert Formin <hformin@gmail.com>
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
if (process.type == 'renderer') {
    throw new Error('electron-pos-printer: use remote.require("electron-pos-printer") in render process');
}
var _a = require('electron'), BrowserWindow = _a.BrowserWindow, ipcMain = _a.ipcMain;
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
            // reject if printer name is not set in no preview
            if (!options.preview && !options.printerName) {
                reject(new Error('A printer name is required').toString());
            }
            // else
            var printedState = false;
            var window_print_error;
            var timeOutPerline = options.timeOutPerLine ? options.timeOutPerLine : 200;
            if (!options.preview) {
                setTimeout(function () {
                    if (!printedState) {
                        reject(window_print_error);
                        printedState = true;
                    }
                }, timeOutPerline * data.length + 1000);
            }
            // open electron window
            var mainWindow = new BrowserWindow({
                width: 210,
                height: 1200,
                show: !!options.preview,
                webPreferences: {
                    nodeIntegration: true // For electron >= 4.0.0
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
                        case 0: return [4 /*yield*/, sendMsg('print-body-init', mainWindow.webContents, options)];
                        case 1:
                            _a.sent();
                            // initialize page
                            new Promise(function () {
                                PrintLine(0);
                                function PrintLine(line) {
                                    if (line >= data.length) {
                                        resolve({ printed: true });
                                    }
                                    var obj = data[line];
                                    switch (obj.type) {
                                        case 'image':
                                            if (!obj.path) {
                                                mainWindow.close();
                                                reject(new Error('An Image path is required for type image'));
                                            }
                                            sendMsg('print-image', mainWindow.webContents, obj)
                                                .then(function (result) {
                                                if (!result.status) {
                                                    mainWindow.close();
                                                    reject(result.error);
                                                }
                                                PrintLine(line + 1);
                                            });
                                            break;
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
                                        deviceName: options.printerName,
                                        copies: options.copies ? options.copies : 1
                                    }, function (arg, err) {
                                        if (err) {
                                            window_print_error = err;
                                            reject(err);
                                        }
                                        if (!printedState) {
                                            resolve(arg);
                                            printedState = true;
                                        }
                                        mainWindow.close();
                                    });
                                }
                                else {
                                    resolve(options);
                                }
                            }).catch(function (err) { return resolve(err); });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    return PosPrinter;
}());
exports.PosPrinter = PosPrinter;
// ipcMain.on('pos-print', (event, arg)=> {
//     const {data, options} = JSON.parse(arg);
//     PosPrinter.print(data, options).then((arg)=>{
//         event.sender.send('print-pos-reply', {status: true, error: {}});
//     }).catch((err)=>{
//         event.sender.send('print-pos-reply', {status: false, error: err});
//     });
// });
function sendMsg(channel, webContents, arg) {
    return new Promise(function (resolve, reject) {
        ipcMain.once(channel + "-reply", function (event, result) {
            resolve(result);
        });
        webContents.send(channel, arg);
    });
}
