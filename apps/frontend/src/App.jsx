import { useEffect, useState } from "react";
import { getBackendHealth } from "./services/health.service";

function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await getBackendHealth();
        setHealth(data);
      } catch (error) {
        console.error("Backend Connection Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>🚀 CareerIQ AI</h1>
      <h3>Sprint 1 - Foundation</h3>

      {loading ? (
        <p>Connecting to Backend...</p>
      ) : health ? (
        <>
          <h2 style={{ color: "green" }}>✅ Backend Connected</h2>

          <pre
            style={{
              background: "#f4f4f4",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            {JSON.stringify(health, null, 2)}
          </pre>
        </>
      ) : (
        <h2 style={{ color: "red" }}>❌ Backend Connection Failed</h2>
      )}
    </div>
  );
}

export default App;