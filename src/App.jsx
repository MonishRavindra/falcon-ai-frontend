// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SetupPage from "./pages/SetupPage";
import InterviewPage from "./pages/InterviewPage";

export default function App() {
  const token = sessionStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/setup" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/setup" replace />} />
      <Route path="/setup" element={token ? <SetupPage /> : <Navigate to="/login" replace />} />
      <Route path="/interview" element={token ? <InterviewPage /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}