import React from 'react';
import './Pagination.css'; // CSS for styling the pagination

interface PaginationProps {
  currentPage: number; // The current active page
  totalPages: number; // The total number of pages
  onPageChange: (page: number) => void; // Callback for changing the page
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null; // Do not render if there's only one page

  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination-button"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        &laquo; Prev
      </button>
      <ul className="pagination-list">
        {getPageNumbers().map((page) => (
          <li key={page}>
            <button
              className={`pagination-item ${
                page === currentPage ? 'active' : ''
              }`}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
      <button
        className="pagination-button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next &raquo;
      </button>
    </nav>
  );
};

export default Pagination;
