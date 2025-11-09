// frontend/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SetupPage from "./pages/SetupPage";
import InterviewPage from "./pages/InterviewPage";
import { useEffect, useState } from "react";

export default function App() {
  const [token, setToken] = useState(sessionStorage.getItem("token"));

  // Listen for token changes (in case set elsewhere)
  useEffect(() => {
    const handleStorage = () => {
      setToken(sessionStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/setup" replace />} />
      <Route path="/setup" element={token ? <SetupPage /> : <Navigate to="/login" replace />} />
      <Route path="/interview" element={token ? <InterviewPage /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}