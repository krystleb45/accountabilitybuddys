import React, { useEffect } from 'react';

interface RouteMetadataProps {
  title: string;
  description?: string;
  keywords?: string; // Optional keywords for SEO
  children: React.ReactNode;
}

const RouteMetadata: React.FC<RouteMetadataProps> = ({
  title,
  description,
  keywords,
  children,
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or add meta description
    if (description) {
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = description;
        document.head.appendChild(meta);
      }
    }

    // Update or add meta keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = keywords;
        document.head.appendChild(meta);
      }
    }

    // Optional: Add tracking code here if needed
  }, [title, description, keywords]);

  return <>{children}</>;
};

export default RouteMetadata;
