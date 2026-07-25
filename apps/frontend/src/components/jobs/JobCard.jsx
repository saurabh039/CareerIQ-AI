import { useNavigate } from "react-router-dom";

export default function JobCard({ job }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "15px",
      }}
    >
      <h3>{job.title}</h3>

      <p>
        <strong>Company:</strong> {job.company}
      </p>

      <p>
        <strong>Location:</strong> {job.location}
      </p>

      <p>
        <strong>Employment:</strong> {job.employmentType}
      </p>

      <button
        onClick={() => navigate(`/jobs/${job._id}`)}
      >
        View Details
      </button>
    </div>
  );
}