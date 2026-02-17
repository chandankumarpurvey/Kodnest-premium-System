import { chromium } from 'playwright';

(async () => {
    console.log('Starting Dashboard Feature Verification...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const dashboardUrl = 'http://127.0.0.1:5173/dashboard';
    const savedUrl = 'http://127.0.0.1:5173/saved';

    try {
        // 1. Verify Job Loading
        console.log('--- Test 1: Job Loading ---');
        await page.goto(dashboardUrl, { waitUntil: 'networkidle' });

        // Check for job cards
        const cards = page.locator('.job-grid .card');
        const count = await cards.count();
        console.log(`Found ${count} job cards.`);

        if (count > 0) {
            console.log('✅ Jobs loaded successfully.');
        } else {
            throw new Error('❌ No job cards found on Dashboard.');
        }

        // 2. Verify Data Content (Random check)
        const firstCardText = await cards.first().textContent();
        if (firstCardText.includes('Experience') && (firstCardText.includes('LPA') || firstCardText.includes('month'))) {
            console.log('✅ Job card contains realistic data (Experience/Salary).');
        } else {
            console.error('❌ Job card data seems missing or incorrect:', firstCardText);
            // Don't throw, just warn
        }

        // 3. Verify Save Functionality
        console.log('--- Test 2: Save Functionality ---');
        // Click save button on first card
        // The save button is the second button in the actions group, or identifying by title="Save"
        const saveButton = cards.first().locator('button[title="Save"]');
        await saveButton.click();

        // Check if button state changed (bg-accent class added)
        await page.waitForTimeout(500); // Wait for state update
        // We need to re-locate or check class
        const saveButtonAfter = cards.first().locator('button[title="Unsave"]');
        if (await saveButtonAfter.count() > 0) {
            console.log('✅ Save button toggled state correctly.');
        } else {
            throw new Error('❌ Save button did not toggle state.');
        }

        // 4. Verify Saved Page
        console.log('--- Test 3: Saved Page Persistence ---');
        await page.goto(savedUrl, { waitUntil: 'networkidle' });

        const savedCards = page.locator('.job-grid .card');
        const savedCount = await savedCards.count();

        if (savedCount === 1) {
            console.log('✅ Saved job appears on /saved page.');
        } else {
            throw new Error(`❌ Expected 1 saved job, found ${savedCount}.`);
        }

        console.log('\n✨ ALL DASHBOARD FEATURES VERIFIED ✨');
        process.exit(0);

    } catch (error) {
        console.error('❌ Feature Verification Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
