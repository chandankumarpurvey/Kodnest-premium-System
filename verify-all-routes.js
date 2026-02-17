import { chromium } from 'playwright';

(async () => {
    console.log('Starting comprehensive verification...');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // List of routes to verify
    const routes = [
        { path: '/dashboard', title: 'Dashboard' },
        { path: '/saved', title: 'Saved Jobs' },
        { path: '/digest', title: 'Daily Digest' },
        { path: '/settings', title: 'Settings' },
        { path: '/proof', title: 'Proof of Work' }
    ];

    let allPassed = true;

    try {
        for (const route of routes) {
            console.log(`\nTesting Route: ${route.path}...`);
            const url = `http://127.0.0.1:5173${route.path}`;

            await page.goto(url, { waitUntil: 'networkidle' });

            // The placeholder page puts the title in an h1 within .placeholder-page
            const h1Text = await page.locator('.placeholder-page h1').textContent();

            if (h1Text.includes(route.title)) {
                console.log(`✅ [${route.path}] Loaded successfully with title: "${h1Text}"`);
            } else {
                console.error(`❌ [${route.path}] Title mismatch. Expected "${route.title}", got "${h1Text}"`);
                allPassed = false;
            }

            // Verify Navigation Active State
            // Find the link that corresponds to this path
            const navLink = page.locator(`a[href="${route.path}"]`);
            // Check if it exists
            if (await navLink.count() > 0) {
                const borderColor = await navLink.evaluate((el) => {
                    return window.getComputedStyle(el).borderBottomColor;
                });
                // Check for red underline (rgb(139, 0, 0) == #8B0000)
                if (borderColor === 'rgb(139, 0, 0)') {
                    console.log(`✅ [${route.path}] Nav link active style confirmed.`);
                } else {
                    // It might be that for the generic /proof page etc it works, but we should verify.
                    console.error(`❌ [${route.path}] Nav link style wrong. Color: ${borderColor}`);
                    allPassed = false;
                }
            } else {
                console.error(`❌ [${route.path}] Nav link not found in DOM.`);
                allPassed = false;
            }
        }

    } catch (error) {
        console.error('❌ Verification Script Error:', error);
        allPassed = false;
    } finally {
        await browser.close();
        if (allPassed) {
            console.log('\n✨ ALL ROUTES VERIFIED SUCCESSFULLY ✨');
            process.exit(0);
        } else {
            console.log('\n⚠️ SOME CHECKS FAILED');
            process.exit(1);
        }
    }
})();
