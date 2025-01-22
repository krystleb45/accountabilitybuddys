export interface GroupRecommendation {
    id: string;
    name: string;
    description: string;
    membersCount: number;
  }
  
  export interface IndividualRecommendation {
    id: string;
    name: string;
    bio: string;
    sharedGoals: string[];
  }
  
  export interface BookRecommendation {
    id: string;
    title: string;
    author: string;
    description: string;
    link?: string;
  }