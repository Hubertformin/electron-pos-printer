export interface PosPrintOptions {
    /**
     * @field preview: bool，false=print，true=pop preview window
     * @field deviceName: string，default device name, check it at webContent.getPrinters()
     * @field timeoutPerLine: int，timeout，actual time is ：data.length * timeoutPerLine ms
     */
    preview?: boolean;
    width?: string;
    margin?: string;
    printerName: string;
    timeOutPerLine?: number;
}
/**
 * @interface
 * @name PosPrinterJobData
 * **/
export interface PosPrintJob {
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
 * @name PosPrintJob
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
    static print(data: PosPrintJob[], options: PosPrintOptions): Promise<any>;
}
export {};
