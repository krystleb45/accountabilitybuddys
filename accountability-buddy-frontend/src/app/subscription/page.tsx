'use client';

import React from 'react';

const SubscriptionsPage: React.FC = () => {
  const plans = [
    { name: 'Free', price: '$0/month', features: ['Basic access'] },
    {
      name: 'Pro',
      price: '$9.99/month',
      features: ['Advanced analytics', 'Priority support'],
    },
    {
      name: 'Premium',
      price: '$19.99/month',
      features: ['All Pro features', '1-on-1 coaching'],
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-yellow-50 to-orange-100">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Subscriptions</h1>
        <p className="text-gray-600">
          Choose the plan that&apos;s right for you.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md text-center"
          >
            <h2 className="text-xl font-bold mb-4">{plan.name}</h2>
            <p className="text-2xl font-bold text-gray-800">{plan.price}</p>
            <ul className="text-gray-600 mt-4">
              {plan.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
