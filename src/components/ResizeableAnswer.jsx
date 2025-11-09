// components/ResizableAnswer.jsx
import { useState, useRef, useEffect } from "react";

export default function ResizableAnswer({ answer, loading }) {
  const [height, setHeight] = useState(200);
  const containerRef = useRef(null);

  // Auto-resize when answer grows
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(el);
    return () => resizeObserver.unobserve(el);
  }, []);

  return (
    <div
      style={{
        background: "white",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        border: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3 style={{ margin: "0 0 16px", fontWeight: "bold" }}>Answer</h3>

      <div
        ref={containerRef}
        style={{
          background: "#f0f7ff",
          padding: 16,
          borderRadius: 8,
          minHeight: 120,
          height,
          whiteSpace: "pre-wrap",
          fontFamily: "Georgia, serif",
          fontSize: "1.05em",
          lineHeight: 1.6,
          resize: "vertical",
          overflow: "auto",
          border: "1px solid #ddd",
          position: "relative",
        }}
      >
        {/* SHOW ANSWER LIVE — EVEN DURING LOADING */}
        {answer ? (
          <div>{answer}</div>
        ) : loading ? (
          <div style={{ color: "#666", fontStyle: "italic" }}>Generating answer...</div>
        ) : (
          <div style={{ color: "#aaa" }}>(Answer will appear here)</div>
        )}

        {/* Optional: Blinking cursor during generation */}
        {loading && !answer && (
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: "1.2em",
              background: "#666",
              marginLeft: 4,
              animation: "blink 1s steps(2, start) infinite",
            }}
          />
        )}
      </div>

      <p style={{ margin: "8px 0 0", fontSize: "0.8em", color: "#777" }}>
        Drag bottom edge to resize
      </p>

      {/* Optional: Add CSS for blink animation */}
      <style jsx>{`
        @keyframes blink {
          to { visibility: hidden; }
        }
      `}</style>
    </div>
  );
}