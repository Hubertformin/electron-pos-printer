/*
 * Copyright (c) 2019-2022. Author Hubert Formin <hformin@gmail.com>
 */
import { CashDrawerOptions, PosPrintData, PosPrintOptions } from "./models";
import { BrowserWindow } from "electron";
import { join } from "path";
import { spawn } from "child_process";
import { convertPixelsToMicrons, parsePaperSize, parsePaperSizeInMicrons, sendIpcMsg } from "./utils";

if ((process as any).type == "renderer") {
	throw new Error('electron-pos-printer: use remote.require("electron-pos-printer") in the render process');
}

/**
 * @class PosPrinter
 * **/
export class PosPrinter {
	/**
	 * @method: Print object
	 * @param data {PosPrintData[]}
	 * @param options {PosPrintOptions}
	 * @return {Promise}
	 */
	public static print(data: PosPrintData[], options: PosPrintOptions): Promise<any> {
		return new Promise((resolve, reject) => {
			/**
			 * Validation
			 */
			// 1. Reject if printer name is not set in live mode
			if (!options.preview && !options.printerName && !options.silent) {
				reject(new Error("A printer name is required, if you don't want to specify a printer name, set silent to true").toString());
			}
			// 2. Reject if pageSize is object and pageSize.height or pageSize.width is not set
			if (typeof options.pageSize == "object") {
				if (!options.pageSize.height || !options.pageSize.width) {
					reject(new Error("height and width properties are required for options.pageSize"));
				}
			}
			// else
			let printedState = false; // If the job has been printer or not
			let window_print_error: any = null; // The error returned if the printing fails
			let timeOut = options.timeOutPerLine ? options.timeOutPerLine * data.length + 200 : 400 * data.length + 200;

			/**
			 * If in live mode i.e. `options.preview` is false & if `options.silent` is false
			 * Check after a timeOut if the print data has been rendered and printed,
			 * If the data is rendered & printer, printerState will be set to true.
			 *
			 * This is done because we don't want the printing process to hang, so after a specific time, we check if the
			 * printing was completed and resolve/reject the promise.
			 *
			 * The printing process can hang (i.e. the print promise never gets resolved) if the process is trying to
			 * send a print job to a printer that is not connected.
			 *
			 */
			if (!options.preview && !options.silent) {
				setTimeout(() => {
					if (!printedState) {
						const errorMsg = window_print_error || "[TimedOutError] Make sure your printer is connected";
						if (mainWindow && !mainWindow.isDestroyed()) {
							mainWindow.close();
						}
						reject(errorMsg);
						printedState = true;
					}
				}, timeOut);
			}
			/**
			 * Create Browser window
			 * This window is the preview window, and it loads the data to be printer (in html)
			 * The width and height of this window can be customized by the user
			 *
			 */

			let mainWindow = new BrowserWindow({
				...parsePaperSize(options.pageSize),
				show: !!options.preview,
				webPreferences: {
					nodeIntegration: true, // For electron >= 4.0.0
					contextIsolation: false,
				},
			});

			// If the mainWindow is closed, reset the `mainWindow` var to null
			mainWindow.on("closed", () => {
				(mainWindow as any) = null;
			});

			mainWindow.loadFile(options.pathTemplate || join(__dirname, "renderer/index.html"));

			mainWindow.webContents.on("did-finish-load", async () => {
				// get system printers
				// const system_printers = mainWindow.webContents.getPrinters();
				// const printer_index = system_printers.findIndex(sp => sp.name === options.printerName);
				// // if system printer isn't found!!
				// if (!options.preview && printer_index == -1) {
				//     reject(new Error(options.printerName + ' not found. Check if this printer was added to your computer or try updating your drivers').toString());
				//     return;
				// }
				// else start initialize render process page
				await sendIpcMsg("body-init", mainWindow.webContents, options);
				/**
				 * Render print data as html in the mainWindow render process
				 *
				 */
				return PosPrinter.renderPrintDocument(mainWindow, data)
					.then(async () => {
						let { width, height } = parsePaperSizeInMicrons(options.pageSize);
						// Get the height of content window, if the pageSize is a string
						if (typeof options.pageSize === "string") {
							const clientHeight = await mainWindow.webContents.executeJavaScript("document.body.clientHeight");
							height = convertPixelsToMicrons(clientHeight);
						}

						if (!options.preview) {
							const copies = options?.copies || 1;
							let completedCopies = 0;

							/**
							 * Chromium silently caps copies at 1 for many thermal printer drivers.
							 * We loop the print call ourselves so copies always works (#25).
							 */
							const printOneCopy = () => {
								mainWindow.webContents.print(
									{
										silent: !!options.silent,
										printBackground: !!options.printBackground,
										deviceName: options.printerName,
										copies: 1,
										/**
										 * Fix of Issue #81
										 * Custom width & height properties have to be converted to microns for webContents.print else they would fail...
										 *
										 * The minimum micron size Chromium accepts is that where:
										 * Per printing/units.h:
										 *  * kMicronsPerInch - Length of an inch in 0.001mm unit.
										 *  * kPointsPerInch - Length of an inch in CSS's 1pt unit.
										 *
										 * Formula: (kPointsPerInch / kMicronsPerInch) * size >= 1
										 *
										 * Practically, this means microns need to be > 352 microns.
										 * We therefore need to verify this or it will silently fail.
										 *
										 * 1px = 264.5833 microns
										 */
										pageSize: { width, height },
										...(options.header && { header: options.header }),
										...(options.footer && { footer: options.footer }),
										...(options.color && { color: options.color }),
										...(options.printBackground && { printBackground: options.printBackground }),
										...(options.margins && { margins: options.margins }),
										...(options.landscape && { landscape: options.landscape }),
										...(options.scaleFactor && { scaleFactor: options.scaleFactor }),
										...(options.pagesPerSheet && { pagesPerSheet: options.pagesPerSheet }),
										...(options.collate && { collate: options.collate }),
										...(options.pageRanges && { pageRanges: options.pageRanges }),
										...(options.duplexMode && { duplexMode: options.duplexMode }),
										...(options.dpi && { dpi: options.dpi }),
									},
									(success, err) => {
										if (err) {
											window_print_error = err;
											if (!printedState) {
												printedState = true;
												mainWindow.close();
												reject(err);
											}
											return;
										}
										completedCopies++;
										if (completedCopies < copies) {
											printOneCopy();
										} else if (!printedState) {
											printedState = true;
											resolve({ complete: success, options });
											mainWindow.close();
										}
									}
								);
							};
							printOneCopy();
						} else {
							resolve({ complete: true, data, options });
						}
					})
					.catch((err) => reject(err));
			});
		});
	}

	/**
	 * @method sendRawCommand
	 * @param printerName {string} — name of the printer as returned by webContents.getPrinters()
	 * @param data {Buffer} — raw bytes to send (e.g. ESC/POS command sequence)
	 * @return {Promise<void>}
	 * @description Sends raw bytes directly to a printer bypassing the HTML rendering pipeline.
	 * On macOS/Linux uses `lp -d <printer> -o raw`.
	 * On Windows writes to the raw printer port via `copy /b`.
	 */
	public static sendRawCommand(printerName: string, data: Buffer): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!printerName) {
				return reject(new Error("printerName is required for sendRawCommand"));
			}

			const platform = process.platform;

			if (platform === "win32") {
				// Write the buffer to a temp file then use `copy /b` to send raw bytes to the printer
				const os = require("os");
				const fs = require("fs");
				const path = require("path");
				const tmpFile = path.join(os.tmpdir(), `pos_raw_${Date.now()}.bin`);
				try {
					fs.writeFileSync(tmpFile, data);
				} catch (e) {
					return reject(e);
				}
				const child = spawn("cmd.exe", ["/c", `copy /b "${tmpFile}" "${printerName}"`], { shell: false });
				child.on("close", (code) => {
					try { fs.unlinkSync(tmpFile); } catch (_) { /* ignore */ }
					if (code === 0) resolve();
					else reject(new Error(`sendRawCommand failed with exit code ${code}`));
				});
				child.on("error", reject);
			} else {
				// macOS / Linux: lp -d <printer> -o raw -
				const child = spawn("lp", ["-d", printerName, "-o", "raw", "-"], { stdio: ["pipe", "ignore", "pipe"] });
				let stderr = "";
				child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
				child.on("close", (code) => {
					if (code === 0) resolve();
					else reject(new Error(`sendRawCommand failed (lp exit ${code}): ${stderr.trim()}`));
				});
				child.on("error", reject);
				child.stdin.write(data);
				child.stdin.end();
			}
		});
	}

	/**
	 * @method openCashDrawer
	 * @param printerName {string} — name of the printer connected to the cash drawer
	 * @param opts {CashDrawerOptions} — optional pin/timing overrides
	 * @return {Promise<void>}
	 * @description Sends the ESC/POS cash drawer kick command to the named printer.
	 * The standard sequence is: ESC p <pin> <on-time> <off-time>
	 *   - ESC p  = 0x1B 0x70
	 *   - pin    = 0x00 (pin 2) or 0x01 (pin 5)
	 *   - on/off = pulse duration in 2ms units (0–255)
	 */
	public static openCashDrawer(printerName: string, opts: CashDrawerOptions = {}): Promise<void> {
		const pin = opts.pin === 5 ? 0x01 : 0x00;
		const onTime = Math.min(255, Math.max(0, Math.round((opts.onTime ?? 25) / 2)));
		const offTime = Math.min(255, Math.max(0, Math.round((opts.offTime ?? 250) / 2)));
		const cmd = Buffer.from([0x1b, 0x70, pin, onTime, offTime]);
		return PosPrinter.sendRawCommand(printerName, cmd);
	}

	/**
	 * @Method
	 * @Param data {any[]}
	 * @Return {Promise}
	 * @description Render the print data in the render process index.html
	 *
	 */
	private static renderPrintDocument(window: any, data: PosPrintData[]): Promise<any> {
		return new Promise(async (resolve, reject) => {
			// data.forEach(async (line, lineIndex) => );
			for (const [lineIndex, line] of data.entries()) {
				// ========== VALIDATION =========
				/**
				 * Throw an error if image is set without path or url.
				 */
				if (line.type === "image" && !line.path && !line.url) {
					window.close();
					reject(new Error("An Image url/path is required for type image").toString());
					break;
				}
				/**
				 * line.css is unsupported, throw an error if user sets css
				 */
				if ((line as any).css) {
					window.close();
					reject(new Error("`options.css` in {css: " + (line as any).css.toString() + "} is no longer supported. Please use `options.style` instead. Example: {style: {fontSize: 12}}"));
					break;
				}
				/**
				 * line.style is no longer a string but an object, throw and error if a use still sets a string
				 *
				 */
				if (!!line.style && typeof line.style !== "object") {
					window.close();
					reject(new Error('`options.styles` at "' + line.style + '" should be an object. Example: {style: {fontSize: 12}}'));
					break;
				}

				await sendIpcMsg("render-line", window.webContents, { line, lineIndex })
					.then((result: any) => {
						if (!result.status) {
							window.close();
							reject(result.error);
							return;
						}
					})
					.catch((error) => {
						reject(error);
						return;
					});
			}
			// when the render process is done rendering the page, resolve
			resolve({ message: "page-rendered" });
		});
	}
}
