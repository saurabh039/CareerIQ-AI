import Job from "../../models/Job.js";

class StorageService {

    async saveJobs(jobs = []) {

        let inserted = 0;
        let updated = 0;

        for (const job of jobs) {

            const existing = await Job.findOne({
                source: job.source,
                sourceUrl: job.sourceUrl,
            });

            if (existing) {

                await Job.updateOne(
                    { _id: existing._id },
                    {
                        $set: job,
                    }
                );

                updated++;

            } else {

                await Job.create(job);

                inserted++;

            }

        }

        return {
            inserted,
            updated,
            total: jobs.length,
        };

    }

}

export default new StorageService();