import JobSource from "../base/JobSource.js";

class RemoteOKAdapter extends JobSource {
    constructor() {
        super("RemoteOK");
    }

    async fetchJobs() {
        console.log("[RemoteOK] Fetching jobs...");
        return [];
    }

    async parseJobs(rawData) {
        console.log("[RemoteOK] Parsing jobs...");
        return [];
    }

    async normalizeJobs(parsedJobs) {
        console.log("[RemoteOK] Normalizing jobs...");
        return [];
    }
}

export default RemoteOKAdapter;