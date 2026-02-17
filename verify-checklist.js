import { chromium } from 'playwright';

(async () => {
    console.log('Starting Checklist Verification...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    try {
        // Clear previous state
        await page.goto(`${baseUrl}/dashboard`);
        await page.evaluate(() => localStorage.removeItem('jobTrackerTestStatus'));
        await page.reload();

        // 1. Verify Ship is Locked
        console.log('\n[1] Checking Initial Lock State...');
        await page.goto(`${baseUrl}/jt/08-ship`);
        const lockIcon = await page.locator('.lucide-lock');
        if (!await lockIcon.isVisible()) throw new Error('Ship page should be locked initially');
        console.log('✅ Ship page is locked.');

        // 2. Complete Checklist
        console.log('\n[2] Completing Checklist...');
        await page.goto(`${baseUrl}/jt/07-test`);

        // Click all 10 items
        const items = await page.locator('.test-checklist-container .divide-y > div');
        const count = await items.count();
        if (count !== 10) throw new Error(`Expected 10 checklist items, found ${count}`);

        for (let i = 0; i < count; i++) {
            await items.nth(i).click();
        }

        // Verify Progress Bar / Text
        const progressText = await page.locator('text=10 / 10');
        if (!await progressText.isVisible()) throw new Error('Progress text did not update to 10/10');
        console.log('✅ Checklist completed.');

        // 3. Verify Unlock
        console.log('\n[3] Checking Unlock State...');
        await page.goto(`${baseUrl}/jt/08-ship`);
        const rocketIcon = await page.locator('.lucide-rocket');
        if (!await rocketIcon.isVisible()) throw new Error('Ship page should be unlocked now');
        console.log('✅ Ship page is UNLOCKED.');

        // 4. Verify Persistence
        console.log('\n[4] Checking Persistence...');
        await page.reload();
        if (!await rocketIcon.isVisible()) throw new Error('Unlock state lost after reload');
        console.log('✅ Unlock persists.');

        // 5. Verify Navigation Link Update (Optional visual check via script might be hard, but we can check text)
        // Link label should contain "🚀 Ship"
        // Note: Nav might be outside router context in some setups, but here it is inside.
        // Let's check the anchor text.
        const navLink = await page.locator('a[href="/jt/08-ship"]');
        const navText = await navLink.innerText();
        if (!navText.includes('🚀')) console.warn('⚠️ Navigation link icon might not have updated to rocket.');
        else console.log('✅ Navigation link updated to Rocket.');

        console.log('\n✨ CHECKLIST SYSTEM VERIFIED ✨');
        process.exit(0);

    } catch (e) {
        console.error('❌ Verification Failed:', e);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
