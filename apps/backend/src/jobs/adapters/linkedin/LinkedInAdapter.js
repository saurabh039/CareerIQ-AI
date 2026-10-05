import JobSource from "../base/JobSource.js";

import scraper from "../../scraper/playwrightScraper.js";
import parser from "../../scraper/htmlParser.js";

class LinkedInAdapter extends JobSource {

    constructor() {

        super("LinkedIn");

    }

    async fetchJobs() {

        const url =
            "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer";

        console.log(
            `[LinkedIn] Fetching jobs...`
        );

        const html =
            await scraper.scrape(url);

        const $ = parser.load(html);

        const jobs = [];

        // Parsing logic comes next

        return jobs;

    }

}

export default LinkedInAdapter;