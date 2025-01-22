'use client';

import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import RecentActivities from '../../components/Activities/RecentActivities';
import GroupRecommendations from '../../components/Recommendations/GroupRecommendations';
import GoalProgress from '../../components/Gamification/GoalProgress';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import axios from 'axios';

const HomePage: React.FC = () => {
  const { authToken } = useContext(AuthContext) || {};
  const [username, setUsername] = useState<string>('User');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Sample state data for GoalProgress
  const [goalTitle, setGoalTitle] = useState<string>('Complete Project');
  const [currentProgress, setCurrentProgress] = useState<number>(50);
  const [targetProgress, setTargetProgress] = useState<number>(100);

  // Sample state for GroupRecommendations
  const [recommendations] = useState([
    {
      id: '1',
      name: 'Project Enthusiasts',
      description: 'A group for project lovers',
      membersCount: 150,
    },
    {
      id: '2',
      name: 'Goal Setters',
      description: 'A community focused on achieving goals',
      membersCount: 200,
    },
  ]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (response.data?.success) {
          setUsername(response.data.user.username || 'User');
        } else {
          setError('Failed to fetch user data.');
        }
      } catch (err) {
        setError('An error occurred while loading your profile.');
      } finally {
        setLoading(false);
      }
    };

    if (authToken) fetchUserProfile();
  }, [authToken]);

  const handleEditGoal = () => {
    console.log('Edit goal clicked');
  };

  const handleJoinGroup = (groupId: string) => {
    console.log(`Joining group with ID: ${groupId}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-blue-100">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {username}!
        </h1>
      </header>

      {loading ? (
        <div className="flex justify-center" role="status" aria-live="polite">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div
          className="text-red-600 text-center my-4"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      ) : (
        <main className="space-y-8">
          {/* Goal Progress Section */}
          <section aria-label="Goal Progress">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Goal Progress
            </h2>
            <GoalProgress
              goalTitle={goalTitle}
              currentProgress={currentProgress}
              targetProgress={targetProgress}
              onEditGoal={handleEditGoal}
            />
          </section>

          {/* Recent Activities Section */}
          <section aria-label="Recent Activities">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Recent Activities
            </h2>
            <RecentActivities activities={[]} />
          </section>

          {/* Group Recommendations Section */}
          <section aria-label="Group Recommendations">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Group Recommendations
            </h2>
            <GroupRecommendations
              recommendations={recommendations}
              onJoinGroup={handleJoinGroup}
            />
          </section>
        </main>
      )}
    </div>
  );
};

export default HomePage;
