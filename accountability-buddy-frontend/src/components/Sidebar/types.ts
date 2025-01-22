export interface SidebarProps {
    isVisible: boolean;
  }
  
  export interface SidebarItemProps {
    label: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
  }
  
  export interface SidebarFooterProps {
    onThemeToggle?: () => void;
    onLogout?: () => void;
  }
  