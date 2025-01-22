import React, { useState } from "react";
import "./SearchBar.css"; // CSS for styling the search bar

interface SearchBarProps {
  placeholder?: string; // Optional placeholder for the search input
  onSearch: (query: string) => void; // Callback to handle search action
  debounceTime?: number; // Optional debounce time for input
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
  debounceTime = 300,
}) => {
  const [query, setQuery] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Debounced search execution
    if (debounceTime > 0) {
      clearTimeout((handleInputChange as any).timer);
      (handleInputChange as any).timer = setTimeout(() => onSearch(value), debounceTime);
    }
  };

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        aria-label="Search"
        className="search-input"
      />
      <button
        onClick={handleSearch}
        aria-label="Search Button"
        className="search-button"
        disabled={!query.trim()} // Disable button when input is empty
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
