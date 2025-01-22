// Types for Profile components

export interface User {
  name: string;
  email: string;
}

export interface ProfileSettingsProps {
  user: User;
  onUpdate: (updatedData: User & { password?: string }) => void;
}

export interface UserProfileProps {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

export interface ProfileProps {
  userId: string;
}
