import React from 'react';

interface PostProps {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
}

const Post: React.FC<PostProps> = ({
  id,
  title,
  content,
  author,
  timestamp,
}) => {
  return (
    <div className="post-container" id={`post-${id}`}>
      <h2 className="post-title">{title}</h2>
      <p className="post-content">{content}</p>
      <div className="post-footer">
        <span className="post-author">By: {author}</span>
        <span className="post-timestamp">
          {new Date(timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default Post;
