export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface UserProgress {
  points: number;
  level: number;
  badges: Badge[];
  newBadge?: { name: string }; // Optional new badge details
}
