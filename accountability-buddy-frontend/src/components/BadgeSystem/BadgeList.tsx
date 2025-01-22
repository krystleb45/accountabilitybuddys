import React from "react";
import BadgeItem from "./BadgeItem";
import "./BadgeList.css"; // Optional CSS for styling

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // URL or path to the badge icon
  dateEarned?: string; // Optional: Date when the badge was earned
  isEarned: boolean; // Indicates whether the badge is earned
}

interface BadgeListProps {
  badges: Badge[]; // Array of badge data to display
  onBadgeClick: (id: string) => void; // Callback when a badge is clicked
}

const BadgeList: React.FC<BadgeListProps> = ({ badges, onBadgeClick }) => {
  if (badges.length === 0) {
    return <p className="badge-list-empty">No badges to display.</p>;
  }

  return (
    <div className="badge-list">
      {badges.map((badge) => (
        <BadgeItem key={badge.id} badge={badge} onClick={onBadgeClick} />
      ))}
    </div>
  );
};

export default BadgeList;
