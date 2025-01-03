import React, { useState } from 'react';
import './FAQPage.css'; // Assuming you have some basic CSS for this page

const faqData = [
  {
    category: 'Account',
    questions: [
      {
        question: 'How do I create an account?',
        answer: 'To create an account, click on the "Sign Up" button at the top right corner of the homepage and fill in the required details.',
      },
      {
        question: 'How do I reset my password?',
        answer: 'You can reset your password by clicking "Forgot Password" on the login page and following the instructions.',
      },
    ],
  },
  {
    category: 'Billing',
    questions: [
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept major credit cards including Visa, Mastercard, and American Express. You can also pay via PayPal.',
      },
      {
        question: 'How can I cancel my subscription?',
        answer: 'To cancel your subscription, go to your account settings, select "Manage Subscription", and follow the instructions.',
      },
    ],
  },
];

const FAQPage = () => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // Toggle the expanded state of a question
  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  return (
    <div className="faq-page" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Frequently Asked Questions (FAQs)</h1>

      {faqData.map((category, catIndex) => (
        <div key={catIndex} className="faq-category" style={{ marginBottom: '20px' }}>
          <h2>{category.category}</h2>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            {category.questions.map((q, index) => (
              <li key={index} className="faq-item" style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => toggleQuestion(`${catIndex}-${index}`)}
                  aria-expanded={expandedQuestion === `${catIndex}-${index}`}
                  aria-controls={`faq-answer-${catIndex}-${index}`}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    backgroundColor: expandedQuestion === `${catIndex}-${index}` ? '#f0f0f0' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  {q.question}
                </button>

                {expandedQuestion === `${catIndex}-${index}` && (
                  <div
                    id={`faq-answer-${catIndex}-${index}`}
                    role="region"
                    style={{
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderTop: 'none',
                      backgroundColor: '#f9f9f9',
                      marginTop: '-1px',
                      borderRadius: '0 0 5px 5px',
                    }}
                  >
                    {q.answer}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FAQPage;
