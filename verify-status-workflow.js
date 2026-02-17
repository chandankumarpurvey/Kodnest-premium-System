import { chromium } from 'playwright';

(async () => {
    console.log('Starting Job Status Verification...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    try {
        // Setup: Clear Status, Set Prefs & Digest
        await page.goto(`${baseUrl}/dashboard`);
        await page.evaluate(() => {
            localStorage.removeItem('jobTrackerStatus');
            // Set Prefs
            localStorage.setItem('jobTrackerPreferences', JSON.stringify({
                roleKeywords: 'Developer',
                preferredLocations: ['Bangalore'],
                minMatchScore: 40
            }));
            // Set Digest for today (so we see the view)
            const today = new Date().toISOString().split('T')[0];
            localStorage.setItem(`jobTrackerDigest_${today}`, JSON.stringify([])); // Empty digest is fine, we just need the view
        });
        await page.reload();

        // 1. SET STATUS
        console.log('\nTest 1: Set Status (Applied)...');
        // Find first job card
        const firstCard = page.locator('.job-grid > div').first();
        const title = await firstCard.locator('h3').innerText();
        console.log(`   Job: ${title}`);

        // Change status to Applied
        // Click the status button/dropdown
        // The implementation is a select opacity 0 over a button.
        // We can fill the select directly?
        await firstCard.locator('select').selectOption('Applied');

        // Check if toast appeared? (Hard to catch fast toast)
        // Check localStorage
        const statusData = await page.evaluate(() => JSON.parse(localStorage.getItem('jobTrackerStatus') || '{}'));
        const keys = Object.keys(statusData);
        if (keys.length !== 1 || statusData[keys[0]].status !== 'Applied') {
            throw new Error(`❌ Test 1 Failed: Status not saved correctly. Got ${JSON.stringify(statusData)}`);
        }
        console.log('✅ Test 1 Passed: Status saved to localStorage.');

        // 2. FILTERING
        console.log('\nTest 2: Filter by Status...');
        // Open Filter Bar - Status is the first select (or second?)
        // Status select is the one with options Not Applied, Applied...
        // We can find it by text content of options?
        // Or using class selector in FilterBar?
        // The FilterSelect uses an invisible select too.

        // Select "Applied"
        const applyFilter = page.locator('.filter-bar-container select').nth(0); // Assuming order: Status, Location, etc.
        // wait, let's verify order. Code added status as *first* filter in list?
        // Yes: Status, Location.
        await applyFilter.selectOption('Applied');
        await page.waitForTimeout(500);

        // Count jobs. Should be 1 (or more if others random matched, but we cleared storage)
        const countApplied = await page.locator('.job-grid > div').count();
        if (countApplied < 1) throw new Error('❌ Test 2 Failed: No jobs found when filtering by Applied.');
        // Verify the job title matches
        const appliedTitle = await page.locator('.job-grid > div').first().locator('h3').innerText();
        if (appliedTitle !== title) throw new Error(`❌ Test 2 Failed: Wrong job shown. Expected ${title}, got ${appliedTitle}`);
        console.log('✅ Test 2 Passed: Filtering works.');

        // Filter by Rejected -> Should be 0
        await applyFilter.selectOption('Rejected');
        await page.waitForTimeout(500);
        const countRejected = await page.locator('.job-grid > div').count();
        // It might show Empty State
        const emptyState = await page.locator('text=No jobs found').isVisible();
        if (countRejected > 0 && !emptyState) throw new Error('❌ Test 2 Failed: Jobs shown for Rejected filter when none exist.');
        console.log('✅ Test 2 Passed: Negative filtering works.');

        // 3. PERSISTENCE
        console.log('\nTest 3: Persistence after Reload...');
        await page.reload();
        // Check if status on card is still Applied
        // (Default filter is All on reload? No, filters state resets on reload unless persisted?
        // Dashboard doesn't persist filters in localStorage, so it resets to All.)
        // We just check the card badge.
        const cardStatus = await page.locator('.job-grid > div').first().locator('button > span').innerText();
        if (!cardStatus.includes('Applied')) throw new Error(`❌ Test 3 Failed: Card status reverted. Got ${cardStatus}`);
        console.log('✅ Test 3 Passed: Status persists on UI.');

        // 4. DIGEST UPDATE
        console.log('\nTest 4: Digest Updates...');

        // Debug: Check localStorage before navigation
        const lsBefore = await page.evaluate(() => localStorage.getItem('jobTrackerStatus'));
        console.log(`   LocalStorage Status: ${lsBefore}`);

        await page.goto(`${baseUrl}/digest`);

        // Debug: Check if section exists in DOM even if hidden
        const sectionCount = await page.locator('text=Recent Status Updates').count();
        console.log(`   Section Count: ${sectionCount}`);

        const updateSection = await page.locator('text=Recent Status Updates');
        if (!await updateSection.isVisible()) {
            // Debug: check updates state in component? (Hard from outside)
            // Check allJobs availability? 
            const jobsCount = await page.evaluate(() => {
                // Try to reproduce logic
                const allJobs = window.mockJobs || []; // cant access module var
                return 'Cannot access module scope';
            });
            throw new Error('❌ Test 4 Failed: Update section not visible.');
        }

        const updateRow = await page.locator('table tr').nth(1); // 0 is header
        const rowIndexText = await updateRow.innerText();
        if (!rowIndexText.includes(title)) throw new Error(`❌ Test 4 Failed: Job ${title} not found in updates.`);
        if (!rowIndexText.includes('Applied')) throw new Error('❌ Test 4 Failed: Status not correct in updates.');
        console.log('✅ Test 4 Passed: Digest shows recent updates.');

        console.log('\n✨ STATUS TRACKING VERIFIED ✨');
        process.exit(0);

    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
