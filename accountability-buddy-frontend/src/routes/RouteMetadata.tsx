import React, { useEffect } from "react";

interface RouteMetadataProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const RouteMetadata: React.FC<RouteMetadataProps> = ({ title, description, children }) => {
  useEffect(() => {
    document.title = title;
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
    // Add tracking code here if needed
  }, [title, description]);

  return <>{children}</>;
};

export default RouteMetadata;
