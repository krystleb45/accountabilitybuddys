import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from '@mui/material';
import './Recommendations.module.css';

interface IndividualRecommendation {
  id: string;
  name: string;
  bio: string;
  sharedGoals: string[];
}

interface IndividualRecommendationsProps {
  recommendations: IndividualRecommendation[];
  onConnect: (individualId: string) => void; // Function to handle connecting with an individual
}

const IndividualRecommendations: React.FC<IndividualRecommendationsProps> = ({
  recommendations,
  onConnect,
}) => {
  return (
    <div
      className="individual-recommendations"
      role="region"
      aria-labelledby="individual-recommendations-header"
    >
      <Typography
        id="individual-recommendations-header"
        variant="h4"
        gutterBottom
      >
        Recommended Individuals
      </Typography>
      <div className="recommendations-grid">
        {recommendations.length > 0 ? (
          recommendations.map((individual) => (
            <Card
              key={individual.id}
              className="individual-card"
              style={{ minWidth: '240px', maxWidth: '300px' }}
              aria-labelledby={`individual-name-${individual.id}`}
            >
              <CardHeader
                id={`individual-name-${individual.id}`}
                title={individual.name}
                subheader={`Shared Goals: ${individual.sharedGoals.length}`}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  {individual.bio}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  style={{ marginTop: '8px' }}
                >
                  Shared Goals:
                  <ul>
                    {individual.sharedGoals.map((goal, index) => (
                      <li key={index}>{goal}</li>
                    ))}
                  </ul>
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => onConnect(individual.id)}
                  style={{ marginTop: '8px' }}
                  aria-label={`Connect with ${individual.name}`}
                >
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No recommended individuals available at the moment.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default IndividualRecommendations;
