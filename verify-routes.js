import { chromium } from 'playwright';

(async () => {
    console.log('Starting verification...');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        // 1. Visit Dashboard
        console.log('Navigating to Dashboard (127.0.0.1)...');
        await page.goto('http://127.0.0.1:5173/dashboard');

        // 2. Verify Content
        const title = await page.locator('h1').textContent();
        if (title.includes('Dashboard')) {
            console.log('✅ Dashboard Route: Loaded Successfully');
        } else {
            console.error('❌ Dashboard Route: Title mismatch');
        }

        // 3. Verify Active Link Style
        const dashboardLink = page.locator('a[href="/dashboard"]');
        const borderColor = await dashboardLink.evaluate((el) => {
            return window.getComputedStyle(el).borderBottomColor;
        });

        // Computed style for #8B0000 might be returned as rgb(139, 0, 0)
        if (borderColor === 'rgb(139, 0, 0)') {
            console.log('✅ Navigation Style: Active link has correct deep red underline (#8B0000)');
        } else {
            console.error(`❌ Navigation Style: Incorrect color. Got ${borderColor}`);
        }

        // 4. Capture Screenshot
        await page.screenshot({ path: 'verification-dashboard.png' });
        console.log('📸 Screenshot saved: verification-dashboard.png');

    } catch (error) {
        console.error('❌ Verification Failed:', error);
    } finally {
        await browser.close();
    }
})();
