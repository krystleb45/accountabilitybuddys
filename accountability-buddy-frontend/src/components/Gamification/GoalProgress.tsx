import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
} from '@mui/material';

// Define the interface for the goal progress
interface GoalProgressProps {
  goalTitle: string;
  currentProgress: number; // Current progress as a percentage (0-100)
  targetProgress: number; // Target progress
  onEditGoal: () => void; // Function to handle editing the goal
}

// GoalProgress Component
const GoalProgress: React.FC<GoalProgressProps> = ({
  goalTitle,
  currentProgress,
  targetProgress,
  onEditGoal,
}) => {
  // Calculate the percentage completion
  const progressPercentage = (currentProgress / targetProgress) * 100;

  return (
    <Card>
      <CardHeader title={goalTitle} />
      <CardContent>
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary">
            Progress: {currentProgress}/{targetProgress}
          </Typography>
          <LinearProgress variant="determinate" value={progressPercentage} />
        </Box>
        <Typography variant="caption" color="textSecondary">
          {progressPercentage.toFixed(0)}% completed
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onEditGoal}
          style={{ marginTop: '16px' }}
        >
          Edit Goal
        </Button>
      </CardContent>
    </Card>
  );
};

export default GoalProgress;
