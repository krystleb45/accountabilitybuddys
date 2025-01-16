"use client"; // Mark as Client Component

import React, { useState } from "react";

// Subscription Plan Component
const SubscriptionPlan = ({
  planName,
  price,
  features,
  onSelect,
  selected,
}: {
  planName: string;
  price: string;
  features: string[];
  onSelect: () => void;
  selected: boolean;
}) => (
  <div
    className={`p-6 border rounded-lg shadow-md transition-all ${
      selected ? "border-blue-600 bg-blue-50" : "border-gray-200"
    }`}
  >
    <h2 className="text-2xl font-semibold text-gray-800">{planName}</h2>
    <p className="text-lg font-bold text-gray-700 my-2">{price}</p>
    <ul className="list-disc list-inside mb-4">
      {features.map((feature, index) => (
        <li key={index} className="text-gray-600">
          {feature}
        </li>
      ))}
    </ul>
    <button
      onClick={onSelect}
      className={`w-full py-2 mt-2 rounded ${
        selected ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
      } transition-colors hover:bg-blue-700`}
    >
      {selected ? "Selected" : "Select Plan"}
    </button>
  </div>
);

const SubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Mocked subscription plans data
  const subscriptionPlans = [
    {
      planName: "Free",
      price: "Free",
      features: [
        "Basic Goal Tracking",
        "Community Access",
        "Limited Features",
      ],
    },
    {
      planName: "Pro",
      price: "$9.99/month",
      features: [
        "Advanced Goal Tracking",
        "Priority Support",
        "Access to Webinars",
        "Goal Analytics",
      ],
    },
    {
      planName: "Premium",
      price: "$19.99/month",
      features: [
        "All Pro Features",
        "Personalized Coaching",
        "Exclusive Content",
        "Monthly Reports",
      ],
    },
  ];

  // Handle plan selection
  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    console.log(`Selected plan: ${planName}`);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-green-100">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Subscription Plans</h1>
        <p className="text-gray-600">
          Choose a plan that fits your goals and unlock more features!
        </p>
      </header>

      {/* Subscription Plans */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan, index) => (
          <SubscriptionPlan
            key={index}
            planName={plan.planName}
            price={plan.price}
            features={plan.features}
            onSelect={() => handleSelectPlan(plan.planName)}
            selected={selectedPlan === plan.planName}
          />
        ))}
      </main>

      {/* Confirmation Message */}
      {selectedPlan && (
        <div className="mt-8 text-center text-green-600">
          <p className="text-xl font-semibold">
            You have selected the <span className="font-bold">{selectedPlan}</span> plan.
          </p>
          <p>Proceed to checkout to complete your subscription.</p>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights reserved.
      </footer>
    </div>
  );
};

export default SubscriptionPage;
