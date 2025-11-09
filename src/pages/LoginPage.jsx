// pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND = "https://falcon-ai-backend-wibl.onrender.com";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save token
      sessionStorage.setItem("token", data.token);

      // Force redirect + replace history
      navigate("/setup", { replace: true });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 30 }}>
    {/* Replace with your logo */}
    <img
      src="/images/falcon.jpeg" // Change to your logo path
      alt="Falcon AI Logo"
      style={{ width: 100, height: 100, objectFit: "contain" }}
    />
    <h1 style={{ margin: 0, fontSize: "2em", fontWeight: "bold" }}>
      Falcon AI 
    </h1>
  </div>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          style={{
            width: "100%",
            padding: 14,
            margin: "10px 0",
            fontSize: "1em",
            border: "2px solid #ddd",
            borderRadius: 8,
            outline: "none",
          }}
          required
          disabled={loading}
        />
        <br />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "14px 16px",
            fontSize: "1em",
            background: loading ? "#aaa" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            width: "30%",
            marginTop: 10,
            transition: "background 0.2s",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}