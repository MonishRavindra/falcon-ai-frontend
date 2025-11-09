// components/NewSessionButton.jsx
export default function NewSessionButton({ onNewSession }) {
    return (
      <button
        onClick={onNewSession}
        style={{
          background: "#ff4444",
          color: "white",
          padding: "10px 16px",
          border: "none",
          borderRadius: 6,
          marginTop: 20,
        }}
      >
        New Session (Clear Context)
      </button>
    );
  }