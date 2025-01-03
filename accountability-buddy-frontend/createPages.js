const fs = require('fs');
const path = require('path');

// Define the pages to create
const pages = [
  'about-us',
  'contact-support',
  'dashboard',
  'faq',
  'group',
  'privacy-policy',
  'search',
  'settings',
  'subscription',
  'welcome',
  // Add more pages as needed
];

// Base directory for the App Router
const baseDir = path.join(__dirname, 'app');

// Helper function to capitalize the first letter of a string
const capitalizePageName = (page) => page.charAt(0).toUpperCase() + page.slice(1);

// Helper function to format the page title (replace hyphens with spaces and capitalize words)
const formatPageTitle = (page) => 
  page
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

// Helper function to create the content of a page
const generatePageContent = (page) => `
import React from 'react';

const ${capitalizePageName(page)}Page = () => {
  return (
    <div>
      <h1>${formatPageTitle(page)}</h1>
      <p>Welcome to the ${formatPageTitle(page)} page!</p>
    </div>
  );
};

export default ${capitalizePageName(page)}Page;
`;

// Create directories and page files
pages.forEach((page) => {
  const pageDir = path.join(baseDir, page);

  try {
    // Create the directory if it doesn't exist
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
      console.log(`Created directory: ${pageDir}`);
    }

    // Create the page.tsx file with a default template
    const pageFile = path.join(pageDir, 'page.tsx');
    if (!fs.existsSync(pageFile)) {
      const pageContent = generatePageContent(page);
      fs.writeFileSync(pageFile, pageContent.trim());
      console.log(`Created file: ${pageFile}`);
    } else {
      console.log(`File already exists: ${pageFile}`);
    }
  } catch (error) {
    console.error(`Error creating page ${page}:`, error);
  }
});
