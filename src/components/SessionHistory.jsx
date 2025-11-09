// components/SessionHistory.jsx
export default function SessionHistory({ history }) {
    return (
      <div style={{ background: "#f9f9f9", padding: 20, borderRadius: 12, border: "1px solid #eee" }}>
        <h3 style={{ margin: "0 0 16px", color: "#555" }}>Session History</h3>
        {history.map((item, index) => (
          <div
            key={index}
            style={{
              marginBottom: 20,
              padding: 16,
              background: "white",
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          >
            <p style={{ margin: "0 0 8px", fontWeight: "bold", color: "#1a1a1a" }}>
              Q{index + 1}: {item.q}
            </p>
            <p style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: "0.95em", lineHeight: 1.6 }}>
              {item.a}
            </p>
          </div>
        ))}
      </div>
    );
  }