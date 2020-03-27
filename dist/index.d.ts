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
declare type PosPrintPosition = 'left' | 'center' | 'right';
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
    fontsize?: number;
    displayValue?: boolean;
    position?: PosPrintPosition;
    path?: string;
}
/**
 * @type
 * @name PosPrintType
 * **/
declare type PosPrintType = 'text' | 'barCode' | 'qrCode' | 'image';
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
