import React, { useEffect, useState } from 'react';

const ResourceLinks: React.FC = () => {
    const [resources, setResources] = useState([]);

    useEffect(() => {
        fetch('/api/militarySupport/resources') // Endpoint from backend
            .then((response) => response.json())
            .then((data) => setResources(data))
            .catch((error) => console.error('Error fetching resources:', error));
    }, []);

    return (
        <div className="resources">
            <h2>Helpful Resources</h2>
            <ul>
                {resources.map((resource: any, index: number) => (
                    <li key={index}>
                        <a href={resource.link} target="_blank" rel="noopener noreferrer">
                            {resource.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResourceLinks;
