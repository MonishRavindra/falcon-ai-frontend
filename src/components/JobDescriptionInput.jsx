// components/JobDescriptionInput.jsx
import { useState } from "react";

const BACKEND = "https://falcon-ai-backend-wibl.onrender.com";

export default function JobDescriptionInput({ jobDescription, setJobDescription }) {
  const [saving, setSaving] = useState(false);

  const saveJobContext = async () => {
    if (!jobDescription.trim()) return;               // nothing to save
    setSaving(true);
    try {
      await fetch(`${BACKEND}/api/save-context`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ jobDescription }),
      });
    } catch (e) {
      console.error("Failed to save job context", e);
    } finally {
      setSaving(false);
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
      {/* Header with step badge */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <div
          style={{
            background: "#2196F3",
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
          2
        </div>
        <h3 style={{ margin: 0, fontSize: "1.2em", color: "#333" }}>
          Job Description (Optional)
        </h3>
      </div>

      {/* Textarea */}
      <div style={{ position: "relative" }}>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          onBlur={saveJobContext}               // auto-save when focus leaves
          placeholder="Paste the job description here..."
          style={{
            width: "90%",
            height: 120,
            padding: 12,
            border: "2px solid #ddd",
            borderRadius: 8,
            fontSize: "1em",
            resize: "vertical",
            background: saving ? "#f9f9f9" : "white",
            transition: "border-color 0.2s",
          }}
          disabled={saving}
        />
        {saving && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.8)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              fontSize: "0.9em",
            }}
          >
            Saving...
          </div>
        )}
      </div>

      {/* Helper text */}
      <p
        style={{
          margin: "12px 0 0",
          fontSize: "0.85em",
          color: "#777",
          fontStyle: "italic",
        }}
      >
        Add the job posting to get more targeted interview answers.
      </p>
    </div>
  );
}