// Post.tsx
import React from "react";

interface PostProps {
  post: {
    id: string;
    content: string;
    likes: number;
    comments: { id: string; text: string }[];
  };
  onLike: () => void;
  onUnlike: () => void;
  onAddComment: (commentText: string) => void;
}

const Post: React.FC<PostProps> = ({ post, onLike, onUnlike, onAddComment }) => {
  const [commentText, setCommentText] = React.useState<string>("");

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  return (
    <div className="post" role="article">
      <p>{post.content}</p>
      <p>Likes: {post.likes}</p>
      <button onClick={onLike}>Like</button>
      <button onClick={onUnlike}>Unlike</button>
      <div className="comments">
        <h4>Comments</h4>
        {post.comments.map((comment) => (
          <p key={comment.id}>{comment.text}</p>
        ))}
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={handleAddComment}>Comment</button>
      </div>
    </div>
  );
};

export default Post;
