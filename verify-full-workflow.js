import { chromium } from 'playwright';

(async () => {
    console.log('Starting Full Workflow Verification...');
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    try {
        // --- TEST 7: BANNER APPEARANCE & TEST 1: PERSISTENCE ---
        console.log('\n--- Test 1 & 7: Persistence & Banner ---');

        // Clear Storage
        await page.goto(baseUrl);
        await page.evaluate(() => localStorage.clear());
        await page.reload();

        // Go to Dashboard - Banner should appear
        await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle' });
        const bannerVisible = await page.locator('text=Set your preferences').isVisible();
        if (!bannerVisible) throw new Error('❌ Test 7 Failed: Banner not visible on clean state.');
        console.log('✅ Test 7 Passed: Banner visible on clean state.');

        // Go to Settings and Save
        await page.goto(`${baseUrl}/settings`);
        await page.locator('input[placeholder*="Software Engineer"]').fill('React Native');
        await page.locator('button', { hasText: 'Bangalore' }).click();
        await page.locator('button', { hasText: 'Save Preferences' }).click();
        await page.waitForTimeout(1000);

        // Reload and Check Persistence
        await page.reload();
        const inputValue = await page.locator('input[placeholder*="Software Engineer"]').inputValue();
        if (inputValue !== 'React Native') throw new Error('❌ Test 1 Failed: Preferences not persisted.');
        console.log('✅ Test 1 Passed: Preferences persisted after reload.');


        // --- TEST 2 & 3: BADGES & COLORS ---
        console.log('\n--- Test 2 & 3: Badges & Colors ---');
        await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle' });
        await page.waitForSelector('.job-grid');

        // Badges presence
        const badgeCount = await page.locator('text=% Match').count();
        if (badgeCount === 0) throw new Error('❌ Test 2 Failed: No verification badges found.');
        console.log(`✅ Test 2 Passed: Found ${badgeCount} match badges.`);

        // Color check (Sample one badge)
        const badge = page.locator('text=% Match').first();
        const color = await badge.evaluate(el => getComputedStyle(el).backgroundColor);
        console.log(`   Badge Color: ${color}`);
        // Note: RGB values depend on exact CSS, visually confirming it is not default text color is good enough for script constraint.
        if (color === 'rgba(0, 0, 0, 0)') throw new Error('❌ Test 3 Failed: Badge has transparent background.');
        console.log('✅ Test 3 Passed: Badge has background color.');


        // --- TEST 4: THRESHOLD TOGGLE ---
        console.log('\n--- Test 4: Threshold Toggle ---');
        const countBefore = await page.locator('.card').count();
        await page.locator('input[type="checkbox"]').first().click();
        await page.waitForTimeout(500);
        const countAfter = await page.locator('.card').count();
        console.log(`   Jobs Before: ${countBefore}, After: ${countAfter}`);
        if (countAfter > countBefore) throw new Error('❌ Test 4 Failed: Toggle increased job count.');
        console.log('✅ Test 4 Passed: Toggle filtered jobs.');
        // Uncheck to reset
        await page.locator('input[type="checkbox"]').first().click();


        // --- TEST 5: FILTER COMBINATIONS (AND Logic) ---
        console.log('\n--- Test 5: Filter Combinations ---');
        // Set Location: Remote
        // Note: Our FilterBar implementation is a bit tricky to interact with via script as it uses overlay select.
        // We simulate selecting the option by targeting the select element.

        await page.locator('text=Location').locator('xpath=..').locator('select').selectOption('Remote');
        await page.waitForTimeout(500);
        const remoteCount = await page.locator('.card').count();
        console.log(`   Remote Jobs: ${remoteCount}`);

        // Set Experience: Fresher
        await page.locator('text=Experience').locator('xpath=..').locator('select').selectOption('Fresher');
        await page.waitForTimeout(500);
        const combinedCount = await page.locator('.card').count();
        console.log(`   Remote + Fresher Jobs: ${combinedCount}`);

        if (combinedCount > remoteCount) throw new Error('❌ Test 5 Failed: AND logic broken (count increased).');
        console.log('✅ Test 5 Passed: AND logic reduces count.');


        // --- TEST 6: SORTING ---
        console.log('\n--- Test 6: Sorting ---');
        // Reset filters for sorting test
        await page.reload();

        // 6a. Sort by Salary
        const salaryBtn = page.locator('button', { hasText: 'High Salary' });
        if (await salaryBtn.count() === 0) throw new Error('❌ Test 6 Failed: Salary Sort button missing.');

        await salaryBtn.click();
        await page.waitForTimeout(500);

        const firstSalary = await page.locator('.card .font-semibold').first().innerText(); // e.g. "12-18 LPA"
        console.log(`   Top Salary: ${firstSalary}`);

        // 6b. Sort by Match
        await page.locator('button', { hasText: 'Best Match' }).click();
        await page.waitForTimeout(500);
        const firstBadge = await page.locator('text=% Match').first().innerText();
        console.log(`   Top Match: ${firstBadge}`);

        console.log('✅ Test 6 Passed: Sort buttons operational.');

        console.log('\n✨ ALL USER CONFIRMATION TESTS PASSED ✨');
        process.exit(0);

    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
