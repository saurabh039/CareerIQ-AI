import cron from "node-cron";

import JobIngestionService from "../services/JobIngestionService.js";

class CronScheduler {

    start() {

        console.log("Job Scheduler Started");

        // Every 6 hours
        cron.schedule("0 */6 * * *", async () => {

            console.log("\nStarting Job Sync...\n");

            try {

                const ingestion = new JobIngestionService();

                const jobs = await ingestion.syncAllJobs();
                
                console.log(`Job Sync Completed. Processed ${jobs.length} jobs.`);

            } catch (err) {

                console.error(err);

            }

        });

    }

}

export default new CronScheduler();