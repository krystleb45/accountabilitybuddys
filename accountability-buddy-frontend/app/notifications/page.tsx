"use client"; // Mark as Client Component

import React, { useState } from "react";
import Link from "next/link"; // Import Link from Next.js

// Notification Item Component
const NotificationItem = ({
  notification,
}: {
  notification: { message: string; date: string; read: boolean };
}) => (
  <div
    className={`p-4 rounded-lg shadow-md mb-2 transition-colors ${
      notification.read ? "bg-gray-200" : "bg-white"
    }`}
  >
    <div className="flex justify-between items-center">
      <p className="text-gray-700">{notification.message}</p>
      <span className="text-sm text-gray-500">{notification.date}</span>
    </div>
  </div>
);

const NotificationsPage: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [notifications] = useState([
    { message: "You have a meeting at 3 PM.", date: "Today", read: false },
    {
      message: "Goal 'Launch marketing campaign' is due tomorrow.",
      date: "Yesterday",
      read: false,
    },
    {
      message: "You completed 5 tasks this week. Great job!",
      date: "2 days ago",
      read: true,
    },
    {
      message: "Your password was changed successfully.",
      date: "Last week",
      read: true,
    },
  ]);

  // Filter notifications based on the selected filter
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true; // Show all notifications
  });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-green-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
        <nav className="flex gap-4">
          <Link href="/dashboard">
            <span className="text-blue-600 font-semibold hover:underline">Dashboard</span>
          </Link>
          <Link href="/profile">
            <span className="text-blue-600 font-semibold hover:underline">Profile</span>
          </Link>
        </nav>
      </header>

      {/* Filter Options */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Filter Notifications</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`py-2 px-4 rounded-lg transition-colors ${
              filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            aria-label="Show all notifications"
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`py-2 px-4 rounded-lg transition-colors ${
              filter === "unread" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            aria-label="Show unread notifications"
          >
            Unread
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`py-2 px-4 rounded-lg transition-colors ${
              filter === "read" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
            aria-label="Show read notifications"
          >
            Read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <main className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Notifications</h2>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <NotificationItem key={index} notification={notification} />
          ))
        ) : (
          <p className="text-gray-500">No notifications to show.</p>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights reserved.
      </footer>
    </div>
  );
};

export default NotificationsPage;
