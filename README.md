
![License](https://img.shields.io/npm/l/electron-pos-printer)
![Version](https://img.shields.io/npm/v/electron-pos-printer?label=version)
![Issues](https://img.shields.io/github/issues/Hubertformin/electron-pos-printer)

# Electron-pos-printer
A customizable electron.js printing plugin specifically designed for thermal receipt printers.
It supports 80mm, 78mm, 76mm, 58mm, 57mm, 44mm printers. It currently supports versions of electron >= 6.x.x

### Installation
```bash
$ npm install electron-pos-printer
$ yarn add electron-pos-printer
```
### Demo
Check out this [Demo](https://github.com/fssonca/electron-printer ) by [fssonca](https://github.com/fssonca)

### Usage
### In main process
```js
const {PosPrinter} = require("electron-pos-printer");
```
### In render process
```js
const {PosPrinter} = require('electron').remote.require("electron-pos-printer");
```
Electron >= `v10.x.x`
```js
const {PosPrinter} = require('@electron/remote').remote.require("electron-pos-printer");
```

### Example code
```js
const {PosPrinter} = require("electron-pos-printer");
const path = require("path");

const options = {
    preview: false,
    margin: '0 0 0 0',
    copies: 1,
    printerName: 'XP-80C',
    timeOutPerLine: 400,
    pageSize: '80mm' // page size
}

const data = [
    {
        type: 'image',
        url: 'https://randomuser.me/api/portraits/men/43.jpg',     // file path
        position: 'center',                                  // position of image: 'left' | 'center' | 'right'
        width: '160px',                                           // width of image in px; default: auto
        height: '60px',                                          // width of image in px; default: 50 or '50px'
    },{
        type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: 'SAMPLE HEADING',
        style: {fontWeight: "700", textAlign: 'center', fontSize: "24px"}
    },{
        type: 'text',                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: 'Secondary text',
        style: {textDecoration: "underline", fontSize: "10px", textAlign: "center", color: "red"}
    },{
        type: 'barCode',
        value: '023456789010',
        height: 40,                     // height of barcode, applicable only to bar and QR codes
        width: 2,                       // width of barcode, applicable only to bar and QR codes
        displayValue: true,             // Display value below barcode
        fontsize: 12,
    },{
        type: 'qrCode',
        value: 'https://github.com/Hubertformin/electron-pos-printer',
        height: 55,
        width: 55,
        style: { margin: '10 20px 20 20px' }
    },{
        type: 'table',
        // style the table
        style: {border: '1px solid #ddd'},
        // list of the columns to be rendered in the table header
        tableHeader: ['Animal', 'Age'],
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: [
            ['Cat', 2],
            ['Dog', 4],
            ['Horse', 12],
            ['Pig', 4],
        ],
        // list of columns to be rendered in the table footer
        tableFooter: ['Animal', 'Age'],
        // custom style for the table header
        tableHeaderStyle: { backgroundColor: '#000', color: 'white'},
        // custom style for the table body
        tableBodyStyle: {'border': '0.5px solid #ddd'},
        // custom style for the table footer
        tableFooterStyle: {backgroundColor: '#000', color: 'white'},
    },{
        type: 'table',
        style: {border: '1px solid #ddd'},             // style the table
        // list of the columns to be rendered in the table header
        tableHeader: [{type: 'text', value: 'People'}, {type: 'image', path: path.join(__dirname, 'icons/animal.png')}],
        // multi-dimensional array depicting the rows and columns of the table body
        tableBody: [
            [{type: 'text', value: 'Marcus'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/43.jpg'}],
            [{type: 'text', value: 'Boris'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/41.jpg'}],
            [{type: 'text', value: 'Andrew'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/23.jpg'}],
            [{type: 'text', value: 'Tyresse'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/53.jpg'}],
        ],
        // list of columns to be rendered in the table footer
        tableFooter: [{type: 'text', value: 'People'}, 'Image'],
        // custom style for the table header
        tableHeaderStyle: { backgroundColor: 'red', color: 'white'},
        // custom style for the table body
        tableBodyStyle: {'border': '0.5px solid #ddd'},
        // custom style for the table footer
        tableFooterStyle: {backgroundColor: '#000', color: 'white'},
    },
]

PosPrinter.print(data, options)
 .then(console.log)
 .catch((error) => {
    console.error(error);
  });

```

## Typescript
### Usage

```typescript
import {PosPrinter, PosPrintData, PosPrintOptions} from "electron-pos-printer";
import * as path from "path";

const options: PosPrintOptions = {
   preview: false,
   margin: '0 0 0 0',    
   copies: 1,
   printerName: 'XP-80C',
   timeOutPerLine: 400,
   pageSize: '80mm' // page size
}

const data: PosPrintData[] = [
    {
        type: 'image',
        url: 'https://randomuser.me/api/portraits/men/43.jpg',     // file path
        position: 'center',                                  // position of image: 'left' | 'center' | 'right'
        width: '160px',                                           // width of image in px; default: auto
        height: '60px',                                          // width of image in px; default: 50 or '50px'
    },{
        type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
        value: 'SAMPLE HEADING',
        style: {fontWeight: "700", textAlign: 'center', fontSize: "24px"}
    },{
        type: 'text',                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
        value: 'Secondary text',
        style: {textDecoration: "underline", fontSize: "10px", textAlign: "center", color: "red"}
    },{
        type: 'barCode',
        value: '023456789010',
        height: 40,                     // height of barcode, applicable only to bar and QR codes
        width: 2,                       // width of barcode, applicable only to bar and QR codes
        displayValue: true,             // Display value below barcode
        fontsize: 12,
    },{
        type: 'qrCode',
        value: 'https://github.com/Hubertformin/electron-pos-printer',
        height: 55,
        width: 55,
        style: { margin: '10 20px 20 20px' }
    },{
        type: 'table',
        // style the table
        style: {border: '1px solid #ddd'},
        // list of the columns to be rendered in the table header
        tableHeader: ['Animal', 'Age'],
        // multi dimensional array depicting the rows and columns of the table body
        tableBody: [
            ['Cat', 2],
            ['Dog', 4],
            ['Horse', 12],
            ['Pig', 4],
        ],
        // list of columns to be rendered in the table footer
        tableFooter: ['Animal', 'Age'],
        // custom style for the table header
        tableHeaderStyle: { backgroundColor: '#000', color: 'white'},
        // custom style for the table body
        tableBodyStyle: {'border': '0.5px solid #ddd'},
        // custom style for the table footer
        tableFooterStyle: {backgroundColor: '#000', color: 'white'},
    },{
        type: 'table',
        style: {border: '1px solid #ddd'},             // style the table
        // list of the columns to be rendered in the table header
        tableHeader: [{type: 'text', value: 'People'}, {type: 'image', path: path.join(__dirname, 'icons/animal.png')}],
        // multi-dimensional array depicting the rows and columns of the table body
        tableBody: [
            [{type: 'text', value: 'Marcus'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/43.jpg'}],
            [{type: 'text', value: 'Boris'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/41.jpg'}],
            [{type: 'text', value: 'Andrew'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/23.jpg'}],
            [{type: 'text', value: 'Tyresse'}, {type: 'image', url: 'https://randomuser.me/api/portraits/men/53.jpg'}],
        ],
        // list of columns to be rendered in the table footer
        tableFooter: [{type: 'text', value: 'People'}, 'Image'],
        // custom style for the table header
        tableHeaderStyle: { backgroundColor: 'red', color: 'white'},
        // custom style for the table body
        tableBodyStyle: {'border': '0.5px solid #ddd'},
        // custom style for the table footer
        tableFooterStyle: {backgroundColor: '#000', color: 'white'},
    },
]

PosPrinter.print(data, options)
 .then(console.log)
 .catch((error) => {
    console.error(error);
  });
```

## Printing options
| Options        | Required | Type                       | Description                                                                                                                                                                           |
|----------------|:--------:|:---------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| printerName    |    No    | `string`                   | The printer's name. If not set, the system's default printer will be used.                                                                                                            | 
| copies         |    No    | `number`                   | The number of copies to print                                                                                                                                                         |
| preview        |    No    | `boolean`                  | Preview print job in a window. Default is `false`                                                                                                                                     |
| width          |    No    | `string`                   | Width of a page's content                                                                                                                                                             |
| margin         |    No    | `string`                   | Margin of a page's content. CSS margin values can be used Ex. `0 10px`                                                                                                                | 
| timeOutPerLine |    No    | `number`                   | Timeout per line in milliseconds. Default value is 400                                                                                                                                | 
| silent         |    No    | `boolean`                  | To print silently without the system displaying the printer selection window. Default value is `true`                                                                                 | 
| pageSize       |    No    | `PaperSize`, `SizeOptions` | Configure the paper size which is supported by your printer. values are are  `80mm`, `78mm`, `76mm`, `58mm`, `57mm`, `44mm` or object with `width` and `height` properties in pixels. |                                                                                                                                                                                      |
| pathTemplate   |    No    | `string`                   | Path to custom html template. Can be used for custom print styles.                                                                                                                    | 
| header         |    No    | `string`                   | Text to be printed as page header.                                                                                                                                                    | 
| footer         |    No    | `string`                   | Text to be printed as page footer.                                                                                                                                                    | 
| margins        |    No    | `object`                   | Page margins. [See electron docs](https://www.electronjs.org/docs/latest/api/web-contents#contentsprintoptions-callback)                                                              | 
| landscape      |    No    | `boolean`                  | Whether the page should be printed in landscape mode. Default is `false`.                                                                                                             | 
| scaleFactor    |    No    | `number`                   | The scale factor of the web page.                                                                                                                                                     | 
| pagesPerSheet  |    No    | `number`                   | The number of pages to print per page sheet.                                                                                                                                          | 
| collate        |    No    | `boolean`                  | Whether the page should be collated.                                                                                                                                                  | 
| pageRanges     |    No    | `object[]`                 | The page range to print. [See electron docs](https://www.electronjs.org/docs/latest/api/web-contents#contentsprintoptions-callback)                                                   | 
| duplexMode     |    No    | `string`                   | Set the duplex mode of the printed web page. [See electron docs](https://www.electronjs.org/docs/latest/api/web-contents#contentsprintoptions-callback)                               | 
| dpi            |    No    | `object`                   | [See electron docs](https://www.electronjs.org/docs/latest/api/web-contents#contentsprintoptions-callback)                                                                            |

## The Print data object
> ### Important!!
> The `css` property is no longer supported, use the style property instead of css. <br />
> Example: `style: {fontWeight: "700", textAlign: 'center', fontSize: "24px"}`

| Property         | Type                                     | Description                                                                               |
|------------------|------------------------------------------|:------------------------------------------------------------------------------------------|
| type             | `string`                                 | `text`, `qrCode`, `barCode`, `image`, `table` // type `text` can be an html string        |
| value            | `string`                                 | Value of the current row                                                                  |
| height           | `number`                                 | Applicable to type barCode and qrCode                                                     |
| width            | `number`                                 | Applicable to type barCode and qrCode                                                     |
| style            | `PrintDataStyle`                         | Add css styles to line (jsx syntax) <br />ex: `{fontSize: 12, backgroundColor: '#2196f3}` |
| displayValue     | `boolean`                                | Display value of barcode below barcode                                                    |
| position         | `string`                                 | `left`, `center`, `right` applicable to types qrCode and image                            |
| path             | `string`                                 | Path or url to the image asset                                                            |
| url              | `string`                                 | Url to image or a base 64 encoding of image                                               |
| tableHeader      | `PosPrintTableField[]` or `string[]`     | The columns to be rendered in the header of the table. Works with type `table`            |
| tableBody        | `PosPrintTableField[][]` or `string[][]` | The columns to be rendered in the body of the table. Works with type `table`              |
| tableFooter      | `PosPrintTableField[]` or `string[]`     | The columns to rendered it the footer of the table. Works with type `table`               |
| tableHeaderStyle | `string`                                 | Set a custom style to the table header                                                    |
| tableBodyStyle   | `string`                                 | Set a custom style to the table body                                                      |
| tableFooterStyle | `string`                                 | Set a custom style to the table footer                                                    |

## Contributors
Thanks to our [contributors](https://github.com/Hubertformin/electron-pos-printer/graphs/contributors) 🎉👏
- [Hubert Formin](https://github.com/Hubertformin)
- [Sidnei Pacheco](https://github.com/sidneip)
- [Ulisses Constantini](https://github.com/ulissesc)
- [Famous Ketoma](https://github.com/jfamousket)