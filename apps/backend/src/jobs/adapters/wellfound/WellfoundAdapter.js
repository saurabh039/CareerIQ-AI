import JobSource from "../base/JobSource.js";

class WellfoundAdapter extends JobSource {
    constructor() {
        super("Wellfound");
    }

    async fetchJobs() {
        console.log("[Wellfound] Fetching jobs...");
        return [];
    }

    async parseJobs(rawData) {
        console.log("[Wellfound] Parsing jobs...");
        return [];
    }

    async normalizeJobs(parsedJobs) {
        console.log("[Wellfound] Normalizing jobs...");
        return [];
    }
}

export default WellfoundAdapter;