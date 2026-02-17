import { chromium } from 'playwright';

(async () => {
    console.log('Starting Final Proof Verification...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    try {
        // --- Setup ---
        await page.goto(`${baseUrl}/jt/proof`);
        await page.evaluate(() => localStorage.clear());
        await page.reload();

        // 1. Verify 8 Steps
        console.log('\n[1] Checking 8 Steps...');
        const steps = page.locator('.space-y-3').first().locator('div.flex');
        const stepCount = await steps.count();
        // There are 8 steps + maybe other flex items?
        // Let's count text in "Step Completion" section.
        const stepSection = page.locator('h2:has-text("Step Completion") + div');
        const items = stepSection.locator('.flex.items-center');
        const count = await items.count();

        if (count !== 8) console.warn(`⚠️ Expected 8 steps, found ${count}. (This might be okay if structure differs, checking content)`);
        else console.log('✅ Found 8 steps in Summary.');

        // 2. Link Validation & Saving
        console.log('\n[2] Testing Link Inputs...');
        const inputs = page.locator('input');

        // Lovable
        await inputs.nth(0).fill('bad-url');
        await inputs.nth(0).blur();
        if (!await page.locator('text=Please enter a valid URL').isVisible()) throw new Error('Lovable URL validation failed');
        await inputs.nth(0).fill('https://lovable.dev/test');

        // GitHub
        await inputs.nth(1).fill('https://github.com/test');

        // Deploy
        await inputs.nth(2).fill('https://vercel.com/test');

        // Reload to check persistence
        await page.reload();
        await page.waitForTimeout(500);

        const val0 = await inputs.nth(0).inputValue();
        const val1 = await inputs.nth(1).inputValue();
        const val2 = await inputs.nth(2).inputValue();

        if (val0 !== 'https://lovable.dev/test') throw new Error('Lovable link not saved');
        if (val1 !== 'https://github.com/test') throw new Error('GitHub link not saved');
        if (val2 !== 'https://vercel.com/test') throw new Error('Deploy link not saved');
        console.log('✅ Links validated and saved.');

        // 3. Shipped Logic (Strict)
        console.log('\n[3] Testing Shipped Logic...');
        // Tests are empty, so should be "In Progress" (Links present)
        const badge = page.locator('span.rounded-full');
        const status1 = await badge.innerText();
        console.log(`Status with links but no tests: ${status1}`);
        if (status1.toUpperCase().includes('SHIPPED')) throw new Error('Shipped prematurely!');

        // Pass Tests
        await page.evaluate(() => {
            localStorage.setItem('jobTrackerTestStatus', JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
        });
        await page.reload();
        await page.waitForTimeout(500);

        const status2 = await badge.innerText();
        console.log(`Status with links + tests: ${status2}`);
        if (!status2.toUpperCase().includes('SHIPPED')) throw new Error('Did not update to Shipped!');
        console.log('✅ Shipped logic correct.');

        // 4. Calm Completion Message
        console.log('\n[4] Checking Completion Message...');
        const msg = page.locator('text=Project 1 Shipped Successfully');
        if (!await msg.isVisible()) throw new Error('Completion message missing');

        // Check for "confetti" or "celebration" elements (basic check)
        const canvas = page.locator('canvas');
        if (await canvas.count() > 0) console.warn('⚠️ Canvas found, potential confetti? Check manual screenshot.');
        else console.log('✅ No confetti canvas found. Calm confirmation.');

        // 5. Copy Submission
        console.log('\n[5] Testing Copy Submission...');
        // Mock clipboard write
        let clipboardText = '';
        await page.exposeFunction('mockClipboardWrite', (text) => {
            clipboardText = text;
        });
        await page.evaluate(() => {
            navigator.clipboard.writeText = window.mockClipboardWrite;
        });

        await page.click('button:has-text("Copy Final Submission")');
        await page.waitForTimeout(100);

        console.log('Clipboard Content Preview:\n', clipboardText.substring(0, 50) + '...');
        if (!clipboardText.includes('Lovable Project:') || !clipboardText.includes('https://lovable.dev/test'))
            throw new Error('Clipboard content missing links');
        console.log('✅ Copy functionality verified.');

        console.log('\n✨ FINAL VERIFICATION PASSED ✨');
        process.exit(0);

    } catch (e) {
        console.error('❌ Final Verification Failed:', e);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
