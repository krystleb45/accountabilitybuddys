"use client"; // Mark as Client Component

import React, { useState } from "react";

// Search Result Item component
const SearchResultItem = ({ result }: { result: string }) => (
  <div className="p-4 bg-white rounded-lg shadow-md mb-2">
    <p className="text-gray-800">{result}</p>
  </div>
);

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Mock search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Placeholder results based on query
    const mockResults = [
      "Search result 1",
      "Search result 2",
      "Search result 3",
      "Search result 4",
    ];

    setResults(query ? mockResults.filter((result) => result.includes(query)) : []);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Search</h1>
        <p className="text-gray-600">Welcome to the search page!</p>
      </header>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex justify-center mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-md p-3 border rounded-lg focus:outline-none focus:border-blue-600 focus:ring focus:ring-blue-200"
          placeholder="Enter your search query..."
          aria-label="Enter your search query"
        />
        <button
          type="submit"
          className="ml-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="Search"
        >
          Search
        </button>
      </form>

      {/* Search Results */}
      <main className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Search Results
        </h2>
        {submitted ? (
          results.length > 0 ? (
            results.map((result, index) => (
              <SearchResultItem key={index} result={result} />
            ))
          ) : (
            <p className="text-gray-500">No results found for "{query}".</p>
          )
        ) : (
          <p className="text-gray-500">Enter a query to search.</p>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Accountability Buddy. All rights reserved.
      </footer>
    </div>
  );
};

export default SearchPage;
