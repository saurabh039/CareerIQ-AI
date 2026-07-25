import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../services/job.service";
import { toast } from "sonner";

export default function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const res = await getJobById(id);
      setJob(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load job");
    }
  };

  if (!job) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>{job.title}</h1>

      <p><strong>Company:</strong> {job.company}</p>

      <p><strong>Location:</strong> {job.location}</p>

      <p><strong>Employment:</strong> {job.employmentType}</p>

      <p><strong>Experience:</strong> {job.experienceLevel}</p>

      <p>
        <strong>Salary:</strong>{" "}
        {job.salary?.min} - {job.salary?.max} {job.salary?.currency}
      </p>

      <p><strong>Skills:</strong> {job.skills?.join(", ")}</p>

      <p><strong>Description:</strong></p>

      <p>{job.description}</p>
    </div>
  );
}