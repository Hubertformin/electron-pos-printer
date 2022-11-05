const {app, BrowserWindow, ipcMain, screen} = require('electron');
const path = require("path");
const {PosPrinter} = require("../dist/index");



const createWindow = () => {
    const size = screen.getPrimaryDisplay().size;
    console.log(size);
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    win.loadFile('index.html');
    // open deve tools
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();
});

ipcMain.on('test-print', testPrint);


function testPrint() {
    const options = {
        preview: true,               //  width of content body
        margin: 'auto',            // margin of content body
        copies: 1,                    // Number of copies to print
        printerName: 'XP-80C',        // printerName: string, check with webContent.getPrinters()
        timeOutPerLine: 1000,
        pageSize: '80mm'  // page size
    }

    const data = [
        {
            type: 'table',
            style: {border: '1px solid #ddd'},             // style the table
            // list of the columns to be rendered in the table header
            tableHeader: [{type: 'text', value: 'People'}, {
                type: 'image',
                url: 'https://randomuser.me/api/portraits/men/13.jpg'
            }],
            // multidimensional array depicting the rows and columns of the table body
            tableBody: [
                [{type: 'text', value: 'Marcus'}, {
                    type: 'image',
                    url: 'https://randomuser.me/api/portraits/men/43.jpg'
                }],
                [{type: 'text', value: 'Boris'}, {
                    type: 'image',
                    url: 'https://randomuser.me/api/portraits/men/41.jpg'
                }],
                [{type: 'text', value: 'Andrew'}, {
                    type: 'image',
                    url: 'https://randomuser.me/api/portraits/men/23.jpg'
                }],
                [{type: 'text', value: 'Tyresse'}, {
                    type: 'image',
                    url: 'https://randomuser.me/api/portraits/men/53.jpg'
                }],
            ],
            // list of columns to be rendered in the table footer
            tableFooter: [{type: 'text', value: 'People'}, 'Image'],
            // custom style for the table header
            tableHeaderStyle: {backgroundColor: 'red', color: 'white'},
            // custom style for the table body
            tableBodyStyle: {'border': '0.5px solid #ddd'},
            // custom style for the table footer
            tableFooterStyle: {backgroundColor: '#000', color: 'white'},
        },
        {
            type: 'image',
            url: 'https://randomuser.me/api/portraits/men/43.jpg',     // file path
            position: 'center',                                  // position of image: 'left' | 'center' | 'right'
            width: '60px',                                           // width of image in px; default: auto
            height: '60px',
        },
        {
            type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
            value: 'SAMPLE HEADING',
            style: {fontWeight: "700", textAlign: 'center', fontSize: "24px"}
        },
        {
            type: 'text',                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
            value: 'Secondary text',
            style: {textDecoration: "underline", fontSize: "10px", textAlign: "center", color: "red"}
        },
        {
            type: 'barCode',
            value: '023456789010',
            height: 40,                     // height of barcode, applicable only to bar and QR codes
            width: 2,                       // width of barcode, applicable only to bar and QR codes
            displayValue: true,             // Display value below barcode
            fontsize: 12,
        },
        {
            type: 'qrCode',
            value: 'https://github.com/Hubertformin/electron-pos-printer',
            height: 55,
            width: 55,
            position: 'right'
        },
        {
            type: 'table',
            // style the table
            style: {border: '1px solid #ddd'},
            // list of the columns to be rendered in the table header
            tableHeader: ['Animal', 'Age'],
            // multidimensional array depicting the rows and columns of the table body
            tableBody: [
                ['Cat', 2],
                ['Dog', 4],
                ['Horse', 12],
                ['Pig', 4],
            ],
            // list of columns to be rendered in the table footer
            tableFooter: ['Animal', 'Age'],
            // custom style for the table header
            tableHeaderStyle: {backgroundColor: '#000', color: 'white'},
            // custom style for the table body
            tableBodyStyle: {'border': '0.5px solid #ddd'},
            // custom style for the table footer
            tableFooterStyle: {backgroundColor: '#000', color: 'white'},
        }
    ]

    try {
        PosPrinter.print(data, options)
            .then(() => console.log('done'))
            .catch((error) => {
                console.error(error);
            });
    } catch (e) {
        console.log(PosPrinter)
        console.log(e);
    }
}