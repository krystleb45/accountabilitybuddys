import React, { useEffect, useState, useCallback } from "react";
import { getSubscriptionStatus } from "../services/subscriptionService";
import "./SubscriptionStatus.css"; // Optional CSS for styling

const SubscriptionStatus: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("");
  const [error, setError] = useState<string>("");

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

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return (
    <div className="subscription-status">
      <h2>Subscription Status</h2>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <p className="error">{error}</p>
      ) : (
        <p>{subscriptionStatus}</p>
      )}
      <button onClick={fetchStatus}>Refresh Status</button>
    </div>
  );
};

export default SubscriptionStatus;
