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
/*
 * Copyright (c) 2019. Author Hubert Formin <hformin@gmail.com>
 */
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const ipcRender = require('electron').ipcRenderer;
const JsBarcode = require("jsbarcode");
const body = document.getElementById('main');
ipcRender.on('body-init', function (event, arg) {
    body.style.width = (arg === null || arg === void 0 ? void 0 : arg.width) || '100%';
    body.style.margin = (arg === null || arg === void 0 ? void 0 : arg.margin) || 0;
    event.sender.send('body-init-reply', { status: true, error: null });
});
/**
 * Listen to render request form the main process,
 * Once the main process sends line data, render this data in the web page
 */
ipcRender.on('render-line', function (event, arg) {
    renderDataToHTML(event, arg);
});
/**
 * @function
 * @name generatePageText
 * @param arg {pass argument of type PosPrintData}
 * @description used for type text, used to generate type text
 * */
function generatePageText(arg) {
    const text = arg.value;
    let div = document.createElement('div');
    div.innerHTML = text;
    div = applyElementStyles(div, arg.style);
    return div;
}
/**
 * @function
 * @name generateTableCell
 * @param arg {pass argument of type PosPrintData}
 * @param type {string}
 * @description used for type text, used to generate type text
 * */
function generateTableCell(arg, type = 'td') {
    const text = arg.value;
    let cellElement;
    cellElement = document.createElement(type);
    cellElement.innerHTML = text;
    cellElement = applyElementStyles(cellElement, Object.assign({ padding: '7px 2px' }, arg.style));
    return cellElement;
}
/**
 * @function
 * @name renderImageToPage
 * @param arg {pass argument of type PosPrintData}
 * @description get image from path and return it as a html img
 * */
function renderImageToPage(arg) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        // Check if string is a valid base64, if yes, send the file url directly
        let uri;
        let img_con = document.createElement('div');
        const image_format = ['apng', 'bmp', 'gif', 'ico', 'cur', 'jpeg', 'jpg', 'jpeg', 'jfif', 'pjpeg',
            'pjp', 'png', 'svg', 'tif', 'tiff', 'webp'];
        img_con = applyElementStyles(img_con, {
            width: '100%',
            display: 'flex',
            justifyContent: (arg === null || arg === void 0 ? void 0 : arg.position) || 'left'
        });
        if (arg.url) {
            if (!isValidHttpUrl(arg.url) && !isBase64(arg.url)) {
                return reject(`Invalid url: ${arg.url}`);
            }
            uri = arg.url;
        }
        else if (arg.path) {
            // file mut be
            try {
                const data = fs.readFileSync(arg.path);
                let ext = path.extname(arg.path).slice(1);
                if (image_format.indexOf(ext) === -1) {
                    reject(new Error(ext + ' file type not supported, consider the types: ' + image_format.join()));
                }
                if (ext === 'svg') {
                    ext = 'svg+xml';
                }
                // insert image
                uri = 'data:image/' + ext + ';base64,' + data.toString('base64');
            }
            catch (e) {
                reject(e);
            }
        }
        let img = document.createElement("img");
        img = applyElementStyles(img, Object.assign({ height: arg.height, width: arg.width }, arg.style));
        img.src = uri;
        // appending
        img_con.prepend(img);
        resolve(img_con);
    }));
}
/**
 * @function
 * @name generateTableCell
 * @param str {string}
 * @description Checks if a string is a base64 string
 * */
function isBase64(str) {
    return Buffer.from(str, 'base64').toString('base64') === str;
}
/**
 * @function
 * @name generateTableCell
 * @param element {PageElement}
 * @param style {PrintDataStyle}
 * @description Apply styles to created elements on print web page.
 * */
function applyElementStyles(element, style) {
    for (const styleProp of Object.keys(style)) {
        if (!style[styleProp]) {
            continue;
        }
        element.style[styleProp] = style[styleProp];
    }
    return element;
}
/**
 * @function
 * @name generateTableCell
 * @param url {string}
 * @description Checks is if a string is a valid URL
 * */
function isValidHttpUrl(url) {
    let validURL;
    try {
        validURL = new URL(url);
    }
    catch (_) {
        return false;
    }
    return validURL.protocol === "http:" || validURL.protocol === "https:";
}
/**
 * @function
 * @name generateTableCell
 * @param elementId {string}
 * @param options {object}
 * @description Generate QR in page
 * */
function generateQRCode(elementId, { value, height = 15, width = 1 }) {
    return new Promise((resolve, reject) => {
        QRCode.toCanvas(document.getElementById(elementId), value, {
            width,
            height,
            errorCorrectionLevel: 'H',
            color: '#000',
        }, (error) => {
            if (error) {
                return reject(error);
            }
            resolve('success!');
        });
    });
}
/**
 * @function
 * @name generatePageText
 * @param event {any} IpcEvent
 * @param arg {pass argument of type PosPrintData}
 * @description Render data as HTML to page
 * */
function renderDataToHTML(event, arg) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        switch (arg.line.type) {
            case 'text':
                try {
                    body.appendChild(generatePageText(arg.line));
                    // sending msg
                    event.sender.send('render-line-reply', { status: true, error: null });
                }
                catch (e) {
                    event.sender.send('render-line-reply', { status: false, error: e.toString() });
                }
                return;
            case 'image':
                try {
                    const img = yield renderImageToPage(arg.line);
                    body.appendChild(img);
                    event.sender.send('render-line-reply', { status: true, error: null });
                }
                catch (e) {
                    console.log(e);
                    event.sender.send('render-line-reply', { status: false, error: e.toString() });
                }
                return;
            case 'qrCode':
                try {
                    const container = document.createElement('div');
                    container.style.display = 'flex';
                    container.style.justifyContent = ((_a = arg.line) === null || _a === void 0 ? void 0 : _a.position) || 'left';
                    const qrCode = document.createElement('canvas');
                    qrCode.setAttribute('id', `qrCode${arg.lineIndex}`);
                    applyElementStyles(qrCode, { 'textAlign': arg.line.position ? '-webkit-' + arg.line.position : '-webkit-left' });
                    container.appendChild(qrCode);
                    body.appendChild(container);
                    yield generateQRCode(`qrCode${arg.lineIndex}`, {
                        value: arg.line.value,
                        width: arg.line.width,
                        height: arg.line.height,
                    });
                    // $(`#qrcode${barcodeNumber}`).attr('style',arg.style);
                    event.sender.send('render-line-reply', { status: true, error: null });
                }
                catch (e) {
                    event.sender.send('render-line-reply', { status: false, error: e.toString() });
                }
                return;
            case 'barCode':
                try {
                    const barcodeEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    barcodeEl.setAttributeNS(null, 'id', `barCode-${arg.lineIndex}`);
                    body.appendChild(barcodeEl);
                    JsBarcode(`#barCode-${arg.lineIndex}`, arg.line.value, {
                        // format: "",
                        lineColor: "#000",
                        textMargin: 0,
                        fontOptions: 'bold',
                        fontSize: arg.line.fontsize || 12,
                        width: parseInt(arg.line.width) || 4,
                        height: parseInt(arg.line.height) || 40,
                        displayValue: !!arg.line.displayValue
                    });
                    // send
                    event.sender.send('render-line-reply', { status: true, error: null });
                }
                catch (e) {
                    event.sender.send('render-line-reply', { status: false, error: e.toString() });
                }
                return;
            case 'table':
                // Creating table
                let tableContainer = document.createElement('div');
                tableContainer.setAttribute('id', `table-container-${arg.lineIndex}`);
                let table = document.createElement('table');
                table.setAttribute('id', `table${arg.lineIndex}`);
                table = applyElementStyles(table, Object.assign({}, arg.line.style));
                let tHeader = document.createElement('thead');
                tHeader = applyElementStyles(tHeader, arg.line.tableHeaderStyle);
                let tBody = document.createElement('tbody');
                tBody = applyElementStyles(tBody, arg.line.tableBodyStyle);
                let tFooter = document.createElement('tfoot');
                tFooter = applyElementStyles(tFooter, arg.line.tableFooterStyle);
                // 1. Headers
                if (arg.line.tableHeader) {
                    for (const headerArg of arg.line.tableHeader) {
                        {
                            if (typeof headerArg === "object") {
                                switch (headerArg.type) {
                                    case 'image':
                                        yield renderImageToPage(headerArg)
                                            .then(img => {
                                            const th = document.createElement(`th`);
                                            th.appendChild(img);
                                            tHeader.appendChild(th);
                                        }).catch((e) => {
                                            event.sender.send('render-line-reply', { status: false, error: e.toString() });
                                        });
                                        break;
                                    case 'text':
                                        tHeader.appendChild(generateTableCell(headerArg, 'th'));
                                        break;
                                }
                            }
                            else {
                                const th = document.createElement(`th`);
                                th.innerHTML = headerArg;
                                tHeader.appendChild(th);
                            }
                        }
                    }
                }
                // 2. Body
                if (arg.line.tableBody) {
                    for (const bodyRow of arg.line.tableBody) {
                        const rowTr = document.createElement('tr');
                        for (const colArg of bodyRow) {
                            if (typeof colArg === 'object') {
                                switch (colArg.type) {
                                    case 'image':
                                        yield renderImageToPage(colArg)
                                            .then(img => {
                                            const th = document.createElement(`td`);
                                            th.appendChild(img);
                                            rowTr.appendChild(th);
                                        }).catch((e) => {
                                            event.sender.send('render-line-reply', { status: false, error: e.toString() });
                                        });
                                        break;
                                    case 'text':
                                        rowTr.appendChild(generateTableCell(colArg));
                                        break;
                                }
                            }
                            else {
                                const td = document.createElement(`td`);
                                td.innerHTML = colArg;
                                rowTr.appendChild(td);
                            }
                        }
                        tBody.appendChild(rowTr);
                    }
                }
                // 3. Footer
                if (arg.line.tableFooter) {
                    for (const footerArg of arg.line.tableFooter) {
                        if (typeof footerArg === 'object') {
                            switch (footerArg.type) {
                                case 'image':
                                    yield renderImageToPage(footerArg)
                                        .then(img => {
                                        const footerTh = document.createElement(`th`);
                                        footerTh.appendChild(img);
                                        tFooter.appendChild(footerTh);
                                    }).catch((e) => {
                                        event.sender.send('render-line-reply', { status: false, error: e.toString() });
                                    });
                                    break;
                                case 'text':
                                    tFooter.appendChild(generateTableCell(footerArg, 'th'));
                                    break;
                            }
                        }
                        else {
                            const footerTh = document.createElement(`th`);
                            footerTh.innerHTML = footerArg;
                            tFooter.appendChild(footerTh);
                        }
                    }
                }
                // render table
                table.appendChild(tHeader);
                table.appendChild(tBody);
                table.appendChild(tFooter);
                tableContainer.appendChild(table);
                body.appendChild(tableContainer);
                // send
                event.sender.send('render-line-reply', { status: true, error: null });
                return;
        }
    });
}
