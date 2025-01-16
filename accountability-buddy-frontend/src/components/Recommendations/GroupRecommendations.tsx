import React from 'react';
import { Card, CardContent, CardHeader, Typography, Button } from '@mui/material';

// Define the interface for a group recommendation
interface GroupRecommendation {
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

const GroupRecommendations: React.FC<GroupRecommendationsProps> = ({ recommendations, onJoinGroup }) => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Recommended Groups
      </Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
        {recommendations.map((group) => (
          <Card key={group.id} style={{ minWidth: '240px', maxWidth: '300px' }}>
            <CardHeader title={group.name} subheader={`${group.membersCount} members`} />
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                {group.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => onJoinGroup(group.id)}
                style={{ marginTop: '8px' }}
              >
                Join Group
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GroupRecommendations;
