# Electron-pos-printer
Electron printer plugin, currently supports 58mm, 
requires electron >= 4.x.x.  Inspired by 
[electron-thermal-printer](https://https://www.npmjs.com/package/electron-thermal-printer)

### Installation
```bash
$ npm install electron-pos-printer
```

### Usage
```js
const {PosPrinter} = require("electron-pos-printer");

const options = {
   preview: false,               // Preview in window or print
   width: '170px',               //  width of content body
   margin: '0 0 0 0',            // margin of content body
   printerName: 'XP-80C',        // printerName: string, check it at webContent.getPrinters()
   timeOutPerLine: 400
}

const data = [
   {
      type: 'text',                       // 'text' | 'barCode' | 'qrCode'
      value: 'SAMPLE HEADING',
      style: `text-align:center;`,
      css: {"font-weight": "700", "font-size": "18px"}
   },{
      type: 'barCode',
      value: 'HB4587896',
      height: 12,                     // height of barcode, applicable only to bar and QR codes
      width: 1,                       // width of barcode, applicable only to bar and QR codes
      displayValue: true,             // Display barcode value below barcode
      fontsize: 8,
   },{
     type: 'qrCode',
      value: 'https://github.com/Hubertformin/electron-pos-printer',
      height: 55,
      width: 55,
      style: `text-align:center;width:55px;margin: 10 20px 20 20px`
    }
]

PosPrinter.print(data, options)
 .then(() => {})
 .catch((error) => {
    console.error(error);
  });

```

## Typescript

```bash
$ npm install @types/electron-pos-printer
```
### Usage

```typescript
import {PosPrintData, PosPrinter, PosPrintJob,PosPrintOptions} from "electron-pos-printer";

const options: PosPrintOptions = {
   preview: false,
   width: '170px',       
   margin: '0 0 0 0',    
   printerName: 'XP-80C',
   timeOutPerLine: 400
}

const data: PosPrintData = [
   {
      type: 'text',
      value: 'SAMPLE HEADING',
      style: `text-align:center;`,
      css: {"font-weight": "700", "font-size": "18px"}
   },{
      type: 'barCode',
      value: 'HB4587896',
      height: 12,
      width: 1,
      displayValue: true,
      fontsize: 8,
    },{
     type: 'qrCode',
      value: 'https://github.com/Hubertformin/electron-pos-printer',
      height: 55,
      width: 55,
      style: `text-align:center;width:55px;margin: 10 20px 20 20px`
    }
]

PosPrinter.print(data, options)
 .then(() => {})
 .catch((error) => {
    console.error(error);
  });
```
