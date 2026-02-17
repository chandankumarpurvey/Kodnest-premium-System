import { chromium } from 'playwright';

(async () => {
    console.log('Starting Proof Page Verification (Debug Mode)...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    try {
        // --- Setup ---
        await page.goto(`${baseUrl}/jt/proof`);
        await page.evaluate(() => localStorage.removeItem('jobTrackerProofLinks'));
        await page.evaluate(() => localStorage.setItem('jobTrackerTestStatus', '[]'));
        await page.reload();

        // 1. Initial State
        console.log('\n[1] Checking Initial State (Not Started / In Progress)...');
        const badge = page.locator('span.rounded-full');
        await badge.waitFor({ state: 'visible' });

        const badgeText = await badge.innerText();
        console.log(`[DEBUG] Found Badge Text: "${badgeText}"`);

        const normalizedText = badgeText.toUpperCase();
        if (!normalizedText.includes('NOT STARTED') && !normalizedText.includes('IN PROGRESS'))
            throw new Error(`Initial status incorrect. Got: "${badgeText}"`);
        console.log('✅ Initial state verified.');

        // 2. Validation Logic
        console.log('\n[2] Testing Input Validation...');
        const inputs = page.locator('input');
        // Enter invalid URL
        await inputs.nth(0).fill('invalid-url');
        await inputs.nth(0).blur();
        const errorMsg = page.locator('text=Please enter a valid URL');
        if (!await errorMsg.isVisible()) throw new Error('Validation error not shown for invalid URL');

        // Enter valid URL
        await inputs.nth(0).fill('https://lovable.dev/project');
        await inputs.nth(0).blur();
        if (await errorMsg.isVisible()) throw new Error('Error still shown for valid URL');
        console.log('✅ Validation works.');

        // 3. Shipped Logic (Links + Tests)
        console.log('\n[3] Testing Shipped Status...');
        // Fill all links
        await inputs.nth(0).fill('https://lovable.dev/project');
        await inputs.nth(1).fill('https://github.com/user/repo');
        await inputs.nth(2).fill('https://project.vercel.app');

        // Status should be 'In Progress' because tests are missing (Links valid = In Progress)
        // Wait for update
        await page.waitForTimeout(500);
        const progressText = await badge.innerText();
        console.log(`[DEBUG] Badge after links filled: "${progressText}"`);

        // Pass Tests (Mock)
        await page.evaluate(() => {
            const passed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            localStorage.setItem('jobTrackerTestStatus', JSON.stringify(passed));
        });
        await page.reload(); // App checks LS on mount

        // Check Status
        await page.waitForTimeout(500);
        const newBadge = page.locator('span.rounded-full');
        const text = await newBadge.innerText();
        console.log(`[DEBUG] Final Badge Text: "${text}"`);

        if (!text.toUpperCase().includes('SHIPPED')) throw new Error(`Expected SHIPPED, got ${text}`);

        // Check Completion Message
        const successMsg = page.locator('text=Project 1 Shipped Successfully');
        if (!await successMsg.isVisible()) throw new Error('Completion message missing');
        console.log('✅ Shipped logic works (Links + Tests).');

        // 4. Copy Submission
        console.log('\n[4] Testing Copy Submission...');
        // Grant permissions not always needed for headless checks but good practice
        try {
            await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
        } catch (e) {
            console.log('Note: Could not grant clipboard permissions (expected in some envs)');
        }

        const copyBtn = page.locator('button:has-text("Copy Final Submission")');
        await copyBtn.click();

        // Check Toast
        const toast = page.locator('text=Submission copied to clipboard!');
        if (!await toast.isVisible()) throw new Error('Toast not shown');
        console.log('✅ Copy function executed.');

        console.log('\n✨ PROOF SYSTEM VERIFIED ✨');
        process.exit(0);

    } catch (e) {
        console.error('❌ Proof Verification Failed:', e);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
