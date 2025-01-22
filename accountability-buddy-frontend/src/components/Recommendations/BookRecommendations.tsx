import React, { ReactNode, useEffect, useState } from 'react';
import './Recommendations.module.css'; // Scoped styling for recommendations

interface BookRecommendationsProps {
  [x: string]: any;
  recommendations?: BookRecommendation[];
}

interface BookRecommendation {
  id: string;
  title: string;
  author: string;
  description: string;
  link?: string;
}

const BookRecommendations: React.FC<BookRecommendationsProps> = ({
  recommendations,
}) => {
  const [books, setBooks] = useState<BookRecommendationsProps[]>([
    { recommendations: [] },
  ]);
  const [loading, setLoading] = useState<boolean>(!recommendations); // Skip loading if data is passed
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recommendations) return; // Skip fetching if data is provided

    const fetchBookRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/book-recommendations');
        if (!response.ok)
          throw new Error('Failed to fetch book recommendations.');

        const data: BookRecommendationsProps[] = await response.json();
        setBooks(data);
      } catch (err: any) {
        setError(
          err.message ||
            'An error occurred while fetching book recommendations.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookRecommendations();
  }, [recommendations]);

  if (loading) return <p>Loading book recommendations...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="book-recommendations">
      <h2>Book Recommendations</h2>
      {books.length > 0 ? (
        <ul className="book-list">
          {books.map((book) => (
            <li key={book.id} className="book-item">
              <h3>{book.title}</h3>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>{book.description}</p>
              {book.link && (
                <a href={book.link} target="_blank" rel="noopener noreferrer">
                  Learn More
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No book recommendations available at the moment.</p>
      )}
    </div>
  );
};

export default BookRecommendations;
