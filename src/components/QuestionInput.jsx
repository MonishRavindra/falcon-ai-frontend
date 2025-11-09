// components/QuestionInput.jsx
import { useState, useRef, useEffect } from "react";

export default function QuestionInput({ onSubmit }) {
  const [question, setQuestion] = useState("");
  const [listening, setListening] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState("auto");
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto, then set to scrollHeight
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setTextareaHeight(`${textarea.scrollHeight}px`);
  }, [question]);

  const startMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech Recognition not supported. Use Chrome.");

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      setQuestion(transcript);
    };

    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);

    rec.start();
    setListening(true);
    recognitionRef.current = rec;
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
    if (question.trim()) onSubmit(question);
  };

  const handleSend = () => {
    if (question.trim()) {
      onSubmit(question);
      setQuestion(""); // Clear after send
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0, fontSize: "1.2em", fontWeight: "bold" }}>Ask Question</h3>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        {/* Mic Button */}
        <button
          onClick={listening ? stopMic : startMic}
          style={{
            width: 60,
            height: 60,
            padding: 0,
            background: listening ? "#ff4444" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: "1.1em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          title={listening ? "Stop listening" : "Start voice input"}
        >
          {listening ? "Stop" : "Mic"}
        </button>

        {/* Auto-expanding Textarea */}
        <textarea
          ref={textareaRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type or speak your question... (Press Enter to send)"
          readOnly={listening}
          rows={1}
          style={{
            flex: 1,
            padding: "12px 16px",
            fontSize: "1em",
            fontFamily: "inherit",
            border: "2px solid #ddd",
            borderRadius: 12,
            resize: "none",
            overflow: "hidden",
            minHeight: 60,
            height: textareaHeight,
            transition: "height 0.1s ease",
            background: listening ? "#f9f9f9" : "white",
          }}
        />

        {/* Generate Button */}
        <button
          onClick={handleSend}
          disabled={!question.trim() || listening}
          style={{
            padding: "12px 20px",
            background: (!question.trim() || listening) ? "#ccc" : "#2196F3",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontWeight: "bold",
            cursor: (!question.trim() || listening) ? "not-allowed" : "pointer",
            alignSelf: "flex-end",
            height: 60,
          }}
        >
          Generate
        </button>
      </div>

      {/* Voice Status */}
      {listening && (
        <p style={{ margin: "0", color: "#4CAF50", fontSize: "0.9em", fontWeight: "500" }}>
          Speaking... Press Stop to generate
        </p>
      )}
    </div>
  );
}