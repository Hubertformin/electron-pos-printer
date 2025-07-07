const { _electron: electron } = require('playwright');
const { test, expect } = require('@playwright/test');

test.describe('Application launch', () => {
  let electronApp;

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ['./demo'] });
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('shows an initial window', async () => {
    const window = await electronApp.firstWindow({ timeout: 60000 });
    expect(window).toBeDefined();
  });

  test('window title is correct', async () => {
    const window = await electronApp.firstWindow({ timeout: 60000 });
    const title = await window.title();
    expect(title).toBe('Electron Pos Printer Demo');
  });
});