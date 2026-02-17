import { chromium } from 'playwright';

(async () => {
    console.log('Starting Checklist Feature Verification...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    try {
        // --- Setup ---
        await page.goto(`${baseUrl}/jt/07-test`);
        // Ensure clean state
        await page.evaluate(() => localStorage.removeItem('jobTrackerTestStatus'));
        await page.reload();

        // 1. Check 10 items
        console.log('\n[1] Checking Item Count...');
        const items = page.locator('.test-checklist-container .divide-y > div');
        const count = await items.count();
        if (count !== 10) throw new Error(`Expected 10 items, found ${count}`);
        console.log('✅ Found 10 checklist items.');

        // 2. Check "Tests Passed" count (Live)
        console.log('\n[2] Checking Live Count...');
        const header = page.locator('.test-checklist-container');
        let progressText = await header.locator('text=0 / 10').isVisible();
        if (!progressText) throw new Error('Initial count 0/10 not found');

        // Check 1 item
        await items.nth(0).click();
        progressText = await header.locator('text=1 / 10').isVisible();
        if (!progressText) throw new Error('Count did not update to 1/10');
        console.log('✅ Live count updates correctly.');

        // 3. Tooltips
        console.log('\n[3] Checking Tooltips...');
        // Click info icon on first item
        const infoIcon = items.nth(0).locator('button');
        await infoIcon.click();
        const tooltip = items.nth(0).locator('text=💡');
        if (!await tooltip.isVisible()) throw new Error('Tooltip not visible after click');
        console.log('✅ Tooltip reveals on click.');

        // 4. Persistence (Check 5 items total)
        console.log('\n[4] Checking Persistence (5 items)...');
        // Item 0 is already checked. Check 1, 2, 3, 4.
        await items.nth(1).click();
        await items.nth(2).click();
        await items.nth(3).click();
        await items.nth(4).click();

        // Verify 5/10
        if (!await header.locator('text=5 / 10').isVisible()) throw new Error('Count not 5/10 before reload');

        // Reload
        await page.reload();

        // Verify 5/10 persists
        if (!await header.locator('text=5 / 10').isVisible()) throw new Error('Count 5/10 lost after reload');

        // Verify specific items checked (check class or icon)
        // Implementation Details: Checked item has text-success class on icon container
        // Or simpler: Check if "5 / 10" is there, it implies logic read from local storage.
        console.log('✅ State persists after refresh.');

        // 5. Warning Message (< 10 checked)
        console.log('\n[5] Checking Warning Message...');
        // We have 5/10. Message should be "Complete all verification steps..."
        const warning = await page.locator('text=Complete all verification steps to unlock shipping.');
        if (!await warning.isVisible()) throw new Error('Warning message missing for incomplete tests');
        console.log('✅ Warning message present.');

        // 6. Reset Test Status
        console.log('\n[6] Checking Reset...');
        // Handle Dialog
        page.on('dialog', dialog => dialog.accept());

        const resetBtn = page.locator('button:has-text("Reset Test Status")');
        await resetBtn.click();

        // Check Count 0/10
        await page.waitForTimeout(500); // Wait for state update
        if (!await header.locator('text=0 / 10').isVisible()) throw new Error('Count did not reset to 0/10');

        console.log('✅ Reset functionality works.');

        console.log('\n✨ CHECKLIST FEATURES VERIFIED ✨');
        process.exit(0);

    } catch (e) {
        console.error('❌ Verification Failed:', e);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
