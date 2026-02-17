import { chromium } from 'playwright';

(async () => {
    console.log('Starting Digest Edge Case Verification...');
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    try {
        // --- TEST 1: NO PREFERENCES (CRASH CHECK) ---
        console.log('\nTest 1: Clear Preferences -> Visit /digest');
        await page.goto(`${baseUrl}/settings`);
        await page.evaluate(() => localStorage.clear());

        await page.goto(`${baseUrl}/digest`);
        const noPrefsText = await page.locator('text=Personalize Your Digest').isVisible();
        if (!noPrefsText) throw new Error('❌ Test 1 Failed: "Personalize Your Digest" message missing.');
        console.log('✅ Test 1 Passed: Handled gracefully.');


        // --- TEST 3: NO MATCHING JOBS ---
        console.log('\nTest 3: Impossible Preferences -> Generate');

        // 1. Set Impossible Prefs
        await page.evaluate(() => {
            const today = new Date().toISOString().split('T')[0];
            localStorage.removeItem(`jobTrackerDigest_${today}`); // Clear digest

            localStorage.setItem('jobTrackerPreferences', JSON.stringify({
                roleKeywords: 'CobolMainframeLegacyXYZ', // Impossible role
                preferredLocations: ['MarsColony'],      // Impossible loc
                preferredMode: ['Telepathic'],           // Impossible mode
                experienceLevel: '100+y',
                skills: 'QuantumComputing',
                minMatchScore: 90
            }));
        });

        // 2. Go to Digest & Generate
        await page.goto(`${baseUrl}/digest`);
        // We might be on "Ready to Generate" page now
        const genBtn = page.locator('button', { hasText: 'Generate Today' });
        if (await genBtn.isVisible()) {
            await genBtn.click();
            await page.waitForTimeout(500);
        }

        // 3. Check for Empty State
        // Debug: Print page text if not found
        const noMatchesText = await page.locator('text=No matching roles found today').isVisible();

        if (!noMatchesText) {
            console.log('   [DEBUG] Page Text Content:');
            const text = await page.locator('body').innerText();
            console.log(text.substring(0, 500)); // Print first 500 chars
            throw new Error('❌ Test 3 Failed: "No matching roles" message missing.');
        }
        console.log('✅ Test 3 Passed: Empty state shown correctly.');


        // --- TEST 2 & 4: IDEMPOTENCY & PERSISTENCE ---
        console.log('\nTest 2 & 4: Idempotency & Persistence');

        await page.evaluate(() => {
            const today = new Date().toISOString().split('T')[0];
            localStorage.removeItem(`jobTrackerDigest_${today}`);

            localStorage.setItem('jobTrackerPreferences', JSON.stringify({
                roleKeywords: 'Developer',
                preferredLocations: ['Bangalore'],
                minMatchScore: 40
            }));
        });

        await page.reload();
        await page.locator('button', { hasText: 'Generate Today' }).click();
        await page.waitForTimeout(500);

        const GenBtn = page.locator('button', { hasText: 'Generate Today' });
        if (await GenBtn.isVisible()) throw new Error('❌ Test 2 Failed: Generate button still visible.');

        await page.reload();
        if (await GenBtn.isVisible()) throw new Error('❌ Test 2 Failed: Generate button reappeared.');

        const count = await page.locator('.border-b').count();
        if (count === 0) throw new Error('❌ Test 4 Failed: Digest content lost.');

        console.log('✅ Test 2 & 4 Passed: Digest locked for the day and persists.');

        console.log('\n✨ DIGEST EDGE CASES PASSED ✨');
        process.exit(0);

    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
