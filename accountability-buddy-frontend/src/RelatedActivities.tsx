"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";

interface Activity {
  id: string;
  name: string;
}

interface RelatedActivitiesProps {
  activityId: string;
}

const RelatedActivities: React.FC<RelatedActivitiesProps> = ({ activityId }) => {
  const [relatedActivities, setRelatedActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!activityId) {
      setError("Activity ID is required to fetch related activities.");
      setLoading(false);
      return;
    }

    const fetchRelatedActivities = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${BASE_URL}/activities/${activityId}/related`);
        if (response.status === 200 && Array.isArray(response.data)) {
          setRelatedActivities(response.data);
        } else {
          setError("No related activities found or invalid response.");
        }
      } catch (err) {
        console.error("Error fetching related activities:", err);
        setError("An error occurred while fetching related activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedActivities();
  }, [activityId]);

  if (loading) return <p>Loading related activities...</p>;
  if (error) return <p className="error-message" role="alert">{error}</p>;

  return (
    <div className="related-activities" role="region" aria-labelledby="related-activities-header">
      <h3 id="related-activities-header">Related Activities</h3>
      {relatedActivities.length > 0 ? (
        <ul>
          {relatedActivities.map((activity) => (
            <li key={activity.id}>
              <Link href={`/activities/${activity.id}`}>
                <a>{activity.name}</a>
              </Link>
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
