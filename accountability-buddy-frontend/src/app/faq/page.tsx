'use client'; // Ensure it's a Client Component

import React, { useState } from 'react';

const FaqPage: React.FC = () => {
  const faqs = [
    {
      question: 'What is Accountability Buddy?',
      answer:
        'Accountability Buddy is a tool designed to help individuals achieve their goals through personalized support, tracking, and community interaction.',
    },
    {
      question: 'How can I create a new task?',
      answer:
        'To create a new task, navigate to the "Tasks" section from your dashboard and click on "Add New Task". Fill in the task details and save it.',
    },
    {
      question: 'Can I update my profile information?',
      answer:
        'Yes, you can update your profile information by visiting the "Profile Settings" page in your dashboard.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Frequently Asked Questions (FAQ)
      </h1>
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="mb-6 p-4 bg-white rounded-lg shadow-md cursor-pointer"
            onClick={() => toggleFaq(index)}
          >
            <h2 className="text-xl font-semibold mb-2 text-blue-600">
              {faq.question}
            </h2>
            {activeIndex === index && (
              <p className="text-gray-700 mt-2">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
