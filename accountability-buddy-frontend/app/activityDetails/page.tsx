"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LoadingSpinner from '../../src/components/LoadingSpinner';
import RelatedActivities from '../../src/components/RelatedActivities';
import ActivityService from '../../src/services/activityService'; // Import as an object

// Define the structure of activity data
interface Activity {
  title: string;
  description: string;
  isJoined: boolean;
  // Add any additional properties here
}

const ActivityDetailsPage: React.FC = () => {
  const router = useRouter();
  const { activityId } = router.query as { activityId?: string };

  const [activity, setActivity] = useState<Activity | null>(null); // Use Activity type
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);

  useEffect(() => {
    if (!activityId) return;

    const fetchActivity = async () => {
      setLoading(true);
      setError('');
      try {
        const data: Activity = await ActivityService.getActivityDetails(activityId); // Cast to Activity
        setActivity(data);
        setIsJoined(data.isJoined);
      } catch (err) {
        console.error('Failed to fetch activity details:', err);
        setError('Failed to load activity details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activityId]);

  const handleJoin = async () => {
    if (!activityId) return;

    setLoadingAction(true);
    setError('');
    try {
      await ActivityService.joinActivity(activityId); // Ensure ActivityService method is called
      setIsJoined(true);
    } catch (err) {
      console.error('Failed to join activity:', err);
      setError('Failed to join the activity. Please try again.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleLeave = async () => {
    if (!activityId) return;

    setLoadingAction(true);
    setError('');
    try {
      await ActivityService.leaveActivity(activityId); // Ensure ActivityService method is called
      setIsJoined(false);
    } catch (err) {
      console.error('Failed to leave activity:', err);
      setError('Failed to leave the activity. Please try again.');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {loading ? (
        <div className="flex justify-center mt-20">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center my-4" role="alert">
          {error}
        </div>
      ) : (
        activity && (
          <div>
            <h1 className="text-4xl font-bold mb-6">{activity.title}</h1>
            <p className="text-lg mb-6">{activity.description}</p>

            <div className="flex justify-center mb-6">
              {isJoined ? (
                <button
                  onClick={handleLeave}
                  disabled={loadingAction}
                  className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-all"
                >
                  {loadingAction ? 'Leaving...' : 'Leave Activity'}
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={loadingAction}
                  className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-all"
                >
                  {loadingAction ? 'Joining...' : 'Join Activity'}
                </button>
              )}
            </div>

            <section className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Related Activities</h2>
             {activityId && <RelatedActivities activityId={activityId} />} {/* Only render if activityId is defined */}
            </section>
          </div>
        )
      )}
    </div>
  );
};

export default ActivityDetailsPage;
