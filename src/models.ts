/*
 * Copyright (c) 2019-2020. Author Hubert Formin <hformin@gmail.com>
 */

export declare type PaperSize = 'A3' | 'A4' | 'A5' | 'Legal' | 'Letter' | 'Tabloid';

export interface SizeOptions {
    height: number;
    width: number;
}

export interface PosPrintOptions {
    /**
     * @description Print options
     * {@link https://www.electronjs.org/docs/latest/api/web-contents#contentsprintoptions-callback}
     */
    header?: string;
    footer?: string;
    copies?: number;
    preview?: boolean;
    printerName: string;
    margin?: string;
    timeOutPerLine?: number;
    // width?: string;
    silent?: boolean;
    color?: boolean;
    printBackground?; boolean;
    margins?: {
        marginType?: 'default' | 'none'| 'printableArea'| 'custom',
        top?: number;
        bottom?: number;
        right?: number;
        left?: number;
    }
    landscape?: boolean;
    scaleFactor?: number;
    pagesPerSheet?: number;
    collate?: boolean;
    pageRanges?: { from: number, to: number}[],
    duplexMode?: 'simplex' | 'shortEdge' | 'longEdge',
    pageSize?: PaperSize | SizeOptions,
    dpi?: { horizontal: number, vertical: number }
}
/**
 * @type PosPrintPosition
 * @description Alignment for type barCode and qrCode
 *
 */
export declare type PosPrintPosition = 'left' | 'center' | 'right';
/**
 * @interface
 * @name PosPrintTableField
 * */
export interface PosPrintTableField {
    type: 'text' | 'image';
    value?: string;
    path?: string;
    css?: any;
    style?: string;
    width?: string;  // for type image
    height?: string; // for type image
}

/**
 * @interface
 * @name PosPrintData
 * **/
export interface PosPrintData {
    /**
     * @property type
     * @description type data to print: 'text' | 'barCode' | 'qrcode' | 'image' | 'table'
    */
    type: PosPrintType;
    value?: string;
    css?: any;
    style?: string;
    width?: string;
    height?: string;
    fontsize?: number;       // for barcodes
    displayValue?: boolean;  // for barcodes
    position?: PosPrintPosition;        // for type image, barcode and qrCode; values: 'left'| 'center' | 'right'
    path?: string;                      // image path
    tableHeader?: PosPrintTableField[] | string[],        // specify the columns in table header, to be used with type table
    tableBody?: PosPrintTableField[][] | string[][],         //  specify the columns in table body, to be used with type table
    tableFooter?: PosPrintTableField[] | string[],      //  specify the columns in table footer, to be used with type table
    tableHeaderStyle?: string;                // (type table), set custom style for table header
    tableBodyStyle?: string;                // (type table), set custom style for table body
    tableFooterStyle?: string;             // (type table), set custom style for table footer
}
/**
 * @type PosPrintType
 * @name PosPrintType
 * **/
export declare type PosPrintType = 'text' | 'barCode' | 'qrCode' | 'image' | 'table';
