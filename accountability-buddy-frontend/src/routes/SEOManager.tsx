import React, { useEffect } from "react";

interface SEOManagerProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string; // Optional keywords for SEO
  author?: string; // Optional author meta tag
}

const SEOManager: React.FC<SEOManagerProps> = ({
  title,
  description,
  image,
  url,
  keywords,
  author,
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags dynamically
    const updateOrCreateMeta = (name: string, content: string | undefined) => {
      if (!content) return;
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("name", name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", content);
    };

    const updateOrCreatePropertyMeta = (property: string, content: string | undefined) => {
      if (!content) return;
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("property", property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", content);
    };

    updateOrCreateMeta("title", title);
    updateOrCreateMeta("description", description);
    updateOrCreateMeta("keywords", keywords);
    updateOrCreateMeta("author", author);

    updateOrCreatePropertyMeta("og:title", title);
    updateOrCreatePropertyMeta("og:description", description);
    updateOrCreatePropertyMeta("og:image", image);
    updateOrCreatePropertyMeta("og:url", url);
    updateOrCreatePropertyMeta("og:type", "website");

    updateOrCreateMeta("twitter:card", "summary_large_image");
    updateOrCreateMeta("twitter:title", title);
    updateOrCreateMeta("twitter:description", description);
    updateOrCreateMeta("twitter:image", image);
  }, [title, description, image, url, keywords, author]);

  return null;
};

export default SEOManager;
