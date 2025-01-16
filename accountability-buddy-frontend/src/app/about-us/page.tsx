import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="about-us-container p-10 max-w-4xl mx-auto bg-gray-100 rounded-lg text-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">About Us</h1>
      <p className="text-lg mb-6 text-gray-700">
        Welcome to the About Us page! Accountability Buddy is dedicated to helping individuals
        achieve their goals through personalized support, goal tracking, and community interaction.
        Our mission is to create an environment where progress is celebrated, and accountability is encouraged.
      </p>
      
      <section className="my-10">
        <h2 className="text-3xl font-semibold mb-4 text-blue-600">Our Mission</h2>
        <p className="text-lg text-gray-700">
          We strive to empower users to stay focused on their goals, whether personal, professional, or health-related.
          By fostering a supportive community and providing tools for better accountability, we make the journey more enjoyable and successful.
        </p>
      </section>
      
      <section className="my-10">
        <h2 className="text-3xl font-semibold mb-4 text-blue-600">Our Team</h2>
        <p className="text-lg text-gray-700">
          Our team is a group of passionate developers, designers, and goal-oriented individuals committed
          to delivering a seamless and motivating experience for our users.
        </p>
      </section>
    </div>
  );
};

export default AboutUsPage;
