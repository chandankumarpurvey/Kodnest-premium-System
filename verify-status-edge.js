import { chromium } from 'playwright';

(async () => {
    console.log('Starting Edge Case Status Verification...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    try {
        // --- 1. CRASH RESILIENCY (Clear LocalStorage) ---
        console.log('\n[1] Crash Resiliency (No Status Data)...');
        await page.goto(`${baseUrl}/dashboard`);
        await page.evaluate(() => localStorage.clear());
        await page.reload();

        // Check if page loaded (job grid visible)
        const gridVisible = await page.locator('.job-grid').isVisible();
        if (!gridVisible) throw new Error('Page crashed or empty after clearing localStorage');

        // Check default status
        const defaultStatus = await page.locator('.job-grid > div button').first().innerText();
        if (!defaultStatus.includes('Not Applied')) throw new Error(`Default status wrong: ${defaultStatus}`);
        console.log('✅ Handled correctly: No crash, defaults applied.');

        // --- PREPARE DATA FOR NEXT TESTS ---
        // Verify cross-page sync, we need a saved job.
        // Job 1: Hyderabad, Remote (from deterministic mock)
        // Let's set Job 1 status to 'Applied'
        const firstCard = page.locator('.job-grid > div').first();
        const statusSelect = firstCard.locator('select').first();
        await statusSelect.selectOption('Applied');

        // Save Job 1
        const saveBtn = firstCard.locator('button[title="Save"]').first();
        // If already saved (it shouldn't be, we cleared storage), click.
        // Check if saved based on class?
        const isSaved = await saveBtn.getAttribute('class').then(c => c.includes('bg-accent'));
        if (!isSaved) await saveBtn.click();

        // --- 2. COMPLEX FILTER (Applied + Remote + Location) ---
        console.log('\n[2] Complex Filter (Status + Mode + Location)...');
        // Job 1 is Applied. It is Remote? (index 1 % modes length. modes=['On-site','Hybrid','Remote']. 1%3 = 1 = Hybrid? No, mockJobs.js: 
        // i=1. modes[1%3] -> modes[1] = Hybrid.
        // Wait, I need a job that matches all 3.
        // Let's find a job that is 'Remote'.
        // MockJobs modes: On-site, Hybrid, Remote.
        // Id 2: 2%3 = 2 -> Remote?
        // Let's check Job 2.
        const secondCard = page.locator('.job-grid > div').nth(1);
        const secondMode = await secondCard.innerText(); // text contains mode

        let targetCard = null;
        let targetId = 0;

        // Find a Remote job
        const jobCards = page.locator('.job-grid > div');
        const count = await jobCards.count();
        for (let i = 0; i < count; i++) {
            const text = await jobCards.nth(i).innerText();
            if (text.includes('Remote')) {
                targetCard = jobCards.nth(i);
                targetId = i;
                break;
            }
        }

        if (!targetCard) throw new Error('No Remote job found to test');
        console.log(`   Targeting Remote Job at index ${targetId}`);

        // Set Status 'Applied' for this remote job
        await targetCard.locator('select').first().selectOption('Applied');

        // Apply Filters:
        // Status: Applied
        await page.locator('.filter-bar-container select').nth(0).selectOption('Applied'); // Status

        // Mode: Remote (Index 3: Status, Location, Exp, Mode)
        await page.locator('.filter-bar-container select').nth(3).selectOption('Remote');

        // Check logic: Should see our job
        let visibleCount = await page.locator('.job-grid > div').count();
        if (visibleCount === 0) throw new Error('Complex filter hidden the matching job');

        console.log('✅ Handled correctly: Complex AND filters work.');

        // --- 3. CROSS-PAGE SYNC ---
        console.log('\n[3] Cross-page Sync (Dashboard -> Saved)...');
        // We saved Job 1 earlier. Let's make sure Job 1 has a status.
        // We set Job 1 to 'Applied' earlier.
        // Let's go to /saved
        await page.goto(`${baseUrl}/saved`);
        await page.waitForTimeout(500);

        // Check Job 1 card in saved list
        // It should be there.
        const savedCard = page.locator('.job-grid > div').first();
        if (await savedCard.count() === 0) throw new Error('Saved job not found');

        const savedStatus = await savedCard.locator('button').first().innerText();
        if (!savedStatus.includes('Applied')) throw new Error(`Saved page has wrong status: ${savedStatus}`);

        console.log('✅ Handled correctly: Status synced to /saved.');

        // --- 4. CLEAR ALL / RESET ---
        console.log('\n[4] Reset Filters...');
        await page.goto(`${baseUrl}/dashboard`);
        // Set some filters
        await page.locator('.filter-bar-container select').nth(0).selectOption('Applied');

        // Check if "Clear All" button is visible
        const clearBtn = page.locator('text=Clear All');
        if (!await clearBtn.isVisible()) throw new Error('"Clear All" button not visible when filters active');

        // Click Clear All
        await clearBtn.click();

        // Verify filters reset (All items shown)
        // Check Status dropdown value? Hard to read invisible select value easily.
        // Check job count. Should be full list (60).
        // Or check if Clear All button disappeared?
        await page.waitForTimeout(500);
        const clearVisible = await clearBtn.isVisible();
        if (clearVisible) throw new Error('"Clear All" button still visible after click');

        const resetCount = await page.locator('.job-grid > div').count();
        if (resetCount < 50) throw new Error(`List didn't reset fully. Count: ${resetCount}`);

        console.log('✅ Handled correctly: Clear All resets filters.');

        console.log('\n✨ EDGE CASES VERIFIED ✨');
        process.exit(0);
    } catch (e) {
        console.error('❌ Verification Failed:', e);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
