/**
 * ---------------------------------------------------------
 * CareerIQ AI
 * Job Validator
 * ---------------------------------------------------------
 * Ensures every scraped job contains the minimum
 * required information before entering the pipeline.
 * ---------------------------------------------------------
 */

class JobValidator {

    /**
     * Validate a single job.
     */
    validate(job) {

        if (!job)
            return false;

        if (!job.title?.trim())
            return false;

        if (!job.company?.trim())
            return false;

        if (!job.sourceUrl?.trim())
            return false;

        return true;
    }

    /**
     * Filter valid jobs.
     */
    validateAll(jobs = []) {

        return jobs.filter(job => this.validate(job));

    }

}

export default new JobValidator();