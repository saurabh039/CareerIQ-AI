import { chromium } from "playwright";

class BrowserManager {
    constructor() {
        this.browser = null;
    }

    async getBrowser() {
        if (!this.browser) {
            console.log("[Browser] Launching Chromium...");

            this.browser = await chromium.launch({
                headless: true,
            });
        }

        return this.browser;
    }

    async closeBrowser() {
        if (this.browser) {
            console.log("[Browser] Closing Chromium...");

            await this.browser.close();

            this.browser = null;
        }
    }
}

export default new BrowserManager();