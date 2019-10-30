export interface PosPrintOptions {
    /**
     * @field copies: number of copies to print
     * @field preview: bool，false=print，true=pop preview window
     * @field deviceName: string，default device name, check it at webContent.getPrinters()
     * @field timeoutPerLine: int，timeout，actual time is ：data.length * timeoutPerLine ms
     */
    copies?: number;
    preview?: boolean;
    printerName: string;
    margin?: string;
    timeOutPerLine?: number;
    width?: string;
}
/**
 * @interface
 * @name PosPrintData
 * **/
export interface PosPrintData {
    type: PosPrinterDataType;
    value: string;
    css?: any;
    style?: string;
    width?: string;
    height?: string;
    fontsize?: string;
    displayValue?: string;
}
/**
 * @type
 * @name PosPrinterDataType
 * **/
declare type PosPrinterDataType = 'text' | 'barCode' | 'qrCode';
/**
 * @class PosPrinter
 * **/
export declare class PosPrinter {
    /**
     * @Method: Print object
     * @Param arg {any}
     * @Return {Promise}
     */
    static print(data: PosPrintData[], options: PosPrintOptions): Promise<any>;
}
export {};
