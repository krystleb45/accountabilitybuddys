import React from 'react';

interface RelatedActivity {
  id: string;
  title: string;
  link: string;
}

interface RelatedActivitiesProps {
  activities: RelatedActivity[];
}

const RelatedActivities: React.FC<RelatedActivitiesProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return <p className="related-activities-empty">No related activities</p>;
  }

  return (
    <div className="related-activities-container">
      <h3>Related Activities</h3>
      <ul className="related-activities-list">
        {activities.map((activity) => (
          <li key={activity.id} className="related-activity-item">
            <a href={activity.link} className="related-activity-link">
              {activity.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedActivities;
