/*
 * Copyright (c) 2019-2020. Author Hubert Formin <hformin@gmail.com>
 */
export interface PosPrintOptions {
    /**
     * @field copies: number of copies to print
     * @field preview: bool，false=print，true=pop preview window
     * @field deviceName: string，default device name, check it at webContent.getPrinters()
     * @field timeoutPerLine: int，timeout，actual time is ：data.length * timeoutPerLine ms
     * @field silent: To print silently
     */
    copies?: number;
    preview?: boolean;
    printerName: string;
    margin?: string;
    timeOutPerLine?: number;
    width?: string;
    silent?: boolean;
}

/**
 * @type PosPrintPosition
 * @description Alignment for type barCode and qrCode
 *
 */
export declare type PosPrintPosition = 'left' | 'center' | 'right';

/**
 *
 */
export enum PosPrintTableTheme {
}

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
    tableHeader: PosPrintTableField[] | string[],        // specify rows in table header, to be used with type table
    tableBody: PosPrintTableField[] | string[],         //  specify rows in table body, to be used with type table
    tableFooter: PosPrintTableField[] | string[],      //  specify rows in table footer, to be used with type table
    tableHeaderStyle?: any;                // (type table), set custom style for table header
    tableBodyStyle?: any;                // (type table), set custom style for table body
    tableFooterStyle?: string;             // (type table), set custom style for table footer
}
/**
 * @type PosPrintType
 * @name PosPrintType
 * **/
export declare type PosPrintType = 'text' | 'barCode' | 'qrCode' | 'image' | 'table';
