import React from 'react';
import './SidebarFooter.module.css';

interface SidebarFooterProps {
  onThemeToggle?: () => void;
  onLogout?: () => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({
  onThemeToggle,
  onLogout,
}) => {
  return (
    <div className="sidebar-footer">
      <button
        className="footer-button theme-toggle"
        onClick={onThemeToggle}
        aria-label="Toggle Theme"
      >
        Toggle Theme
      </button>
      <button
        className="footer-button logout"
        onClick={onLogout}
        aria-label="Log Out"
      >
        Logout
      </button>
    </div>
  );
};

export default SidebarFooter;
