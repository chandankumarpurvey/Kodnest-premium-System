import { chromium } from 'playwright';

(async () => {
    console.log('Starting Edge Case Verification...');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    let allPassed = true;

    try {
        // --- Test 1: 404 Handling ---
        console.log('\n🧪 Test 1: 404 Handling (/random-page-123)');
        await page.goto('http://127.0.0.1:5173/random-page-123');

        // Wait for React to render
        await page.waitForSelector('.not-found-container', { timeout: 5000 });

        // Check for specific 404 content
        const bodyText = await page.locator('body').textContent();
        if (bodyText.includes('Page Not Found') && bodyText.includes('404')) {
            console.log('✅ 404 Page Rendered Correctly');
        } else {
            console.error('❌ 404 Page Failed. Found:', bodyText.substring(0, 100) + '...');
            allPassed = false;
        }

        // --- Test 2: Active Link Stability ---
        console.log('\n🧪 Test 2: Active Link Click Stability');
        // Go to dashboard
        await page.goto('http://127.0.0.1:5173/dashboard');

        // Inject a flag into window to detect reload
        await page.evaluate(() => window._wasLoaded = true);

        // Click Dashboard link again
        const dashboardLink = page.locator('a[href="/dashboard"]');
        await dashboardLink.click();

        // Wait a moment for potential reload
        await page.waitForTimeout(1000);

        // Check if flag still exists
        const isSamePage = await page.evaluate(() => window._wasLoaded === true);

        if (isSamePage) {
            console.log('✅ No Reload Detected on Active Link Click');
        } else {
            console.error('❌ Page Reloaded! Stability Check Failed.');
            allPassed = false;
        }

        await page.screenshot({ path: 'evidence-4-404.png' });
        console.log('📸 Saved evidence-4-404.png');

    } catch (error) {
        console.error('❌ Edge Case Test Error:', error);
        console.log('--- PAGE HTML DUMP ---');
        console.log(await page.innerHTML('body'));
        console.log('----------------------');
        await page.screenshot({ path: 'debug-404-error.png' });
        console.log('📸 Saved debug-404-error.png');
        allPassed = false;
    } finally {
        await browser.close();
        if (allPassed) {
            console.log('\n✨ ALL EDGE CASES VERIFIED ✨');
            process.exit(0);
        } else {
            console.log('\n⚠️ EDGE CASE FAILURES DETECTED');
            process.exit(1);
        }
    }
})();
