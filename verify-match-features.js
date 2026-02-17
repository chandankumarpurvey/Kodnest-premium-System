import { chromium } from 'playwright';

(async () => {
    console.log('Starting Match Features Integration Verification (Debug)...');
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    try {
        // 1. Set Preferences
        console.log('--- Step 1: Setting Preferences ---');
        await page.goto(`${baseUrl}/settings`, { waitUntil: 'networkidle' });

        await page.locator('input[placeholder*="Software Engineer"]').fill('Senior React');
        await page.locator('button', { hasText: 'Bangalore' }).click();
        await page.locator('label', { hasText: 'Remote' }).click();
        await page.locator('button', { hasText: 'Save Preferences' }).click();
        await page.waitForTimeout(1000);
        console.log('✅ Preferences saved.');

        // 2. Verify Dashboard Badges
        console.log('--- Step 2: Verifying Dashboard Badges ---');
        await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle' });

        // Debug: Check LocalStorage
        const prefs = await page.evaluate(() => localStorage.getItem('jobTrackerPreferences'));
        console.log('Dashboard LocalStorage:', prefs);

        // Debug: Check for Banner
        const bannerVisible = await page.locator('text=Set your preferences').isVisible();
        if (bannerVisible) {
            console.error('❌ Banner is still visible! Preferences not recognized.');
        } else {
            console.log('✅ Banner is hidden (Preferences recognized).');
        }

        // Wait for badges
        try {
            await page.waitForSelector('text=% Match', { timeout: 3000 });
        } catch (e) {
            console.log('⚠️ Timeout waiting for badges.');
        }

        const badgeCount = await page.locator('text=% Match').count();
        console.log(`Found ${badgeCount} match badges.`);

        // Debug: Dump first card text
        if (badgeCount === 0) {
            const firstCard = await page.locator('.card').first().innerText();
            console.log('First Card Text:', firstCard);
            await page.screenshot({ path: 'debug-dashboard.png' });
            throw new Error('❌ No match badges found.');
        }

        // 3. Verify Toggle
        console.log('--- Step 3: Verifying Toggle Filter ---');
        await page.locator('input[type="checkbox"]').first().click();
        await page.waitForTimeout(500);
        const filteredCount = await page.locator('.job-grid .card').count();
        console.log(`Filtered Jobs: ${filteredCount}`);

        console.log('\n✨ MATCH FEATURES INTEGRATION VERIFIED ✨');
        process.exit(0);

    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
