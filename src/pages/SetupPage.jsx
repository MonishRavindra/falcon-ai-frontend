// pages/SetupPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeUpload from "../components/ResumeUpload";
import JobDescriptionInput from "../components/JobDescriptionInput";

const BACKEND = "https://falcon-ai-backend-wibl.onrender.com";

export default function SetupPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const navigate = useNavigate();

  const goToInterview = () => {
    if (!resumeText && !jobDescription) {
      if (!confirm("No resume or job description. Continue anyway?")) return;
    }
    navigate("/interview");
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h1 style={{ textAlign: "center" }}>Setup Your Session</h1>
      <ResumeUpload setResumeText={setResumeText} />
      <JobDescriptionInput jobDescription={jobDescription} setJobDescription={setJobDescription} />
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button onClick={goToInterview} style={{ padding: "12px 32px", fontSize: "1.1em" }}>
          Start Interview
        </button>
      </div>
    </div>
  );
}