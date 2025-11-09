// components/ResumeUpload.jsx
import { useState } from "react";

const BACKEND = "https://falcon-ai-backend-wibl.onrender.com";

export default function ResumeUpload({ setResumeText, setJobDescription }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
      const parseRes = await fetch(`${BACKEND}/api/parse-resume`, {
        method: "POST",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        body: fd,
      });
      const parseData = await parseRes.json();
      if (!parseRes.ok) throw new Error(parseData.error);

      setResumeText(parseData.text);

      await fetch(`${BACKEND}/api/save-context`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          resumeText: parseData.text,
          jobDescription: "",
        }),
      });

      alert("Resume loaded & context saved!");
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0",
        marginBottom: 24,
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <div
          style={{
            background: "#4CAF50",
            color: "white",
            width: 36,
            height: 36,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            marginRight: 12,
          }}
        >
          1
        </div>
        <h3 style={{ margin: 0, fontSize: "1.2em", color: "#333" }}>
          Resume (Optional – PDF/Word)
        </h3>
      </div>

      <div style={{ position: "relative" }}>
        <input
          type="file"
          accept=".pdf,.docx,.doc"
          onChange={handleFile}
          disabled={uploading}
          style={{
            width: "90%",
            padding: "12px",
            border: "2px dashed #aaa",
            borderRadius: 8,
            background: uploading ? "#f9f9f9" : "#fff",
            cursor: uploading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        />
        {uploading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255,255,255,0.8)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              fontSize: "0.9em",
            }}
          >
            Parsing & saving...
          </div>
        )}
      </div>

      <p
        style={{
          margin: "12px 0 0",
          fontSize: "0.85em",
          color: "#777",
          fontStyle: "italic",
        }}
      >
        Upload your resume to personalize AI answers
      </p>
    </div>
  );
}