import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getActivityDetails, joinActivity, leaveActivity } from '../services/activityService';
import LoadingSpinner from '../components/LoadingSpinner';
import RelatedActivities from '../components/RelatedActivities';

const ActivityDetailsPage = () => {
  const { id } = useParams(); // Fetch activity ID from URL params
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  // Fetch activity details on component mount
  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getActivityDetails(id);
        setActivity(data);
        setIsJoined(data.isJoined); // Set initial join status
      } catch (err) {
        console.error('Failed to fetch activity details:', err);
        setError('Failed to load activity details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  // Handle joining an activity
  const handleJoin = async () => {
    setLoadingAction(true);
    setError('');
    try {
      await joinActivity(id);
      setIsJoined(true);
    } catch (err) {
      console.error('Failed to join activity:', err);
      setError('Failed to join the activity. Please try again.');
    } finally {
      setLoadingAction(false);
    }
  };

  // Handle leaving an activity
  const handleLeave = async () => {
    setLoadingAction(true);
    setError('');
    try {
      await leaveActivity(id);
      setIsJoined(false);
    } catch (err) {
      console.error('Failed to leave activity:', err);
      setError('Failed to leave the activity. Please try again.');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="activity-details-page" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {loading && <LoadingSpinner />}

      {error && (
        <div className="error-message" role="alert" style={{ color: 'red', margin: '20px 0' }}>
          {error}
        </div>
      )}

      {!loading && activity && (
        <>
          <h1>{activity.title}</h1>
          <p>{activity.description}</p>

          <div className="activity-actions" style={{ marginTop: '20px' }}>
            {isJoined ? (
              <button
                onClick={handleLeave}
                disabled={loadingAction}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#ff4040',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                {loadingAction ? 'Leaving...' : 'Leave Activity'}
              </button>
            ) : (
              <button
                onClick={handleJoin}
                disabled={loadingAction}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                {loadingAction ? 'Joining...' : 'Join Activity'}
              </button>
            )}
          </div>

          <section className="related-activities-section" style={{ marginTop: '40px' }}>
            <h2>Related Activities</h2>
            <RelatedActivities activityId={id} />
          </section>
        </>
      )}
    </div>
  );
};

export default ActivityDetailsPage;
