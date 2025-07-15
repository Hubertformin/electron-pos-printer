const { _electron: electron } = require("playwright");
const { test, expect } = require("@playwright/test");

test.describe("Demo UI Tests", () => {
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

	test("should display demo title", async () => {
		const title = await window.locator("h1.title").textContent();
		expect(title).toBe("Elecron Pos Printer Demo");
	});

	test("should have print test button", async () => {
		const button = window.locator("button.btn");
		await expect(button).toBeVisible();

		const buttonText = await button.textContent();
		expect(buttonText).toBe("Print Test page");
	});

	test("button should have correct styling", async () => {
		const button = window.locator("button.btn");
		const styles = await button.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				backgroundColor: computed.backgroundColor,
				color: computed.color,
				fontSize: computed.fontSize,
				padding: computed.padding,
				borderRadius: computed.borderRadius,
			};
		});

		expect(styles.backgroundColor).toBe("rgb(60, 175, 80)");
		expect(styles.color).toBe("rgb(255, 255, 255)");
		expect(styles.fontSize).toBe("16px");
	});

	test("should be able to click print button", async () => {
		const button = window.locator("button.btn");

		// Listen for the IPC message
		let ipcMessageReceived = false;
		electronApp
			.evaluate(({ ipcMain }) => {
				return new Promise((resolve) => {
					ipcMain.once("test-print", () => {
						resolve("test-print-received");
					});
					setTimeout(() => resolve("timeout"), 5000);
				});
			})
			.then((result) => {
				ipcMessageReceived = result === "test-print-received";
			});

		await button.click();

		// Wait a bit for IPC message to be processed
		await window.waitForTimeout(1000);

		// The click should trigger the sendTestPrint function
		// We'll verify this in the IPC communication tests
	});

	test("should have working JavaScript functions", async () => {
		const hasSendTestPrint = await window.evaluate(() => {
			return typeof window.sendTestPrint === "function";
		});
		expect(hasSendTestPrint).toBe(true);
	});
});
