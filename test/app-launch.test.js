const { _electron: electron } = require("playwright");
const { test, expect } = require("@playwright/test");

test.describe("Application Launch Tests", () => {
	let electronApp;
	let window;

	test.beforeAll(async () => {
		electronApp = await electron.launch({
			args: ["./demo"],
			env: { ...process.env, NODE_ENV: "test" },
		});
		window = await electronApp.firstWindow({ timeout: 60000 });
	});

	test.afterAll(async () => {
		await electronApp.close();
	});

	test("app should launch successfully", async () => {
		expect(electronApp).toBeDefined();
		expect(window).toBeDefined();
	});

	test("window should have correct title", async () => {
		const title = await window.title();
		expect(title).toBe("Electron Pos Printer Demo");
	});

	test("window should have correct size", async () => {
		const bounds = await window.evaluate(() => ({
			width: window.innerWidth,
			height: window.innerHeight,
		}));
		expect(bounds.width).toBeGreaterThan(0);
		expect(bounds.height).toBeGreaterThan(0);
	});

	test("should load demo HTML correctly", async () => {
		await window.waitForLoadState("networkidle");
		const content = await window.content();
		expect(content).toContain("Elecron Pos Printer Demo");
		expect(content).toContain("Print Test page");
	});

	test("should have electron APIs available", async () => {
		const hasElectron = await window.evaluate(() => {
			return typeof window.require === "function" && typeof window.require("electron") === "object";
		});
		expect(hasElectron).toBe(true);
	});
});
