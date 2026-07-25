import { useEffect, useState } from "react";
import { getJobs } from "../services/job.service";
import { toast } from "sonner";

import SearchBar from "../components/jobs/SearchBar";
import JobCard from "../components/jobs/JobCard";
import Pagination from "../components/jobs/Pagination";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState(null);

  const [filters, setFilters] = useState({
    keyword: "",
    company: "",
    location: "",
    employmentType: "",
    page: 1,
    limit: 5,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (params = filters) => {
    try {
      setLoading(true);

      const res = await getJobs(params);

      setJobs(res.data.data.jobs);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchJobs(filters);
  };

  const handlePageChange = (page) => {
    const updatedFilters = {
      ...filters,
      page,
    };

    setFilters(updatedFilters);

    fetchJobs(updatedFilters);
  };

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Loading Jobs...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Available Jobs</h1>

      <SearchBar
        filters={filters}
        setFilters={setFilters}
        onSearch={handleSearch}
      />

      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        jobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
          />
        ))
      )}

      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}