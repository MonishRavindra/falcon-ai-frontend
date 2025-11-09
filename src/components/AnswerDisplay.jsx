// components/AnswerDisplay.jsx
export default function AnswerDisplay({ answer, loading }) {
    return (
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <div style={{ background: "#E91E63", color: "white", width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", marginRight: 12 }}>
            4
          </div>
          <h3 style={{ margin: 0, fontSize: "1.2em" }}>AI Answer</h3>
        </div>
        <div
          style={{
            background: "#f0f7ff",
            padding: 16,
            borderRadius: 8,
            minHeight: 120,
            whiteSpace: "pre-wrap",
            fontFamily: "Georgia, serif",
            fontSize: "1.05em",
            lineHeight: 1.6,
          }}
        >
          {loading ? "Generating answer..." : answer || "(Answer will appear here)"}
        </div>
      </div>
    );
  }