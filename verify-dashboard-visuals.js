import { chromium } from 'playwright';

(async () => {
    console.log('Starting Visual Verification of Dashboard Interactions...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const dashboardUrl = 'http://127.0.0.1:5173/dashboard';

    try {
        await page.setViewportSize({ width: 1280, height: 800 });

        // 1. Dashboard View
        console.log('📸 Capturing Dashboard...');
        await page.goto(dashboardUrl, { waitUntil: 'networkidle' });
        await page.screenshot({ path: 'evidence-5-dashboard-feed.png' });

        // 2. Modal View
        console.log('📸 Capturing Job Modal...');
        // Click first 'View Details' button
        await page.locator('.btn-secondary', { hasText: 'View Details' }).first().click();
        // Wait for modal to appear
        await page.waitForSelector('.fixed.inset-0');
        await page.waitForTimeout(500); // Allow animation
        await page.screenshot({ path: 'evidence-6-job-modal.png' });

        // Close modal
        await page.locator('button', { hasText: 'Close' }).click();

        // 3. Saved View
        console.log('📸 Capturing Saved Page...');
        // Save the first job (if not already saved)
        const saveBtn = page.locator('button[title="Save"]').first();
        if (await saveBtn.count() > 0) {
            await saveBtn.click();
        }

        // Go to /saved
        await page.goto('http://127.0.0.1:5173/saved', { waitUntil: 'networkidle' });
        await page.screenshot({ path: 'evidence-7-saved-page.png' });

        console.log('✅ Visual verification complete. Screenshots saved.');
        process.exit(0);

    } catch (error) {
        console.error('❌ Visual Verification Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
