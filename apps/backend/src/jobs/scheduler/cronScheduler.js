import cron from "node-cron";

import JobIngestionService from "../services/JobIngestionService.js";
import JobValidator from "../validators/jobValidator.js";
import JobNormalizer from "../normalizers/jobNormalizer.js";
import DuplicateDetectionService from "../services/DuplicateDetectionService.js";
import StorageService from "../services/JobStorageService.js";

class CronScheduler {

    start() {

        console.log("Job Scheduler Started");

        // Every 6 hours
        cron.schedule("0 */6 * * *", async () => {

            console.log("\nStarting Job Sync...\n");

            try {

                const ingestion = new JobIngestionService();

                let jobs = await ingestion.syncAllJobs();

                jobs = JobValidator.validateAll(jobs);

                jobs = DuplicateDetectionService.removeDuplicates(jobs);

                const result = await StorageService.saveJobs(jobs);

                console.log(result);

            } catch (err) {

                console.error(err);

            }

        });

    }

}

export default new CronScheduler();