/**
 * ---------------------------------------------------------
 * CareerIQ AI
 * Job Normalizer
 * ---------------------------------------------------------
 * Converts raw jobs from different sources into the
 * standard CareerIQ Job schema.
 * ---------------------------------------------------------
 */

class JobNormalizer {

    normalize(job, source) {

        return {
            title: job.title || "",
            company: job.company || "",
            location: job.location || "",
            description: job.description || "",
            skills: job.skills || [],
            employmentType: job.employmentType || "",
            salary: job.salary || "",
            experienceLevel: job.experienceLevel || "",
            source: source,
            sourceUrl: job.sourceUrl || "",
            postedDate: job.postedDate || null,
        };

    }

    normalizeAll(jobs = [], source) {

        return jobs.map(job => this.normalize(job, source));

    }

}

export default new JobNormalizer();