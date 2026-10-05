import JobSource from "../base/JobSource.js";
import axios from "axios";

class RemoteOKAdapter extends JobSource {
    constructor() {
        super("RemoteOK");
    }

    async fetchJobs() {
        console.log("[RemoteOK] Fetching jobs...");
        try {
            const response = await axios.get("https://remoteok.com/api");
            return response.data || [];
        } catch (error) {
            console.error("[RemoteOK] Fetch failed:", error.message);
            return [];
        }
    }

    async parseJobs(rawData) {
        console.log(`[RemoteOK] Parsing ${rawData.length} records...`);
        // Filter out the legal notice (usually has no id or the first item)
        // RemoteOK jobs have an 'id' and 'company'.
        const jobs = rawData.filter(item => item.id && item.company);
        return jobs;
    }

    async normalizeJobs(parsedJobs) {
        console.log(`[RemoteOK] Normalizing ${parsedJobs.length} jobs...`);
        return parsedJobs.map(job => {
            return {
                title: job.position,
                company: job.company,
                location: job.location || "Remote",
                description: job.description,
                skills: job.tags || [],
                employmentType: "Remote",
                salary: {
                    min: job.salary_min || null,
                    max: job.salary_max || null,
                    currency: "USD"
                },
                sourceUrl: job.url,
                postedDate: job.date ? new Date(job.date) : new Date(),
            };
        });
    }
}

export default RemoteOKAdapter;