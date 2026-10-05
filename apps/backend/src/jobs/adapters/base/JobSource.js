/**
 * ---------------------------------------------------------
 * CareerIQ AI
 * Base Job Source Adapter
 * ---------------------------------------------------------
 * Every job source (LinkedIn, RemoteOK, Wellfound, etc.)
 * must extend this class.
 * ---------------------------------------------------------
 */

class JobSource {
  constructor(name) {
    this.name = name;
  }

  /**
   * Fetch raw job data from the source.
   * Example:
   * - HTML
   * - JSON
   * - API Response
   */
  async fetchJobs() {
    throw new Error("fetchJobs() must be implemented.");
  }

  /**
   * Parse raw source data into intermediate job objects.
   */
  async parseJobs(rawData) {
    throw new Error("parseJobs() must be implemented.");
  }

  /**
   * Convert parsed jobs into the CareerIQ Job schema.
   */
  async normalizeJobs(parsedJobs) {
    throw new Error("normalizeJobs() must be implemented.");
  }
}

export default JobSource;