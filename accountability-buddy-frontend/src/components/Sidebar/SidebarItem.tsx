import React from "react";
import "./SidebarItem.module.css";

interface SidebarItemProps {
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, icon, isActive, onClick }) => {
  return (
    <div
      className={`sidebar-item ${isActive ? "active" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
    >
      {icon && <span className="sidebar-icon">{icon}</span>}
      <span className="sidebar-label">{label}</span>
    </div>
  );
};

export default SidebarItem;
