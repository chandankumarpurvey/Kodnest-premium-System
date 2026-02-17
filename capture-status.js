import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const baseUrl = 'http://127.0.0.1:5173';

    // Set Prefs & Digest
    await page.goto(`${baseUrl}/settings`);
    await page.evaluate(() => {
        localStorage.clear();
        localStorage.setItem('jobTrackerPreferences', JSON.stringify({
            roleKeywords: 'Developer',
            preferredLocations: ['Bangalore'],
            minMatchScore: 40
        }));
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`jobTrackerDigest_${today}`, JSON.stringify([]));
    });

    // 1. Dashboard Status
    await page.goto(`${baseUrl}/dashboard`);
    await page.waitForTimeout(1000);

    // Set some statuses
    const cards = page.locator('.job-grid > div');
    // Card 1 -> Applied
    await cards.nth(0).locator('select').selectOption('Applied');
    // Card 2 -> Rejected
    await cards.nth(1).locator('select').selectOption('Rejected');
    // Card 3 -> Selected
    await cards.nth(2).locator('select').selectOption('Selected');

    await page.waitForTimeout(500);

    // Screenshot 1: Dashboard with Statuses
    await page.screenshot({ path: 'evidence-status-dashboard.png', fullPage: true });
    console.log('Captured evidence-status-dashboard.png');

    // Screenshot 2: Filter Active
    // Filter by Applied
    await page.locator('.filter-bar-container select').first().selectOption('Applied'); // status filter is first
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'evidence-status-filter.png', fullPage: true });
    console.log('Captured evidence-status-filter.png');

    // 3. Digest Updates
    await page.goto(`${baseUrl}/digest`);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'evidence-status-digest.png', fullPage: true });
    console.log('Captured evidence-status-digest.png');

    await browser.close();
})();
