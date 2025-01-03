import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

interface RelatedActivity {
  id: string;
  name: string;
  description: string;
  // Add more fields as needed
}

interface RelatedActivitiesProps {
  activityId: string;
}

const RelatedActivities: React.FC<RelatedActivitiesProps> = ({ activityId }) => {
  const [relatedActivities, setRelatedActivities] = useState<RelatedActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch related activities when the component mounts or activityId changes
  useEffect(() => {
    if (!activityId) return;

    const fetchRelatedActivities = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${BASE_URL}/activities/${activityId}/related`);

        if (response.status === 200 && response.data) {
          setRelatedActivities(response.data);
        } else {
          setError("Failed to fetch related activities. Please try again.");
        }
      } catch (err) {
        setError("An error occurred while fetching related activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedActivities();
  }, [activityId]);

  return (
    <div className="related-activities">
      <h3>Related Activities</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : relatedActivities.length > 0 ? (
        <ul>
          {relatedActivities.map((activity) => (
            <li key={activity.id}>
              <h4>{activity.name}</h4>
              <p>{activity.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No related activities found.</p>
      )}
    </div>
  );
};

export default RelatedActivities;
