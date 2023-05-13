/**
 * Copyright (c) 2022. Author Hubert Formin <hformin@gmail.com>.
 *     This file is called the the render process main html file in renderer/index.html
 *     This page renders data into the view.
 *     Render events are sent from the main process, this process on successful render replies with success of failure event
 */
import './index.css';
import {applyElementStyles, generatePageText, generateQRCode, generateTableCell, renderImageToPage} from "./utils";

const ipcRender = require('electron').ipcRenderer;
const JsBarcode = require("jsbarcode");


const body = document.getElementById('main') as HTMLElement;
/**
 * Initialize container in html view, by setting the width and margins specified in the PosPrinter options
 */
ipcRender.on('body-init', function (event, arg) {
    body.style.width = arg?.width || '100%';
    body.style.margin = arg?.margin ||  0;

    event.sender.send('body-init-reply', {status: true, error: null});
});
/**
 * Listen to render event form the main process,
 * Once the main process sends line data, render this data in the web page
 */
ipcRender.on('render-line', renderDataToHTML);
/**
 * @function
 * @name generatePageText
 * @param event {any} IpcEvent
 * @param arg {pass argument of type PosPrintData}
 * @description Render data as HTML to page
 * */
async function renderDataToHTML(event, arg) {
    switch (arg.line.type) {
        case 'text':
            try {
                body.appendChild(generatePageText(arg.line));
                // sending msg
                event.sender.send('render-line-reply', {status: true, error: null});
            } catch (e) {
                event.sender.send('render-line-reply', {status: false, error: (e as any).toString()});
            }
            return;
        case 'image':
            try {
                const img = await renderImageToPage(arg.line);

                body.appendChild(img);
                event.sender.send('render-line-reply', {status: true, error: null});
            } catch (e) {
                event.sender.send('render-line-reply', {status: false, error: (e as any).toString()});
            }
            return;
        case 'qrCode':
            try {
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.justifyContent = arg.line?.position || 'left';

                const qrCode = document.createElement('canvas');
                qrCode.setAttribute('id', `qrCode${arg.lineIndex}`);
                applyElementStyles(qrCode, { 'textAlign': arg.line.position ? '-webkit-' + arg.line.position : '-webkit-left'});

                container.appendChild(qrCode);
                body.appendChild(container);

                await generateQRCode(`qrCode${arg.lineIndex}`, {
                    value: arg.line.value,
                    width: arg.line.width,
                    height: arg.line.height,
                });

                // $(`#qrcode${barcodeNumber}`).attr('style',arg.style);
                event.sender.send('render-line-reply', {status: true, error: null});
            } catch(e) {
                event.sender.send('render-line-reply', {status: false, error: (e as any).toString()});
            }
            return;
        case 'barCode':
            try {
                const barcodeWrapperEl = document.createElement('div')
                const barcodeEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                barcodeEl.setAttributeNS(null, 'id', `barCode-${arg.lineIndex}`);
                barcodeWrapperEl.appendChild(barcodeEl)
                body.appendChild(barcodeWrapperEl);

                if(arg.line?.style){
                    applyElementStyles(barcodeWrapperEl,arg.line.style)
                }else{
                    barcodeWrapperEl.style.display = 'flex';
                    barcodeWrapperEl.style.justifyContent = arg.line?.position || 'left';
                }

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
                event.sender.send('render-line-reply', {status: true, error: null});
            } catch(e) {
                event.sender.send('render-line-reply', {status: false, error: (e as any).toString()});
            }
            return;
        case 'table':
            // Creating table
            let tableContainer = document.createElement('div');
            tableContainer.setAttribute('id', `table-container-${arg.lineIndex}`)
            let table = document.createElement('table');
            table.setAttribute('id', `table${arg.lineIndex}`);
            table = applyElementStyles(table, { ...arg.line.style }) as HTMLTableElement;
            
            let tHeader = document.createElement('thead');
            tHeader = applyElementStyles(tHeader, arg.line.tableHeaderStyle) as HTMLTableSectionElement;
            
            let tBody = document.createElement('tbody');
            tBody = applyElementStyles(tBody, arg.line.tableBodyStyle) as HTMLTableSectionElement;
            
            let tFooter = document.createElement('tfoot');
            tFooter = applyElementStyles(tFooter, arg.line.tableFooterStyle) as HTMLTableSectionElement;
            // 1. Headers
            if (arg.line.tableHeader) {
                for (const headerArg of arg.line.tableHeader) {
                    {
                        if (typeof headerArg === "object") {
                            switch (headerArg.type) {
                                case 'image':
                                    await renderImageToPage(headerArg)
                                        .then(img => {
                                            const th = document.createElement(`th`);
                                            th.appendChild(img);
                                            tHeader.appendChild(th);
                                        }).catch((e) => {
                                            event.sender.send('render-line-reply', {status: false, error: (e as any).toString()});
                                        })
                                    break;
                                case 'text':
                                    tHeader.appendChild(generateTableCell(headerArg, 'th'));
                                    break;
                            }
                        } else {
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
                                    await renderImageToPage(colArg)
                                        .then(img => {
                                            const th = document.createElement(`td`);
                                            th.appendChild(img);
                                            rowTr.appendChild(th);
                                        }).catch((e) => {
                                            event.sender.send('render-line-reply', {status: false, error: (e as any).toString()});
                                        })
                                    break;
                                case 'text':
                                    rowTr.appendChild(generateTableCell(colArg));
                                    break;
                            }
                        } else {
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
                for (const footerArg of arg.line.tableFooter)  {
                    if (typeof footerArg === 'object') {
                        switch (footerArg.type) {
                            case 'image':
                                await renderImageToPage(footerArg)
                                    .then(img => {
                                        const footerTh = document.createElement(`th`);
                                        footerTh.appendChild(img);
                                        tFooter.appendChild(footerTh);
                                    }).catch((e) => {
                                        event.sender.send('render-line-reply', {status: false, error: (e as any).toString()});
                                    })
                                break;
                            case 'text':
                                tFooter.appendChild(generateTableCell(footerArg, 'th'));
                                break;
                        }
                    } else {
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
            event.sender.send('render-line-reply', {status: true, error: null});
            return;
    }
}

