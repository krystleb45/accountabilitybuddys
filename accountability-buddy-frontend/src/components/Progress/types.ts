export interface Goal {
    id: string;
    title: string;
    description?: string;
    status: string;
    progress: number;
  }
  
  export interface AnalyticsData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
      fill?: boolean;
    }[];
  }
  
  export interface ProgressTrackerProps {
    progress: number;
    label?: string;
  }
  
  export interface GoalDetailsProps {
    goal: Goal | null;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
  }
  
  export interface GoalAnalyticsProps {
    dateRange: string;
  }
  