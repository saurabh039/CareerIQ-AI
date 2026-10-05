import { useEffect, useState } from "react";
import {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
} from "../../services/resume.service";

function Resume() {
  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);

  const [selectedResume, setSelectedResume] = useState(null);
  const [loadingResumeId, setLoadingResumeId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // LOAD ALL RESUMES
  // =========================
  const loadResumes = async () => {
    try {
      setError("");

      const response = await getResumes();

      setResumes(response.data.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load resumes"
      );
    }
  };

  // =========================
  // LOAD PARSED RESUME
  // =========================
  const handleViewResume = async (id) => {
    try {
      setError("");
      setMessage("");

      // Show loading on clicked resume
      setLoadingResumeId(id);

      const response = await getResumeById(id);

      const resumeData = response.data.data;

      setSelectedResume(resumeData);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load parsed resume"
      );
    } finally {
      setLoadingResumeId(null);
    }
  };

  // =========================
  // CLOSE PARSED RESUME
  // =========================
  const handleCloseParsedResume = () => {
    setSelectedResume(null);
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    loadResumes();
  }, []);

  // =========================
  // UPLOAD RESUME
  // =========================
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF or DOCX resume");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await uploadResume(file);

      setMessage("Resume uploaded successfully");
      setFile(null);

      // Reload resume list
      await loadResumes();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Resume upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE RESUME
  // =========================
  const handleDelete = async (id) => {
    try {
      setError("");
      setMessage("");

      await deleteResume(id);

      setMessage("Resume deleted successfully");

      // If deleted resume was open
      if (selectedResume?._id === id) {
        setSelectedResume(null);
      }

      await loadResumes();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to delete resume"
      );
    }
  };

  return (
    <>
      {/* =========================================
          MAIN RESUME PAGE
      ========================================= */}
      <div
        style={{
          padding: "40px",
          maxWidth: "900px",
          margin: "auto",
        }}
      >
        {/* PAGE HEADER */}
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          Resume Intelligence
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#444",
          }}
        >
          Upload your resume to let CareerIQ AI analyze your
          experience, skills, education and projects.
        </p>

        {/* =========================================
            UPLOAD SECTION
        ========================================= */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "30px",
            borderRadius: "12px",
            marginTop: "30px",
            textAlign: "center",
          }}
        >
          <h2>Upload Resume</h2>

          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setMessage("");
              setError("");
            }}
            style={{
              marginTop: "15px",
            }}
          />

          {file && (
            <p
              style={{
                marginTop: "15px",
              }}
            >
              Selected file:{" "}
              <strong>{file.name}</strong>
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              cursor: loading
                ? "not-allowed"
                : "pointer",
              borderRadius: "6px",
              border: "none",
              background: loading
                ? "#aaa"
                : "#111",
              color: "white",
              fontSize: "15px",
            }}
          >
            {loading
              ? "Uploading..."
              : "Upload Resume"}
          </button>
        </div>

        {/* =========================================
            SUCCESS MESSAGE
        ========================================= */}
        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#e8f7e8",
              color: "#168316",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        {/* =========================================
            ERROR MESSAGE
        ========================================= */}
        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#ffecec",
              color: "#c62828",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* =========================================
            RESUME LIST
        ========================================= */}
        <div
          style={{
            marginTop: "40px",
          }}
        >
          <h2>My Resumes</h2>

          {resumes.length === 0 ? (
            <p>No resumes uploaded yet.</p>
          ) : (
            resumes.map((resume) => (
              <div
                key={resume._id}
                style={{
                  border: "1px solid #ddd",
                  padding: "22px",
                  borderRadius: "12px",
                  marginTop: "15px",
                  background: "#fff",
                }}
              >
                {/* FILE NAME */}
                <h3
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  {resume.originalFileName}
                </h3>

                {/* STATUS */}
                <p>
                  Status:{" "}
                  <strong>
                    {resume.status}
                  </strong>
                </p>

                {/* TYPE */}
                <p>
                  Type:{" "}
                  {resume.fileType?.toUpperCase()}
                </p>

                {/* DATE */}
                <p>
                  Uploaded:{" "}
                  {new Date(
                    resume.createdAt
                  ).toLocaleString()}
                </p>

                {/* ACTIONS */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "15px",
                  }}
                >
                  {/* VIEW BUTTON */}
                  <button
                    onClick={() =>
                      handleViewResume(resume._id)
                    }
                    disabled={
                      loadingResumeId ===
                      resume._id
                    }
                    style={{
                      padding: "9px 16px",
                      borderRadius: "6px",
                      border: "none",
                      background:
                        loadingResumeId ===
                        resume._id
                          ? "#999"
                          : "#111",
                      color: "white",
                      cursor:
                        loadingResumeId ===
                        resume._id
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {loadingResumeId ===
                    resume._id
                      ? "Loading..."
                      : "View Parsed Resume"}
                  </button>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() =>
                      handleDelete(resume._id)
                    }
                    style={{
                      padding: "9px 16px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      background: "white",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* =========================================
          PARSED RESUME MODAL
      ========================================= */}
      {selectedResume && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              width: "90%",
              maxWidth: "1000px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "14px",
              padding: "30px",
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.25)",
            }}
          >
            {/* MODAL HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
                paddingBottom: "15px",
                marginBottom: "25px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  Parsed Resume
                </h2>

                <p
                  style={{
                    marginTop: "8px",
                    color: "#555",
                  }}
                >
                  File:{" "}
                  <strong>
                    {
                      selectedResume.originalFileName
                    }
                  </strong>
                </p>

                <p>
                  Status:{" "}
                  <strong>
                    {selectedResume.status}
                  </strong>
                </p>
              </div>

              {/* CLOSE BUTTON */}
              <button
                onClick={handleCloseParsedResume}
                style={{
                  border: "none",
                  background: "#eee",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            {/* =====================================
                NOT PARSED YET
            ===================================== */}
            {!selectedResume.parsedData && (
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                  background: "#fff8e1",
                  borderRadius: "10px",
                }}
              >
                <h3>
                  Resume is not parsed yet
                </h3>

                <p>
                  CareerIQ AI has received the
                  resume, but the parsed data is
                  not available yet.
                </p>

                <p>
                  Current status:{" "}
                  <strong>
                    {selectedResume.status}
                  </strong>
                </p>
              </div>
            )}

            {/* =====================================
                PARSED DATA
            ===================================== */}
            {selectedResume.parsedData && (
              <div>
                {/* BASIC INFORMATION */}
                <section
                  style={{
                    marginBottom: "30px",
                  }}
                >
                  <h3>Basic Information</h3>

                  <div
                    style={{
                      background: "#f7f7f7",
                      padding: "20px",
                      borderRadius: "10px",
                    }}
                  >
                    <p>
                      <strong>Name:</strong>{" "}
                      {selectedResume.parsedData
                        .basics?.name || "N/A"}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedResume.parsedData
                        .basics?.email || "N/A"}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {selectedResume.parsedData
                        .basics?.phone || "N/A"}
                    </p>

                    <p>
                      <strong>Location:</strong>{" "}
                      {selectedResume.parsedData
                        .basics?.location || "N/A"}
                    </p>

                    <p>
                      <strong>LinkedIn:</strong>{" "}
                      {selectedResume.parsedData
                        .basics?.linkedin || "N/A"}
                    </p>

                    <p>
                      <strong>GitHub:</strong>{" "}
                      {selectedResume.parsedData
                        .basics?.github || "N/A"}
                    </p>
                  </div>
                </section>

                {/* SUMMARY */}
                <section
                  style={{
                    marginBottom: "30px",
                  }}
                >
                  <h3>Summary</h3>

                  <div
                    style={{
                      background: "#f7f7f7",
                      padding: "20px",
                      borderRadius: "10px",
                    }}
                  >
                    <p>
                      {selectedResume.parsedData
                        .summary || "N/A"}
                    </p>
                  </div>
                </section>

                {/* SKILLS */}
                <section
                  style={{
                    marginBottom: "30px",
                  }}
                >
                  <h3>Skills</h3>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    {Array.isArray(
                      selectedResume.parsedData
                        .skills
                    ) &&
                    selectedResume.parsedData
                      .skills.length > 0 ? (
                      selectedResume.parsedData.skills.map(
                        (skill, index) => (
                          <span
                            key={index}
                            style={{
                              padding:
                                "8px 14px",
                              background:
                                "#f0f0f0",
                              borderRadius:
                                "20px",
                              fontSize:
                                "14px",
                            }}
                          >
                            {typeof skill ===
                            "string"
                              ? skill
                              : JSON.stringify(
                                  skill
                                )}
                          </span>
                        )
                      )
                    ) : (
                      <p>N/A</p>
                    )}
                  </div>
                </section>

                {/* EDUCATION */}
                <section
                  style={{
                    marginBottom: "30px",
                  }}
                >
                  <h3>Education</h3>

                  {Array.isArray(
                    selectedResume.parsedData
                      .education
                  ) &&
                  selectedResume.parsedData
                    .education.length > 0 ? (
                    selectedResume.parsedData.education.map(
                      (education, index) => (
                        <div
                          key={index}
                          style={{
                            background:
                              "#f7f7f7",
                            padding: "18px",
                            borderRadius:
                              "10px",
                            marginTop:
                              "12px",
                          }}
                        >
                          <h4>
                            {education.degree ||
                              "Degree"}
                          </h4>

                          <p>
                            <strong>
                              Institution:
                            </strong>{" "}
                            {education.institution ||
                              "N/A"}
                          </p>

                          <p>
                            <strong>
                              Year:
                            </strong>{" "}
                            {education.year ||
                              "N/A"}
                          </p>

                          {education.score && (
                            <p>
                              <strong>
                                Score:
                              </strong>{" "}
                              {education.score}
                            </p>
                          )}
                        </div>
                      )
                    )
                  ) : (
                    <p>N/A</p>
                  )}
                </section>

                {/* EXPERIENCE */}
                <section
                  style={{
                    marginBottom: "30px",
                  }}
                >
                  <h3>Experience</h3>

                  {Array.isArray(
                    selectedResume.parsedData
                      .experience
                  ) &&
                  selectedResume.parsedData
                    .experience.length > 0 ? (
                    selectedResume.parsedData.experience.map(
                      (experience, index) => (
                        <div
                          key={index}
                          style={{
                            background:
                              "#f7f7f7",
                            padding: "18px",
                            borderRadius:
                              "10px",
                            marginTop:
                              "12px",
                          }}
                        >
                          <h4>
                            {experience.jobTitle ||
                              "Position"}
                          </h4>

                          <p>
                            <strong>
                              Company:
                            </strong>{" "}
                            {experience.company ||
                              "N/A"}
                          </p>

                          <p>
                            <strong>
                              Duration:
                            </strong>{" "}
                            {experience.duration ||
                              "N/A"}
                          </p>

                          {Array.isArray(
                            experience.description
                          ) ? (
                            <ul>
                              {experience.description.map(
                                (
                                  item,
                                  itemIndex
                                ) => (
                                  <li
                                    key={
                                      itemIndex
                                    }
                                  >
                                    {item}
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p>
                              {
                                experience.description
                              }
                            </p>
                          )}
                        </div>
                      )
                    )
                  ) : (
                    <p>N/A</p>
                  )}
                </section>

                {/* PROJECTS */}
                <section
                  style={{
                    marginBottom: "30px",
                  }}
                >
                  <h3>Projects</h3>

                  {Array.isArray(
                    selectedResume.parsedData
                      .projects
                  ) &&
                  selectedResume.parsedData
                    .projects.length > 0 ? (
                    selectedResume.parsedData.projects.map(
                      (project, index) => (
                        <div
                          key={index}
                          style={{
                            background:
                              "#f7f7f7",
                            padding: "18px",
                            borderRadius:
                              "10px",
                            marginTop:
                              "12px",
                          }}
                        >
                          <h4>
                            {project.title ||
                              "Project"}
                          </h4>

                          {project.technologies &&
                            project.technologies
                              .length >
                              0 && (
                              <p>
                                <strong>
                                  Technologies:
                                </strong>{" "}
                                {Array.isArray(
                                  project.technologies
                                )
                                  ? project.technologies.join(
                                      ", "
                                    )
                                  : project.technologies}
                              </p>
                            )}

                          {Array.isArray(
                            project.description
                          ) ? (
                            <ul>
                              {project.description.map(
                                (
                                  item,
                                  itemIndex
                                ) => (
                                  <li
                                    key={
                                      itemIndex
                                    }
                                  >
                                    {item}
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p>
                              {
                                project.description
                              }
                            </p>
                          )}
                        </div>
                      )
                    )
                  ) : (
                    <p>N/A</p>
                  )}
                </section>

                {/* CERTIFICATIONS */}
                <section
                  style={{
                    marginBottom: "30px",
                  }}
                >
                  <h3>Certifications</h3>

                  {selectedResume.parsedData
                    .certifications?.length >
                  0 ? (
                    <ul>
                      {selectedResume.parsedData.certifications.map(
                        (
                          certification,
                          index
                        ) => (
                          <li key={index}>
                            {typeof certification ===
                            "string"
                              ? certification
                              : JSON.stringify(
                                  certification
                                )}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>N/A</p>
                  )}
                </section>

                {/* LANGUAGES */}
                <section>
                  <h3>Languages</h3>

                  {selectedResume.parsedData
                    .languages?.length >
                  0 ? (
                    <ul>
                      {selectedResume.parsedData.languages.map(
                        (language, index) => (
                          <li key={index}>
                            {typeof language ===
                            "string"
                              ? language
                              : JSON.stringify(
                                  language
                                )}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>N/A</p>
                  )}
                </section>
              </div>
            )}

            {/* =====================================
                CLOSE BUTTON
            ===================================== */}
            <div
              style={{
                marginTop: "30px",
                paddingTop: "20px",
                borderTop: "1px solid #ddd",
                textAlign: "right",
              }}
            >
              <button
                onClick={handleCloseParsedResume}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#111",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Close Parsed Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Resume;