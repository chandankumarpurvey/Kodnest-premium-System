import { chromium } from 'playwright';

(async () => {
    console.log('Starting Checklist Break Tests...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    try {
        // --- Setup ---
        await page.goto(`${baseUrl}/jt/07-test`);
        await page.evaluate(() => localStorage.removeItem('jobTrackerTestStatus'));
        await page.reload();

        // 1. Uncheck Item (Toggle Test)
        console.log('\n[1] Testing Toggle (Check -> Uncheck)...');
        const items = page.locator('.test-checklist-container .divide-y > div');
        const header = page.locator('.test-checklist-container');

        // Check Item 1
        await items.nth(0).click();
        if (!await header.locator('text=1 / 10').isVisible()) throw new Error('Failed to check item');

        // Uncheck Item 1
        await items.nth(0).click();
        if (!await header.locator('text=0 / 10').isVisible()) throw new Error('Failed to uncheck item (Count didn\'t return to 0)');
        console.log('✅ Handled correctly: Items are toggleable.');

        // 2. Crash Resiliency (Clear LocalStorage)
        console.log('\n[2] Testing Crash Resiliency (Clear Storage)...');
        // Set some state first
        await items.nth(0).click();
        await items.nth(1).click();

        // Clear storage
        await page.evaluate(() => localStorage.clear());
        await page.reload();

        // Logic check: App should likely initialize empty state without crashing
        const isVisible = await items.nth(0).isVisible();
        if (!isVisible) throw new Error('App crashed or checklist missing after clearing storage');

        const countText = await header.locator('text=0 / 10').isVisible();
        if (!countText) throw new Error('Count did not reset to 0/10 after storage clear');
        console.log('✅ Handled correctly: System reset cleanly without crashing.');

        // 3. Partial Completion Lock
        console.log('\n[3] Testing Partial Completion Lock (<10)...');
        // Check 9 items
        for (let i = 0; i < 9; i++) {
            await items.nth(i).click();
        }

        // Verify 9/10
        if (!await header.locator('text=9 / 10').isVisible()) throw new Error('Failed to set 9/10 state');

        // Try to go to Ship page
        await page.goto(`${baseUrl}/jt/08-ship`);

        // Should be locked
        const lockIcon = await page.locator('.lucide-lock');
        const rocketIcon = await page.locator('.lucide-rocket');

        if (await rocketIcon.isVisible()) throw new Error('Ship Page unlocked with only 9/10 items!');
        if (!await lockIcon.isVisible()) throw new Error('Lock icon missing on Ship page');

        console.log('✅ Handled correctly: Ship page remains locked at 9/10.');

        console.log('\n✨ BREAK TESTS PASSED ✨');
        process.exit(0);

    } catch (e) {
        console.error('❌ Break Test Failed:', e);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
