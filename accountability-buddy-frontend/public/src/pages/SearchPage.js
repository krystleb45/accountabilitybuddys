import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="spinner" style={{ textAlign: 'center', margin: '20px' }}>
    <div className="spinner-circle" style={{ width: '30px', height: '30px', border: '4px solid #007bff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <p>Loading...</p>
  </div>
);

const SearchPage = () => {
  const [query, setQuery] = useState(''); // Search query state
  const [results, setResults] = useState([]); // Search results state
  const [loading, setLoading] = useState(false); // Loading state for search operation
  const [error, setError] = useState(''); // Error state

  // Debounce function to delay search execution
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Search function to call the backend API
  const search = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]); // Clear results if query is empty
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      setResults(res.data.results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of the search function
  const debouncedSearch = useCallback(debounce(search, 500), []);

  // Handle query input change
  const handleChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="search-page" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Search</h1>

      <div className="search-input-container" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Enter search query..."
          aria-label="Search"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      {loading && <LoadingSpinner />}

      {error && (
        <div className="error-message" role="alert" style={{ color: 'red', margin: '20px 0' }}>
          {error}
        </div>
      )}

      {!loading && results.length > 0 && (
        <ul className="search-results" style={{ listStyleType: 'none', padding: '0' }}>
          {results.map((result, index) => (
            <li key={index} className="search-result-item" style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
              <strong>{result.title}</strong>
              <p>{result.description}</p>
            </li>
          ))}
        </ul>
      )}

      {!loading && results.length === 0 && query && (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No results found for "{query}".</p>
      )}
    </div>
  );
};

export default SearchPage;
