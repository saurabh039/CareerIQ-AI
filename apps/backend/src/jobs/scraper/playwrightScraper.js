import browserManager from "./browser.js";

class PlaywrightScraper {
    /**
     * Scrape the HTML of a page.
     * @param {string} url
     * @returns {string} HTML
     */
    async scrape(url) {
        const browser = await browserManager.getBrowser();

        const page = await browser.newPage();

        try {
            console.log(`[Scraper] Opening ${url}`);

            await page.goto(url, {
                waitUntil: "networkidle",
                timeout: 60000,
            });

            // Give dynamic websites a little extra time
            await page.waitForTimeout(3000);

            const html = await page.content();

            return html;
        } finally {
            await page.close();
        }
    }

    /**
     * Scrape with custom callback.
     * Useful when a website needs scrolling,
     * clicking, login, pagination, etc.
     */
    async scrapePage(url, callback) {
        const browser = await browserManager.getBrowser();

        const page = await browser.newPage();

        try {
            console.log(`[Scraper] Opening ${url}`);

            await page.goto(url, {
                waitUntil: "networkidle",
                timeout: 60000,
            });

            await callback(page);

            return await page.content();
        } finally {
            await page.close();
        }
    }
}

export default new PlaywrightScraper();