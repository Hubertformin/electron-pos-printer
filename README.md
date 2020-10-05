
![License](https://img.shields.io/npm/l/electron-pos-printer)
![Version](https://img.shields.io/npm/v/electron-pos-printer?label=version)
![Issues](https://img.shields.io/github/issues/Hubertformin/electron-pos-printer)

# Electron-pos-printer
An electron printer plugin, currently supports 58mm, 
requires electron >= 4.x.x.

### Installation
```bash
$ npm install electron-pos-printer
$ yarn add electron-pos-printer
```
### Usage
#### In main process
```js
const {PosPrinter} = require("electron-pos-printer");
```
#### In render process
```js
const {PosPrinter} = require('electron').remote.require("electron-pos-printer");
```
### Demo

Check out this [Demo](https://github.com/fssonca/electron-printer ) by [fssonca](https://github.com/fssonca) 

```js
const {PosPrinter} = require("electron-pos-printer");
const path = require("path");

const options = {
   preview: false,               // Preview in window or print
   width: '170px',               //  width of content body
   margin: '0 0 0 0',            // margin of content body
   copies: 1,                    // Number of copies to print
   printerName: 'XP-80C',        // printerName: string, check with webContent.getPrinters()
   timeOutPerLine: 400,
   pageSize: { height: 301000, width: 71000 }  // page size
}

const data = [
   {
     type: 'image',                                       
     path: path.join(__dirname, 'assets/banner.png'),     // file path
     position: 'center',                                  // position of image: 'left' | 'center' | 'right'
     width: '60px',                                           // width of image in px; default: auto
     height: '60px',                                          // width of image in px; default: 50 or '50px'
   },{
      type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: 'SAMPLE HEADING',
      style: `text-align:center;`,
      css: {"font-weight": "700", "font-size": "18px"}
   },{
      type: 'text',                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      value: 'Secondary text',
      style: `text-align:left;color: red;`,
      css: {"text-decoration": "underline", "font-size": "10px"}
   },{
      type: 'barCode',
      value: 'HB4587896',
      height: 12,                     // height of barcode, applicable only to bar and QR codes
      width: 1,                       // width of barcode, applicable only to bar and QR codes
      displayValue: true,             // Display value below barcode
      fontsize: 8,
   },{
     type: 'qrCode',
      value: 'https://github.com/Hubertformin/electron-pos-printer',
      height: 55,
      width: 55,
      style: 'margin: 10 20px 20 20px'
    },{
       type: 'table',
       // style the table
       style: 'border: 1px solid #ddd',
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
       tableHeaderStyle: 'background-color: #000; color: white;',
       // custom style for the table body
       tableBodyStyle: 'border: 0.5px solid #ddd',
       // custom style for the table footer
       tableFooterStyle: 'background-color: #000; color: white;',
    },{
       type: 'table',
       style: 'border: 1px solid #ddd',             // style the table
       // list of the columns to be rendered in the table header
       tableHeader: [{type: 'text', value: 'Animal'}, {type: 'image', path: path.join(__dirname, 'icons/animal.png')}],
       // multi dimensional array depicting the rows and columns of the table body
       tableBody: [
           [{type: 'text', value: 'Cat'}, {type: 'image', path: './animals/cat.jpg'}],
           [{type: 'text', value: 'Dog'}, {type: 'image', path: './animals/dog.jpg'}],
           [{type: 'text', value: 'Horse'}, {type: 'image', path: './animals/horse.jpg'}],
           [{type: 'text', value: 'Pig'}, {type: 'image', path: './animals/pig.jpg'}],
       ],
       // list of columns to be rendered in the table footer
       tableFooter: [{type: 'text', value: 'Animal'}, 'Image'],
       // custom style for the table header
       tableHeaderStyle: 'background-color: #000; color: white;',
       // custom style for the table body
       tableBodyStyle: 'border: 0.5px solid #ddd',
       // custom style for the table footer
       tableFooterStyle: 'background-color: #000; color: white;',
    },
]

PosPrinter.print(data, options)
 .then(() => {})
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
   width: '170px',       
   margin: '0 0 0 0',    
   copies: 1,
   printerName: 'XP-80C',
   timeOutPerLine: 400,
   pageSize: { height: 301000, width: 71000 } // page size
}

const data: PosPrintData[] = [
   {
     type: 'image',                                       
     path: path.join(__dirname, 'assets/banner.png'),     // file path
     position: 'center',                                  // position of image: 'left' | 'center' | 'right'
     width: '60px',                                           // width of image in px; default: auto
     height: '60px',                                          // width of image in px; default: 50 or '50px'
   },{
      type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: 'SAMPLE HEADING',
      style: `text-align:center;`,
      css: {"font-weight": "700", "font-size": "18px"}
   },{
      type: 'text',                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      value: 'Secondary text',
      style: `text-align:left;color: red;`,
      css: {"text-decoration": "underline", "font-size": "10px"}
   },{
      type: 'barCode',
      value: 'HB4587896',
      height: 12,                     // height of barcode, applicable only to bar and QR codes
      width: 1,                       // width of barcode, applicable only to bar and QR codes
      displayValue: true,             // Display value below barcode
      fontsize: 8,
   },{
     type: 'qrCode',
      value: 'https://github.com/Hubertformin/electron-pos-printer',
      height: 55,
      width: 55,
      style: 'margin: 10 20px 20 20px'
    },{
       type: 'table',
       // style the table
       style: 'border: 1px solid #ddd',
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
       tableHeaderStyle: 'background-color: #000; color: white;',
       // custom style for the table body
       tableBodyStyle: 'border: 0.5px solid #ddd',
       // custom style for the table footer
       tableFooterStyle: 'background-color: #000; color: white;',
    },{
       type: 'table',
       style: 'border: 1px solid #ddd',             // style the table
       // list of the columns to be rendered in the table header
       tableHeader: [{type: 'text', value: 'Animal'}, {type: 'image', path: path.join(__dirname, 'icons/animal.png')}],
       // multi dimensional array depicting the rows and columns of the table body
       tableBody: [
           [{type: 'text', value: 'Cat'}, {type: 'image', path: './animals/cat.jpg'}],
           [{type: 'text', value: 'Dog'}, {type: 'image', path: './animals/dog.jpg'}],
           [{type: 'text', value: 'Horse'}, {type: 'image', path: './animals/horse.jpg'}],
           [{type: 'text', value: 'Pig'}, {type: 'image', path: './animals/pig.jpg'}],
       ],
       // list of columns to be rendered in the table footer
       tableFooter: [{type: 'text', value: 'Animal'}, 'Image'],
       // custom style for the table header
       tableHeaderStyle: 'background-color: #000; color: white;',
       // custom style for the table body
       tableBodyStyle: 'border: 0.5px solid #ddd',
       // custom style for the table footer
       tableFooterStyle: 'background-color: #000; color: white;',
    },
]
PosPrinter.print(data, options)
 .then(() => {})
 .catch((error) => {
    console.error(error);
  });
```

## Printing options
| Options        |           |
| ------------- |:-------------|
| copies     | (number) number of copies to print |
| preview      | (boolean) preview in a window, default is false |
| width      | (string) width of a page       |
| margin | (string)  margin of a page, css values can be used   | 
| printerName | (string) the printer's name      | 
| timeOutPerLine | (number) timeout per line, default is 200      | 
| silent | (boolean) To print silently without printer selection pop-up, default is true | 
| pageSize | (SizeOptions) Specify the width and height of the print out page |



## The Print data object
|           |                |
|-----------|:--------------|
| type      | (string) 'text', 'qrCode', 'barCode', 'image', 'table' // type 'text' can be an html string |
| value | (string) value of the current row |
| height | (number) applicable to type barCode and qrCode |
| width | (number)  applicable to type barCode and qrCode |
| style | (string)  styles, css rules can be used |
| css | (string) css rules  ex: `{"font-size": "12px"}` |
| displayValue | (boolean)  display value of barcode below barcode |
| position | (string) 'left', 'center', 'right' applicable to type qrCode, barCode and image |
| path | (string) Path to the image asset |
| tableHeader | (PosPrintTableField[], string[]) the columns to be rendered in the header of the table, works with type table |
| tableBody | (PosPrintTableField[][], string[][]) the columns to be rendered in the body of the table, works with type table |
| tableFooter | (PosPrintTableField[], string[]) the columns to rendered it the footer of the table, works with type table |
| tableHeaderStyle | (string) set custom style to the table header |
| tableBodyStyle | (string) set custom style to the table body |
| tableFooterStyle | (string) set custom style to the table footer |

## Author
 - Hubert Formin
 - hformin@gmail.com
 - Twitter: @hformin
 
 [<img src="https://cdn.buymeacoffee.com/buttons/default-blue.png" alt="Buy Me A Coffee" style="height: 51px !important;width: 217px !important;" >](https://www.buymeacoffee.com/hformin)
 
