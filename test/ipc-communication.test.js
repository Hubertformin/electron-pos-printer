const { _electron: electron } = require("playwright");
const { test, expect } = require("@playwright/test");

test.describe("IPC Communication Tests", () => {
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

	test("should send test-print IPC message when button clicked", async () => {
		let messageReceived = false;
		let messageData = null;

		// Set up IPC listener in main process
		const messagePromise = electronApp.evaluate(({ ipcMain }) => {
			return new Promise((resolve) => {
				const handler = (event, data) => {
					ipcMain.removeListener("test-print", handler);
					resolve({ received: true, data });
				};
				ipcMain.on("test-print", handler);

				// Timeout after 5 seconds
				setTimeout(() => {
					ipcMain.removeListener("test-print", handler);
					resolve({ received: false, data: null });
				}, 5000);
			});
		});

		// Click the button to trigger IPC message
		const button = window.locator("button.btn");
		await button.click();

		// Wait for the message
		const result = await messagePromise;

		expect(result.received).toBe(true);
		expect(result.data).toEqual({});
	});

	test("should have ipcRenderer available in renderer process", async () => {
		const hasIpcRenderer = await window.evaluate(() => {
			try {
				const { ipcRenderer } = require("electron");
				return typeof ipcRenderer === "object" && typeof ipcRenderer.send === "function";
			} catch (e) {
				return false;
			}
		});
		expect(hasIpcRenderer).toBe(true);
	});

	test("should be able to send custom IPC messages", async () => {
		let customMessageReceived = false;

		// Set up listener for custom message
		const messagePromise = electronApp.evaluate(({ ipcMain }) => {
			return new Promise((resolve) => {
				const handler = (event, data) => {
					ipcMain.removeListener("test-custom-message", handler);
					resolve({ received: true, data });
				};
				ipcMain.on("test-custom-message", handler);

				setTimeout(() => {
					ipcMain.removeListener("test-custom-message", handler);
					resolve({ received: false, data: null });
				}, 5000);
			});
		});

		// Send custom message from renderer
		await window.evaluate(() => {
			const { ipcRenderer } = require("electron");
			ipcRenderer.send("test-custom-message", { test: "data", timestamp: Date.now() });
		});

		const result = await messagePromise;

		expect(result.received).toBe(true);
		expect(result.data).toHaveProperty("test", "data");
		expect(result.data).toHaveProperty("timestamp");
	});
});
