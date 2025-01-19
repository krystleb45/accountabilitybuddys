import React from 'react';
import Post from './Post';

interface FeedProps {
  posts: {
    id: string;
    title: string;
    content: string;
    author: string;
    timestamp: string;
  }[];
}

const Feed: React.FC<FeedProps> = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <p className="feed-empty">No posts available</p>;
  }

  return (
    <div className="feed-container">
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          title={post.title}
          content={post.content}
          author={post.author}
          timestamp={post.timestamp}
        />
      ))}
    </div>
  );
};

export default Feed;
