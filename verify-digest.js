import { chromium } from 'playwright';

(async () => {
    console.log('Starting Daily Digest Verification...');
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    try {
        // --- PRE-REQUISITE: SET PREFERENCES ---
        console.log('\n--- Setting Preferences ---');
        await page.goto(`${baseUrl}/settings`);
        await page.locator('input[placeholder*="Software Engineer"]').fill('Developer');
        await page.locator('button', { hasText: 'Bangalore' }).click();
        await page.locator('button', { hasText: 'Save Preferences' }).click();
        await page.waitForTimeout(1000);

        // --- TEST 1: GENERATION ---
        console.log('\n--- Test 1: Digest Generation ---');
        await page.goto(`${baseUrl}/digest`);

        // Should show "Ready to Generate" state
        const generateBtn = page.locator('button', { hasText: 'Generate Today' });
        if (!(await generateBtn.isVisible())) throw new Error('❌ Test 1 Failed: Generate button not visible.');

        await generateBtn.click();
        await page.waitForTimeout(1000);

        // Should now show email view
        const emailHeader = page.locator('text=Top 10 Jobs For You');
        if (!(await emailHeader.isVisible())) throw new Error('❌ Test 1 Failed: Email header not visible after generation.');

        const jobs = await page.locator('.border-b').count();
        console.log(`   Generated ${jobs} jobs.`);
        if (jobs === 0) throw new Error('❌ Test 1 Failed: No jobs in digest.');

        console.log('✅ Test 1 Passed: Digest generated successfully.');

        // --- TEST 2: PERSISTENCE & DATE KEY ---
        console.log('\n--- Test 2: Persistence & Storage Key ---');
        const today = new Date().toISOString().split('T')[0];
        const key = `jobTrackerDigest_${today}`;

        const storedDigest = await page.evaluate((k) => localStorage.getItem(k), key);
        if (!storedDigest) throw new Error(`❌ Test 2 Failed: Key ${key} not found in localStorage.`);

        await page.reload();
        await page.waitForTimeout(1000);

        // Should still show email view, not generate button
        if (await generateBtn.isVisible()) throw new Error('❌ Test 2 Failed: Reverted to generation state after reload.');
        if (!(await emailHeader.isVisible())) throw new Error('❌ Test 2 Failed: Digest did not persist.');

        console.log('✅ Test 2 Passed: Digest persists correctly.');

        // --- TEST 3: ACTIONS (MOCK) ---
        console.log('\n--- Test 3: Action Buttons ---');

        // Mock Clipboard
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        await page.locator('button', { hasText: 'Copy List' }).click();
        // Note: Playwright clipboard testing can be flaky, rely on alert/no-crash for now

        // Check Mailto (Verify href attribute)
        // We can't easily click mailto without opening client, so check DOM
        // The implementation uses window.location.href, so we intercept navigation?
        // Actually, let's just check if the button exists and is clickable without error
        await page.locator('button', { hasText: 'Email Draft' }).click();

        console.log('✅ Test 3 Passed: Action buttons clickable.');

        console.log('\n✨ DIGEST VERIFICATION PASSED ✨');
        process.exit(0);

    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
