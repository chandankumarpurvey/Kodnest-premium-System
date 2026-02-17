import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    // 1. Checklist Page (Partially Complete)
    await page.goto(`${baseUrl}/jt/07-test`);
    await page.evaluate(() => localStorage.removeItem('jobTrackerTestStatus')); // Reset
    await page.reload();

    // Check first 3 items
    const items = page.locator('.test-checklist-container .divide-y > div');
    await items.nth(0).click();
    await items.nth(1).click();
    await items.nth(2).click();

    // Open a tooltip
    await items.nth(0).locator('button').click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: 'evidence-checklist.png', fullPage: true });
    console.log('Captured evidence-checklist.png');

    // 2. Locked Ship Page
    await page.goto(`${baseUrl}/jt/08-ship`);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'evidence-ship-locked.png', fullPage: true });
    console.log('Captured evidence-ship-locked.png');

    // 3. Unlocked Ship Page
    await page.goto(`${baseUrl}/jt/07-test`);
    // Click remaining 7 items
    const count = await items.count();
    for (let i = 3; i < count; i++) {
        await items.nth(i).click();
    }

    await page.goto(`${baseUrl}/jt/08-ship`);
    await page.waitForTimeout(1000); // Wait for animation
    await page.screenshot({ path: 'evidence-ship-unlocked.png', fullPage: true });
    console.log('Captured evidence-ship-unlocked.png');

    await browser.close();
})();
