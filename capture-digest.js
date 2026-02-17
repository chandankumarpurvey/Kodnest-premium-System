import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    // Set prefs so we can generate
    await page.goto(`${baseUrl}/settings`);
    await page.evaluate(() => {
        localStorage.setItem('jobTrackerPreferences', JSON.stringify({
            roleKeywords: 'Developer, Engineer',
            preferredLocations: ['Bangalore'],
            preferredMode: ['Remote', 'Hybrid'],
            experienceLevel: '1-3y',
            skills: 'React, Node',
            minMatchScore: 40
        }));
    });

    // Go to digest and generate
    await page.goto(`${baseUrl}/digest`);
    if (await page.locator('button', { hasText: 'Generate' }).isVisible()) {
        await page.locator('button', { hasText: 'Generate' }).click();
        await page.waitForTimeout(1000);
    }

    // Capture
    await page.screenshot({ path: 'evidence-digest.png', fullPage: true });
    console.log('Screenshot captured: evidence-digest.png');

    await browser.close();
})();
