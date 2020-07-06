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

export declare type PosPrintPosition = 'left' | 'center' | 'right';

/**
 * @interface
 * @name PosPrintData
 * **/
export interface PosPrintData {
    /**
     * @property type
     * @description type data to print: 'text' | 'barCode' | 'qrcode' | 'image'
    */
    type: PosPrintType;
    value?: string;
    css?: any;
    style?: string;
    width?: string | number;
    height?: string | number;
    fontsize?: number;       // for barcodes
    displayValue?: boolean;  // for barcodes
    // options for images
    position?: PosPrintPosition;        // for type image, barcode and qrCode; values: 'left'| 'center' | 'right'
    path?: string;                      // image path
}
/**
 * @type
 * @name PosPrintType
 * **/
export declare type PosPrintType  = 'text' | 'barCode' | 'qrCode' | 'image';