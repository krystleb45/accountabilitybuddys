import React, { useEffect, useState } from "react";
import "./ResourceLinks.module.css";

interface Resource {
  id: string;
  name: string;
  link: string;
}

const ResourceLinks: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("/api/militarySupport/resources"); // Backend endpoint
        if (!response.ok) {
          throw new Error(`Error fetching resources: ${response.statusText}`);
        }
        const data: Resource[] = await response.json();
        setResources(data);
      } catch (err: any) {
        console.error("Error fetching resources:", err);
        setError(err.message || "Failed to fetch resources.");
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="resources" role="region" aria-labelledby="resources-header">
      <h2 id="resources-header">Helpful Resources</h2>
      {error ? (
        <p className="error-message" role="alert">{error}</p>
      ) : (
        <ul className="resource-list">
          {resources.length > 0 ? (
            resources.map((resource) => (
              <li key={resource.id} className="resource-item">
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open resource: ${resource.name}`}
                >
                  {resource.name}
                </a>
              </li>
            ))
          ) : (
            <p>No resources available at the moment.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default ResourceLinks;
