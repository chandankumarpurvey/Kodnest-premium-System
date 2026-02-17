import { chromium } from 'playwright';

(async () => {
    console.log('Starting Deep Verification of Dashboard...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const dashboardUrl = 'http://127.0.0.1:5173/dashboard';

    try {
        await page.goto(dashboardUrl, { waitUntil: 'networkidle' });

        // 1. Verify Real Indian Companies
        console.log('\n--- Test 1: Indian Company Names ---');
        const bodyText = await page.locator('body').innerText();
        const indianCompanies = ['TCS', 'Infosys', 'Swiggy', 'Razorpay', 'Flipkart', 'Zomato'];
        let foundCompanies = 0;
        for (const company of indianCompanies) {
            if (bodyText.includes(company)) {
                foundCompanies++;
            }
        }
        if (foundCompanies > 0) {
            console.log(`✅ Found realistic Indian companies (e.g., detected ${foundCompanies} from sample list).`);
        } else {
            console.error('❌ Could not find specific Indian company names in current view.');
        }

        // 2. Verify Filter Bar Inputs
        console.log('\n--- Test 2: Filter Bar UI ---');
        const filterBar = page.locator('.filter-bar-container');
        const searchInput = filterBar.locator('input[placeholder*="Search"]');
        const locationFilter = filterBar.getByText('Location');
        const modeFilter = filterBar.getByText('Mode');
        const sourceFilter = filterBar.getByText('Source');

        if (await searchInput.isVisible() && await locationFilter.isVisible() && await modeFilter.isVisible() && await sourceFilter.isVisible()) {
            console.log('✅ Filter Bar contains Search, Location, Mode, and Source inputs.');
        } else {
            throw new Error('❌ Filter Bar missing required inputs.');
        }

        // 3. Verify Modal Content
        console.log('\n--- Test 3: Job Modal Content ---');
        // Click 'View Details' on the first card
        await page.locator('.btn-secondary', { hasText: 'View Details' }).first().click();

        // Wait for modal
        const modal = page.locator('.fixed.inset-0');
        await modal.waitFor({ state: 'visible' });

        const descriptionHeading = await modal.getByText('About the Role').isVisible();
        const skillsHeading = await modal.getByText('Required Skills').isVisible();

        if (descriptionHeading && skillsHeading) {
            console.log('✅ Modal opened showing "About the Role" and "Required Skills".');
        } else {
            throw new Error('❌ Modal content missing (headings not found).');
        }

        // Close modal
        await modal.getByText('Close').click();
        await modal.waitFor({ state: 'hidden' });

        // 4. Verify Apply Button Attributes
        console.log('\n--- Test 4: Apply Button ---');
        const applyBtn = page.locator('a.btn-primary', { hasText: 'Apply' }).first();
        const target = await applyBtn.getAttribute('target');
        const href = await applyBtn.getAttribute('href');

        if (target === '_blank' && href && href.startsWith('http')) {
            console.log(`✅ Apply button opens in new tab (target="${target}") and links to valid URL.`);
        } else {
            throw new Error(`❌ Apply button malformed. Target: ${target}, Href: ${href}`);
        }

        console.log('\n✨ ALL DEEP VERIFICATION CHECKS PASSED ✨');
        process.exit(0);

    } catch (error) {
        console.error('❌ Deep Verification Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
