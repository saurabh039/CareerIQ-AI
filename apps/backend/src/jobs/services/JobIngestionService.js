import RemoteOKAdapter from "../adapters/remoteok/RemoteOKAdapter.js";
import jobNormalizer from "../normalizers/jobNormalizer.js";
import jobValidator from "../validators/jobValidator.js";
import duplicateDetectionService from "./DuplicateDetectionService.js";
import jobStorageService from "./JobStorageService.js";

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

            try {
                const rawData = await adapter.fetchJobs();
                console.log(`[${adapter.name}] Fetched ${rawData.length} records`);

                const parsedJobs = await adapter.parseJobs(rawData);
                console.log(`[${adapter.name}] Parsed ${parsedJobs.length} jobs`);

                const intermediateJobs = await adapter.normalizeJobs(parsedJobs);
                console.log(`[${adapter.name}] Adapter normalized ${intermediateJobs.length} jobs`);

                const normalizedJobs = jobNormalizer.normalizeAll(intermediateJobs, adapter.name);
                console.log(`[${adapter.name}] System normalized ${normalizedJobs.length} jobs`);

                const validJobs = jobValidator.validateAll(normalizedJobs);
                console.log(`[${adapter.name}] Validated ${validJobs.length} jobs`);

                const uniqueJobs = duplicateDetectionService.removeDuplicates(validJobs);
                console.log(`[${adapter.name}] Found ${uniqueJobs.length} unique jobs (in-memory)`);

                if (uniqueJobs.length > 0) {
                    const storageResult = await jobStorageService.saveJobs(uniqueJobs);
                    console.log(`[${adapter.name}] Storage Result: Inserted ${storageResult.inserted}, Updated ${storageResult.updated}`);
                }

                allJobs.push(...uniqueJobs);
            } catch (error) {
                console.error(`[${adapter.name}] Error during ingestion:`, error.message);
            }
        }

        console.log(`\nTotal Jobs Processed: ${allJobs.length}`);

        return allJobs;
    }
}

export default JobIngestionService;