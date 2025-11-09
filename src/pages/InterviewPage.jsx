// pages/InterviewPage.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionInput from "../components/QuestionInput";
import ResizableAnswer from "../components/ResizeableAnswer";
import SessionHistory from "../components/SessionHistory";
import NewSessionButton from "../components/NewSessionButton";

const BACKEND = "https://falcon-ai-backend-wibl.onrender.com";

export default function InterviewPage() {
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const abortControllerRef = useRef(null);
    const navigate = useNavigate();
  
    // Clear answer on unmount
    useEffect(() => {
      return () => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
      };
    }, []);
  
    const generateAnswer = async (question) => {
      // Cancel previous
      if (abortControllerRef.current) abortControllerRef.current.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;
  
      setLoading(true);
      setCurrentAnswer(""); // Clear IMMEDIATELY
  
      try {
        const res = await fetch(`${BACKEND}/api/generate-answer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
          body: JSON.stringify({ question }),
          signal: controller.signal,
        });
  
        if (!res.ok) throw new Error("Stream failed");
  
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
  
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
  
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
  
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;
  
            const jsonStr = trimmed.slice(6);
            if (jsonStr === "[DONE]") {
              // Save to history ONLY when done
              setHistory((h) => [...h, { q: question, a: currentAnswer }]);
              setLoading(false);
              return;
            }
  
            try {
              const { token, error } = JSON.parse(jsonStr);
              if (error) throw new Error(error);
              if (token) {
                setCurrentAnswer((prev) => prev + token);
              }
            } catch {}
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setCurrentAnswer(`[Error: ${err.message}]`);
        }
      } finally {
        setLoading(false);
      }
    };
  
    const stopGeneration = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setLoading(false);
    };
  
    const startNewSession = async () => {
      if (!confirm("Start new session? All data will be cleared.")) return;
      try {
        await fetch(`${BACKEND}/api/new-session`, {
          method: "POST",
          headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        });
        setCurrentAnswer("");
        setHistory([]);
        navigate("/setup");
      } catch {
        alert("Failed");
      }
    };
  
    return (
      <div style={{ maxWidth: 1100, margin: "30px auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1>Interview Session</h1>
          <div>
            <NewSessionButton onNewSession={startNewSession} />
            <button
              onClick={() => {
                sessionStorage.removeItem("token");
                navigate("/login");
              }}
              style={{ marginLeft: 10, padding: "8px 16px", border: "1px solid #ccc", borderRadius: 6 }}
            >
              Logout
            </button>
          </div>
        </div>
  
        <div style={{ gap: 24 }}>
          <QuestionInput onSubmit={generateAnswer} />
          <div>
            {loading && (
              <button
                onClick={stopGeneration}
                style={{
                  marginBottom: 12,
                  background: "#ff4444",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: 6,
                }}
              >
                Stop Generation
              </button>
            )}
            <ResizableAnswer answer={currentAnswer} loading={loading} />
          </div>
        </div>
  
        {/* SESSION HISTORY – WITH UNIQUE KEY */}
        {history.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <SessionHistory history={history} key={history.length} />
          </div>
        )}
      </div>
    );
  }