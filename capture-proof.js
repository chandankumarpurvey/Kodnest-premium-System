import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    // 1. Proof Page - Not Started
    await page.goto(`${baseUrl}/jt/proof`);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.screenshot({ path: 'evidence-proof-empty.png', fullPage: true });

    // 2. Proof Page - In Progress (Links Filled)
    await page.locator('input').nth(0).fill('https://lovable.dev/project');
    await page.locator('input').nth(1).fill('https://github.com/user/repo');
    await page.locator('input').nth(2).fill('https://project.vercel.app');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'evidence-proof-inprogress.png', fullPage: true });

    // 3. Proof Page - Shipped (Tests Passed)
    await page.evaluate(() => {
        const passed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        localStorage.setItem('jobTrackerTestStatus', JSON.stringify(passed));
    });
    await page.reload();
    await page.waitForTimeout(1000); // Wait for animation
    await page.screenshot({ path: 'evidence-proof-shipped.png', fullPage: true });

    await browser.close();
})();
