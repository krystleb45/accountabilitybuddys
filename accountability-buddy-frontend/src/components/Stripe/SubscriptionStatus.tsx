import React, { useEffect, useState, useCallback } from "react";
import { getSubscriptionStatus } from "src/services/subscriptionService";
import "./SubscriptionStatus.css"; // Import CSS for styling

const SubscriptionStatus: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("No active subscription");
  const [error, setError] = useState<string>("");

  // Fetch subscription status from the service
  const fetchStatus = useCallback(async () => {
    setError("");
    setStatus("loading");

    try {
      const result = await getSubscriptionStatus();
      setSubscriptionStatus(result.status || "No active subscription");
      setStatus("success");
    } catch (err) {
      console.error("Error fetching subscription status:", err);
      setError("Failed to fetch subscription status. Please try again.");
      setStatus("error");
    }
  }, []);

  // Fetch status on component mount
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return (
    <div className="subscription-status">
      <h2>Subscription Status</h2>
      {status === "loading" && <p className="loading">Loading...</p>}
      {status === "error" && <p className="error">{error}</p>}
      {status === "success" && <p className="success">{subscriptionStatus}</p>}
      <button
        onClick={fetchStatus}
        className="refresh-button"
        disabled={status === "loading"}
      >
        Refresh Status
      </button>
    </div>
  );
};

export default SubscriptionStatus;
