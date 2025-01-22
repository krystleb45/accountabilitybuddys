export interface Resource {
  id: string;
  name: string;
  link: string;
}

export interface UserProfileSettings {
  name: string;
  email: string;
  password?: string;
}

export interface ThemeToggleProps {
  onToggle: () => void;
}
