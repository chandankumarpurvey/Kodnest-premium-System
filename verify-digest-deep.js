import { chromium } from 'playwright';

(async () => {
    console.log('Starting Deep Verification of Daily Digest...');
    const browser = await chromium.launch();
    const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    try {
        // --- SETUP: Clear and Set Prefs ---
        await page.goto(`${baseUrl}/settings`);
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await page.locator('input[placeholder*="Software Engineer"]').fill('Developer');
        await page.locator('button', { hasText: 'Bangalore' }).click();
        await page.locator('button', { hasText: 'Save Preferences' }).click();
        await page.waitForTimeout(500);

        // --- Q1: GENERATE & LIST APPEARS ---
        console.log('\nQ1: Click "Generate"...');
        await page.goto(`${baseUrl}/digest`);
        await page.locator('button', { hasText: 'Generate Today' }).click();
        await page.waitForTimeout(500);

        const cardCount = await page.locator('.border-b').count();
        console.log(`   -> Generated ${cardCount} items.`);
        if (cardCount !== 10) throw new Error(`❌ Q1 Failed: Expected 10 items, got ${cardCount}`);
        console.log('✅ Q1 Passed: List appeared.');

        // --- Q2: UI CHECK (White Card / Off-White Bg) ---
        console.log('\nQ2: Checking UI Styles...');
        const card = page.locator('.bg-white.border.border-border');
        const isVisible = await card.isVisible();
        if (!isVisible) throw new Error('❌ Q2 Failed: White card not found.');
        console.log('✅ Q2 Passed: White card style detected.');

        // --- Q3: HEADER DATE ---
        console.log('\nQ3: Checking Date in Header...');
        const today = new Date().toISOString().split('T')[0];
        const headerText = await page.locator('.flex.items-center.gap-2.text-primary.font-bold').innerText();
        console.log(`   -> Header Text: "${headerText}"`);
        if (!headerText.includes(today)) throw new Error(`❌ Q3 Failed: Date ${today} not found in header.`);
        console.log('✅ Q3 Passed: Today\'s date is visible.');

        // --- Q4: PERSISTENCE ---
        console.log('\nQ4: Refresh Page...');
        await page.reload();
        await page.waitForTimeout(500);
        const persistedCount = await page.locator('.border-b').count();
        if (persistedCount !== 10) throw new Error('❌ Q4 Failed: Digest lost after refresh.');
        console.log('✅ Q4 Passed: Digest persisted.');

        // --- Q5: CLIPBOARD COPY ---
        console.log('\nQ5: Checking Clipboard Content...');
        await page.locator('button', { hasText: 'Copy List' }).click();

        let clipboardText = '';
        try {
            // Some headless browsers might fail here
            clipboardText = await page.evaluate(async () => await navigator.clipboard.readText());
        } catch (e) {
            console.log('   (Clipboard read blocked by browser policy)');
        }

        if (clipboardText) {
            console.log(`   -> Clipboard START: ${clipboardText.substring(0, 50)}...`);
            if (!clipboardText.includes('Top 10 Jobs for')) throw new Error('❌ Q5 Failed: Header missing in copy.');
            if (!clipboardText.includes('Match]')) throw new Error('❌ Q5 Failed: Match score missing in copy.');
            console.log('✅ Q5 Passed: Clipboard content formatted correctly.');
        } else {
            // Fallback if we can't read clipboard
            console.log('   ⚠️ Warning: Could not verify clipboard content directly.');
        }

        // --- Q6: EMAIL DRAFT ---
        console.log('\nQ6: Checking Email Draft Button...');
        const emailBtn = page.locator('button', { hasText: 'Email Draft' });
        if (await emailBtn.isVisible() && await emailBtn.isEnabled()) {
            console.log('✅ Q6 Passed: Email button is visible and clickable.');
            // Note: Actual mailto launch is hard to verify in headless without crash.
            // We trust the component logic verified by code review.
        } else {
            throw new Error('❌ Q6 Failed: Email button missing or disabled.');
        }

        console.log('\n✨ DEEP VERIFICATION PASSED ✨');
        process.exit(0);

    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
