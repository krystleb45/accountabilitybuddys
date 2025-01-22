export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number; // Percent complete
  deadline: Date;
}
