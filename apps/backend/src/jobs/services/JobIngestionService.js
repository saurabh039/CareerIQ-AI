import LinkedInAdapter from "../adapters/linkedin/LinkedInAdapter.js";
import RemoteOKAdapter from "../adapters/remoteok/RemoteOKAdapter.js";
import WellfoundAdapter from "../adapters/wellfound/WellfoundAdapter.js";

class JobIngestionService {
    constructor() {
        this.adapters = [
            new RemoteOKAdapter(),
        ];
    }

    async syncAllJobs() {
        const allJobs = [];

        for (const adapter of this.adapters) {

            console.log(`\n========== ${adapter.name} ==========`);

            const rawData = await adapter.fetchJobs();

            console.log(
                `[${adapter.name}] HTML downloaded (${rawData.length} characters)`
            );

            const parsedJobs = await adapter.parseJobs(rawData);

            // Temporary debugging
            console.log("\nParsed Jobs:");
            console.log(parsedJobs);

            // Skip normalization for now
            allJobs.push(...parsedJobs);

            console.log(
                `[${adapter.name}] Parsed ${parsedJobs.length} jobs`
            );
        }

        console.log(`\nTotal Jobs Parsed: ${allJobs.length}`);

        return allJobs;
    }
}

export default JobIngestionService;