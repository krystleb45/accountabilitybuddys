import React from "react";

interface SEOManagerProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEOManager: React.FC<SEOManagerProps> = ({ title, description, image, url }) => {
  return (
    <>
      <meta name="title" content={title} />
      {description && <meta name="description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
    </>
  );
};

export default SEOManager;
