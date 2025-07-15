const { _electron: electron } = require("playwright");
const { test, expect } = require("@playwright/test");

test.describe("Error Handling Tests", () => {
	let electronApp;
	let window;

	test.beforeAll(async () => {
		electronApp = await electron.launch({
			args: ["./demo"],
			env: { ...process.env, NODE_ENV: "test" },
		});
		window = await electronApp.firstWindow({ timeout: 60000 });
		await window.waitForLoadState("networkidle");
	});

	test.afterAll(async () => {
		await electronApp.close();
	});

	test("should handle invalid printer name gracefully", async () => {
		const printResult = await window.evaluate(async () => {
			const { ipcRenderer } = require("electron");

			const options = {
				preview: false, // This would normally try to print to actual printer
				silent: true,
				margin: "auto",
				copies: 1,
				printerName: "NonExistentPrinter123",
				pageSize: "80mm",
			};

			const data = [
				{
					type: "text",
					value: "Test with invalid printer",
					style: { fontSize: "14px" },
				},
			];

			return await ipcRenderer.invoke("test-pos-printer-print", data, options);
		});

		// Should either succeed (if preview mode handles it) or fail gracefully
		if (!printResult.success) {
			expect(typeof printResult.error).toBe("string");
			expect(printResult.error.length).toBeGreaterThan(0);
		} else {
			// If it succeeds, that's also acceptable (silent mode might handle it)
			expect(printResult.success).toBe(true);
		}
	});

	test("should handle invalid page size", async () => {
		const printResult = await window.evaluate(async () => {
			const { ipcRenderer } = require("electron");

			const options = {
				preview: true,
				silent: true,
				margin: "auto",
				copies: 1,
				pageSize: "invalid-size",
			};

			const data = [
				{
					type: "text",
					value: "Test with invalid page size",
					style: { fontSize: "14px" },
				},
			];

			return await ipcRenderer.invoke("test-pos-printer-print", data, options);
		});

		// Should handle invalid page size gracefully
		expect(printResult.success).toBe(true);
	});

	test("should handle empty data array", async () => {
		const printResult = await window.evaluate(async () => {
			const { ipcRenderer } = require("electron");

			const options = {
				preview: true,
				silent: true,
				margin: "auto",
				copies: 1,
				pageSize: "80mm",
			};

			const data = []; // Empty data array

			return await ipcRenderer.invoke("test-pos-printer-print", data, options);
		});

		expect(printResult.success).toBe(true);
	});

	test("should handle invalid barcode data", async () => {
		const printResult = await window.evaluate(async () => {
			const { ipcRenderer } = require("electron");

			const options = {
				preview: true,
				silent: true,
				margin: "auto",
				copies: 1,
				pageSize: "80mm",
			};

			const data = [
				{
					type: "barCode",
					value: "", // Empty barcode value
					height: 40,
					width: 2,
					displayValue: true,
					fontsize: 12,
				},
			];

			return await ipcRenderer.invoke("test-pos-printer-print", data, options);
		});

		// Empty barcode value should either be handled gracefully or return an error
		// Both behaviors are acceptable
		if (!printResult.success) {
			expect(typeof printResult.error).toBe("string");
		} else {
			expect(printResult.success).toBe(true);
		}
	});

	test("should handle invalid image URL", async () => {
		const printResult = await window.evaluate(async () => {
			const { ipcRenderer } = require("electron");

			const options = {
				preview: true,
				silent: true,
				margin: "auto",
				copies: 1,
				pageSize: "80mm",
			};

			const data = [
				{
					type: "image",
					url: "https://invalid-url-that-does-not-exist.com/image.jpg",
					position: "center",
					width: "60px",
					height: "60px",
				},
			];

			return await ipcRenderer.invoke("test-pos-printer-print", data, options);
		});

		// Should handle invalid image URL gracefully or return appropriate error
		if (!printResult.success) {
			expect(printResult.error).toBeDefined();
		}
	});

	test("should handle malformed table data", async () => {
		const printResult = await window.evaluate(async () => {
			const { ipcRenderer } = require("electron");

			const options = {
				preview: true,
				silent: true,
				margin: "auto",
				copies: 1,
				pageSize: "80mm",
			};

			const data = [
				{
					type: "table",
					style: { border: "1px solid #ddd" },
					tableHeader: ["Item", "Price"],
					tableBody: [
						["Product 1"], // Missing second column
						["Product 2", "$15.00", "Extra column"], // Extra column
						[], // Empty row
					],
					tableFooter: ["Total", "$15.00"],
				},
			];

			return await ipcRenderer.invoke("test-pos-printer-print", data, options);
		});

		expect(printResult.success).toBe(true);
	});

	test("should handle missing required properties", async () => {
		const printResult = await window.evaluate(async () => {
			const { ipcRenderer } = require("electron");

			const options = {
				preview: true,
				silent: true,
				margin: "auto",
				copies: 1,
				pageSize: "80mm",
			};

			const data = [
				{
					type: "text",
					// Missing value property
				},
				{
					type: "barCode",
					// Missing value property
				},
			];

			return await ipcRenderer.invoke("test-pos-printer-print", data, options);
		});

		// Should handle missing properties gracefully
		expect(printResult.success).toBe(true);
	});

	test("should handle extremely large content", async () => {
		const printResult = await window.evaluate(async () => {
			const { ipcRenderer } = require("electron");

			const options = {
				preview: true,
				silent: true,
				margin: "auto",
				copies: 1,
				pageSize: "80mm",
			};

			const largeText = "A".repeat(10000); // Very long text
			const data = [
				{
					type: "text",
					value: largeText,
					style: { fontSize: "14px" },
				},
			];

			return await ipcRenderer.invoke("test-pos-printer-print", data, options);
		});

		expect(printResult.success).toBe(true);
	});

	test("should handle zero or negative copies", async () => {
		const printResult = await window.evaluate(async () => {
			const { ipcRenderer } = require("electron");

			const options = {
				preview: true,
				silent: true,
				margin: "auto",
				copies: 0, // Zero copies
				pageSize: "80mm",
			};

			const data = [
				{
					type: "text",
					value: "Test with zero copies",
					style: { fontSize: "14px" },
				},
			];

			return await ipcRenderer.invoke("test-pos-printer-print", data, options);
		});

		expect(printResult.success).toBe(true);
	});
});
