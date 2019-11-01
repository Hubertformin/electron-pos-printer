/*
 * Copyright (c) 2019. Author Hubert Formin <hformin@gmail.com>
 */

const fs = require('fs');
const path = require('path');
const ipcRender = require('electron').ipcRenderer;

const body = $('#main');
let barcodeNumber = 0;
const image_format = ['apng', 'bmp', 'gif', 'ico', 'cur', 'jpeg', 'jpg', 'jpeg', 'jfif', 'pjpeg',
    'pjp', 'png', 'svg', 'tif', 'tiff', 'webp'];

ipcRender.on('print-body-init', function (event, arg) {
    body.css({width: arg.width ? arg.width : 170 , margin: arg.margin ? arg.margin : 0});
    event.sender.send('print-body-init-reply', arg);
});

// for image
ipcRender.on('print-image', function (event, arg) {
    try {
        const data = fs.readFileSync(arg.path);
        let ext = path.extname(arg.path).slice(1);
        if (image_format.indexOf(ext) === -1) {
            event.sender.send('print-image-reply', {
                status: false,
                error: new Error(ext +' file type not supported, consider: ' + image_format.join()).toString()});
            return;
        }
        if (ext === 'svg') { ext = 'svg+xml'; }
        // insert image
        const uri = 'data:image/' + ext + ';base64,' + data.toString('base64');
        const img_con = $(`<div style="width: 100%;text-align:${arg.position ? arg.position : 'left'}"></div>`);
        const img = $(`<img src="${uri}" style="height: ${arg.height ? arg.height : '50px'};width: ${arg.width ? arg.width : 'auto'};${arg.style}" />`);
        if (arg.css) {
            for (const key in arg.css) {
                const item = arg.css[key];
                img.css(key, item);
            }
        }
        // appending
        img_con.prepend(img);
        body.prepend(img_con);
        event.sender.send('print-image-reply', {status: true, error: null});
    }catch (e) {
        // console.error(e);
        event.sender.send('print-image-reply', {status: false, error: e.toString()});
    }
});

ipcRender.on('print-text', function (event, arg) {
    const text = arg.value;
    const css = arg.css;
    const div = $(`<div class="font" style="${arg.style}">${text}</div>`);
    if (css) {
        for (const key in css) {
            const item = css[key];
            div.css(key, item);
        }
    }
    body.append(div);
    event.sender.send('print-text-reply', arg);
});

ipcRender.on('print-qrCode', function (event, arg) {
    body.append(`<div id="qrCode${barcodeNumber}" style="${arg.style};text-align: ${arg.position ? '-webkit-' + arg.position : '-webkit-left'};"></div>`);
    new QRCode(document.getElementById(`qrCode${barcodeNumber}`), {
        text: arg.value,
        width: arg.width ? arg.width : 1,
        height: arg.height ? arg.height : 15,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
    // $(`#qrcode${barcodeNumber}`).attr('style',arg.style);
    barcodeNumber++;
    event.sender.send('print-qrCode-reply', arg);
});

ipcRender.on('print-barCode', function (event, arg) {
    body.append(`<div style="width: 100%;text-align: ${arg.position ? arg.position : 'left'}" class="barcode-container" style="text-align: center;width: 100%;">
            <img class="barCode${barcodeNumber}"  style="${arg.style}"
        jsbarcode-value="${arg.value}"
        jsbarcode-width="${arg.width ? arg.width : 1}"
        jsbarcode-height="${arg.height ? arg.height : 15}"
        jsbarcode-fontsize="${arg.fontsize ? arg.fontsize : 12}"
        jsbarcode-margin="0"
        jsbarcode-displayvalue="${!!arg.displayValue}"/></div>`);
    JsBarcode(`.barCode${barcodeNumber}`).init();
    barcodeNumber++;
    event.sender.send('print-barCode-reply', arg);
})
// functions
function renderImage(imgPath) {
    return new Promise((resolve, reject) => {
        // read image

    });
}
