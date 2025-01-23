import React, { useEffect, useState } from 'react';
import { fetchBillingHistory } from 'src/utils/subscriptionUtils'; // Utility function to fetch billing history
import { BillingHistoryItem } from './types'; // Type definitions
import styles from './Stripe.module.css'; // CSS module for styling

const BillingHistory: React.FC = () => {
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBillingHistory = async () => {
      try {
        setLoading(true);
        const history = await fetchBillingHistory(); // Fetch data from backend
        setBillingHistory(history);
        setError(null);
      } catch (err: unknown) {
        setError('Failed to fetch billing history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getBillingHistory();
  }, []);

  if (loading) {
    return <p className={styles.loading}>Loading billing history...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.billingHistoryContainer}>
      <h2 className={styles.heading}>Billing History</h2>
      {billingHistory.length === 0 ? (
        <p className={styles.noHistory}>No billing history available.</p>
      ) : (
        <table className={styles.billingTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {billingHistory.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.description}</td>
                <td>${(item.amount / 100).toFixed(2)}</td>
                <td className={styles[item.status.toLowerCase()]}>
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BillingHistory;
