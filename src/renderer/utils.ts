import fs from "fs";
import path from "path";
import { PrintDataStyle } from "../main/models";
const QRCode = require("qrcode");

type PageElement = HTMLElement | HTMLDivElement | HTMLImageElement;
/**
 * @function
 * @name generatePageText
 * @param arg {pass argument of type PosPrintData}
 * @description used for type text, used to generate type text
 * */
export function generatePageText(arg) {
	const text = arg.value;
	let div = document.createElement("div") as HTMLElement;
	div.innerHTML = text;
	div = applyElementStyles(div, arg.style) as HTMLElement;

	return div;
}
/**
 * @function
 * @name generateTableCell
 * @param arg {pass argument of type PosPrintData}
 * @param type {string}
 * @description used for type text, used to generate type text
 * */
export function generateTableCell(arg, type = "td"): HTMLElement {
	const text = arg.value;

	let cellElement: HTMLElement;

	cellElement = document.createElement(type);
	cellElement.innerHTML = text;
	cellElement = applyElementStyles(cellElement, { padding: "7px 2px", ...arg.style });

	return cellElement;
}
/**
 * @function
 * @name renderImageToPage
 * @param arg {pass argument of type PosPrintData}
 * @description get image from path and return it as a html img
 * */
export function renderImageToPage(arg): Promise<HTMLElement> {
	return new Promise(async (resolve, reject) => {
		// Check if string is a valid base64, if yes, send the file url directly
		let uri;
		let img_con = document.createElement("div");

		const image_format = ["apng", "bmp", "gif", "ico", "cur", "jpeg", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "tif", "tiff", "webp"];

		img_con = applyElementStyles(img_con, {
			width: "100%",
			display: "flex",
			justifyContent: arg?.position || "left",
		}) as HTMLDivElement;

		if (arg.url) {
			const isImageBase64 = isBase64(arg.url);
			if (!isValidHttpUrl(arg.url) && !isImageBase64) {
				return reject(`Invalid url: ${arg.url}`);
			}
			if (isImageBase64) {
				// If it already starts with "data:", use it as-is; otherwise wrap as PNG base64
				uri = arg.url.startsWith("data:") ? arg.url : "data:image/png;base64," + arg.url;
			} else {
				uri = arg.url;
			}
		} else if (arg.path) {
			// file mut be
			try {
				const data = fs.readFileSync(arg.path);
				let ext = path.extname(arg.path).slice(1);
				if (image_format.indexOf(ext) === -1) {
					reject(new Error(ext + " file type not supported, consider the types: " + image_format.join()));
				}
				if (ext === "svg") {
					ext = "svg+xml";
				}
				// insert image
				uri = "data:image/" + ext + ";base64," + data.toString("base64");
			} catch (e) {
				reject(e);
			}
		} else {
			reject(new Error("Image requires either a valid url or path property"));
			return;
		}

		if (!uri) {
			reject(new Error("Failed to generate image URI"));
			return;
		}

		let img = document.createElement("img") as HTMLImageElement;

		img = applyElementStyles(img, {
			height: arg.height,
			width: arg.width,
			...arg.style,
		}) as HTMLImageElement;

		img.src = uri;

		// Wait for the image to fully decode into the compositor before resolving.
		// Without this, silent-mode prints fire webContents.print() before the
		// image is painted, producing blank receipts (#113).
		img.decode()
			.then(() => {
				img_con.prepend(img);
				resolve(img_con);
			})
			.catch(() => {
				// decode() unavailable in very old Chromium; fall back gracefully
				img_con.prepend(img);
				resolve(img_con);
			});
	});
}

/**
 * @function
 * @name isBase64
 * @param str {string}
 * @description Checks if a string is a raw base64 payload or a data: URL with base64 content.
 * Handles both padded ("aGVsbG8=") and unpadded ("aGVsbG8") base64.
 * */
export function isBase64(str: string): boolean {
	if (typeof str !== "string") return false;
	// Accept full data URLs: data:<mime>;base64,<payload>
	if (/^data:[^;]+;base64,/.test(str)) return true;
	// Accept raw base64 — strip trailing padding before the round-trip check so
	// unpadded strings (e.g. "aGVsbG8") don't fail due to Node re-adding "=".
	if (!/^[A-Za-z0-9+/]+=*$/.test(str)) return false;
	const stripped = str.replace(/=+$/, "");
	const canonical = Buffer.from(stripped, "base64").toString("base64").replace(/=+$/, "");
	return stripped === canonical;
}

/**
 * @function
 * @name generateTableCell
 * @param element {PageElement}
 * @param style {PrintDataStyle}
 * @description Apply styles to created elements on print web page.
 * */
export function applyElementStyles(element: PageElement, style: PrintDataStyle): PageElement {
	if (!style || typeof style !== "object") {
		return element;
	}

	for (const styleProp of Object.keys(style)) {
		if (!style[styleProp]) {
			continue;
		}
		element.style[styleProp] = style[styleProp];
	}
	return element;
}

/**
 * @function
 * @name generateTableCell
 * @param url {string}
 * @description Checks is if a string is a valid URL
 * */
export function isValidHttpUrl(url: string) {
	let validURL;

	try {
		validURL = new URL(url);
	} catch (_) {
		return false;
	}

	return validURL.protocol === "http:" || validURL.protocol === "https:";
}

/**
 * @function
 * @name generateTableCell
 * @param elementId {string}
 * @param options {object}
 * @description Generate QR in page
 * */
export function generateQRCode(elementId: string, { value, height = 15, width = 1 }) {
	return new Promise((resolve, reject) => {
		const element = document.getElementById(elementId) as HTMLCanvasElement,
			options = {
				width,
				height,
				errorCorrectionLevel: "H",
				color: "#000",
			};
		QRCode.toCanvas(element, value, options)
			.then(resolve)
			.catch((error) => {
				reject(error);
			});
	});
}
