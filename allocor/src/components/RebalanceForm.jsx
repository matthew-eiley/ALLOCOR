import { useState } from "react";

const RebalanceForm = () => {
  // 1. State for the input ID
  const [portfolioId, setPortfolioId] = useState("");

  // 2. State for handling the response and UI feedback
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitForm = async (e) => {
    e.preventDefault(); // Prevent page refresh

    // Reset states
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      // 3. Construct the URL based on your route structure:
      // Base: /api/portfolios
      // Param: /:id
      // Path: /rebalance/calculate

      const url = `http://localhost:4000/api/portfolios/${portfolioId}/rebalance/calculate`;
      console.log("url to be sent:", url);

      const response = await fetch(url, {
        method: "GET", // Matches router.get() in your backend
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 4. Check for HTTP errors (404, 500, etc.)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to calculate rebalance");
      }

      const data = await response.json();

      // 5. Update state with the 'plan' from the JSON response
      // Backend returns: { message: '...', plan: ... }
      setPlan(data.plan);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", paddingBottom: "100px", maxWidth: "600px" }}>
      <h2>Rebalance Portfolio</h2>

      {/* Input Form */}
      <form onSubmit={submitForm} style={{ marginBottom: "120px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Enter Portfolio ID"
            value={portfolioId}
            onChange={(e) => setPortfolioId(e.target.value)}
            required
            style={{ padding: "8px", flexGrow: 1 }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "8px 16px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Calculating..." : "Calculate"}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div
          style={{
            color: "red",
            padding: "10px",
            background: "#ffe6e6",
            borderRadius: "4px",
          }}
        >
          Error: {error}
        </div>
      )}

      {/* Success Result */}
      {plan && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>Rebalance Plan</h3>
          <pre
            style={{
              background: "#f4f4f4",
              padding: "10px",
              overflowX: "auto",
              color: "black",
              textAlign: "left",
              fontSize: "12px",
              overflowY: "auto",
            }}
          >
            {JSON.stringify(plan, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default RebalanceForm;
