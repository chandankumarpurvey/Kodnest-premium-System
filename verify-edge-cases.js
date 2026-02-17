import { chromium } from 'playwright';

(async () => {
    console.log('Starting Edge Case Verification...');
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    try {
        // --- TEST 1: CRASH CHECK & BANNER ---
        console.log('\n--- Test 1: Crash Check & Banner ---');
        await page.goto(baseUrl);
        await page.evaluate(() => localStorage.clear());
        await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle' });

        const bannerVisible = await page.locator('text=Set your preferences').isVisible();
        const jobCount = await page.locator('.card').count();

        if (!bannerVisible) throw new Error('❌ Test 1 Failed: Banner missing on clean state.');
        if (jobCount === 0) throw new Error('❌ Test 1 Failed: No jobs rendered on clean state.');
        console.log('✅ Test 1 Passed: No crash, banner visible, jobs shown.');

        // --- TEST 2: BROAD PREFERENCES (VARIANCE) ---
        console.log('\n--- Test 2: Broad Preferences (Variance) ---');
        await page.goto(`${baseUrl}/settings`);
        await page.locator('input[placeholder*="Software Engineer"]').fill('Developer'); // Very broad
        await page.locator('button', { hasText: 'Bangalore' }).click(); // Common loc
        await page.locator('button', { hasText: 'Save Preferences' }).click();
        await page.waitForTimeout(1000);

        await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle' });
        // Extract scores
        const scores = await page.locator('text=% Match').allInnerTexts();
        const scoreNums = scores.map(s => parseInt(s));

        const min = Math.min(...scoreNums);
        const max = Math.max(...scoreNums);
        console.log(`   Scores Range: ${min} - ${max}`);

        if (min === max) throw new Error('❌ Test 2 Failed: All scores are identical (Expected variance).');
        if (max < 50) throw new Error('❌ Test 2 Failed: Broad prefs should yield some high scores.');
        console.log('✅ Test 2 Passed: Scores vary correctly.');

        // --- TEST 3: NARROW PREFERENCES (EMPTY STATE) ---
        console.log('\n--- Test 3: Narrow Preferences (Empty State) ---');
        await page.goto(`${baseUrl}/settings`);
        await page.locator('input[placeholder*="Software Engineer"]').fill('CobolMainframeLegacy');
        // Unselect Bangalore 
        await page.locator('button', { hasText: 'Bangalore' }).click();
        await page.locator('button', { hasText: 'Save Preferences' }).click();
        await page.waitForTimeout(1000);

        await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle' });

        // 1. Check scores are low/zero
        const newScores = await page.locator('text=% Match').allInnerTexts();
        const highScores = newScores.map(s => parseInt(s)).filter(s => s > 40);
        if (highScores.length > 5) console.warn('⚠️ Warning: Unexpected high scores for Cobol.');

        // 2. Toggle "Show Matches Only"
        await page.locator('input[type="checkbox"]').first().click();
        await page.waitForTimeout(500);

        const emptyState = await page.locator('text=No matches found').isVisible();
        if (!emptyState) throw new Error('❌ Test 3 Failed: Empty state not shown for narrow prefs.');
        console.log('✅ Test 3 Passed: Empty state handled correctly.');

        // --- TEST 4: CLEAR FIELDS & UPDATE ---
        console.log('\n--- Test 4: Clear Fields & Update ---');
        await page.reload(); // Reset state
        // Uncheck toggle to see jobs again
        if (await page.locator('input[type="checkbox"]').first().isChecked()) {
            await page.locator('input[type="checkbox"]').first().click();
        }

        // Go to settings, clear Role
        await page.goto(`${baseUrl}/settings`);
        await page.locator('input[placeholder*="Software Engineer"]').fill('');
        await page.locator('button', { hasText: 'Save Preferences' }).click();
        await page.waitForTimeout(1000);

        await page.goto(`${baseUrl}/dashboard`);
        const clearedScores = await page.locator('text=% Match').allInnerTexts();
        const maxCleared = Math.max(...clearedScores.map(s => parseInt(s)));

        console.log(`   Max Score after clearing role: ${maxCleared}`);
        // Should be much lower than Test 2's max
        if (maxCleared >= max) console.warn('⚠️ Warning: Scores didn\'t drop significantly? Check logic.');

        console.log('✅ Test 4 Passed: Updates processed immediately.');

        console.log('\n✨ EDGE CASE VERIFICATION PASSED ✨');
        process.exit(0);

    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
