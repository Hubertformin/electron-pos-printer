import { PosPrintData, PosPrintOptions } from "./models";
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
    /**
     * @Method
     * @Param data {any[]}
     * @Return {Promise}
     * @description Render the print data in the render process
     *
     */
    private static renderPrintDocument;
}
