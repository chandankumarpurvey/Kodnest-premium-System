import { chromium } from 'playwright';

(async () => {
    console.log('Starting Visual Verification...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const url = 'http://127.0.0.1:5173/dashboard';

    try {
        // 1. Desktop Verification
        console.log('📸 Capturing Desktop View...');
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.screenshot({ path: 'evidence-1-desktop.png', fullPage: true });
        console.log('✅ Desktop screenshot saved: evidence-1-desktop.png');

        // 2. Mobile Verification (Collapsed Menu)
        console.log('📸 Capturing Mobile View (Collapsed)...');
        await page.setViewportSize({ width: 375, height: 812 }); // iPhone X dimensions
        await page.reload(); // Reload to ensure media queries trigger cleanly
        await page.screenshot({ path: 'evidence-2-mobile-collapsed.png' });
        console.log('✅ Mobile (Collapsed) screenshot saved: evidence-2-mobile-collapsed.png');

        // 3. Mobile Verification (Open Menu)
        console.log('📸 Capturing Mobile View (Menu Open)...');
        // Click the hamburger menu button. 
        // We look for the button inside .visible-mobile
        const menuButton = page.locator('.visible-mobile button');
        await menuButton.click();

        // Wait for animation/render
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'evidence-3-mobile-open.png' });
        console.log('✅ Mobile (Open) screenshot saved: evidence-3-mobile-open.png');

    } catch (error) {
        console.error('❌ Visual Verification Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
        process.exit(0);
    }
})();
