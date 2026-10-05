/**
 * ---------------------------------------------------------
 * CareerIQ AI
 * Duplicate Detection Service
 * ---------------------------------------------------------
 */

class DuplicateDetectionService {

    removeDuplicates(jobs = []) {

        const seen = new Set();

        return jobs.filter(job => {

            const key = `${job.source}-${job.sourceUrl}`;

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);

            return true;

        });

    }

}

export default new DuplicateDetectionService();