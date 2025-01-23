import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from '@mui/material';
import './Recommendations.module.css';

// Define the interface for a group recommendation
// accountability-buddy-frontend/src/components/Recommendations/GroupRecommendations.tsx
export interface GroupRecommendation {
  id: string;
  name: string;
  description: string;
  membersCount: number;
}

// Define the props for the GroupRecommendations component
interface GroupRecommendationsProps {
  recommendations: GroupRecommendation[];
  onJoinGroup: (groupId: string) => void; // Function to handle joining a group
}

const GroupRecommendations: React.FC<GroupRecommendationsProps> = ({
  recommendations,
  onJoinGroup,
}) => {
  return (
    <div
      className="group-recommendations"
      role="region"
      aria-labelledby="group-recommendations-header"
    >
      <Typography id="group-recommendations-header" variant="h4" gutterBottom>
        Recommended Groups
      </Typography>
      <div className="recommendations-grid">
        {recommendations.length > 0 ? (
          recommendations.map((group) => (
            <Card
              key={group.id}
              className="group-card"
              style={{ minWidth: '240px', maxWidth: '300px' }}
              aria-labelledby={`group-title-${group.id}`}
            >
              <CardHeader
                id={`group-title-${group.id}`}
                title={group.name}
                subheader={`${group.membersCount} members`}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  {group.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onJoinGroup(group.id)}
                  style={{ marginTop: '8px' }}
                  aria-label={`Join ${group.name}`}
                >
                  Join Group
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No recommended groups available at the moment.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default GroupRecommendations;
