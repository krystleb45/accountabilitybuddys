import React, { useState, useEffect } from "react";
import {
  getFeed,
  createPost,
  likePost,
  unlikePost,
  addComment,
} from "./services/apiService";
import Post from "../src/components/Post"; // Assuming there’s a Post component to display each post
import LoadingSpinner from "./LoadingSpinner"; // Loading spinner for fetching

// Define interfaces for posts and comments
interface Comment {
  id: string;
  text: string;
}

interface PostType {
  id: string;
  content: string;
  author: string;
  likes: number;
  comments: Comment[]; // Ensure comments are always an array
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newPost, setNewPost] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Fetch the initial feed
  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      setError(null);

      try {
        const feedData = await getFeed();

        // Transform feed data to ensure comments are always an array
        const transformedPosts = feedData.map((feedPost) => ({
          ...feedPost,
          comments: Array.isArray(feedPost.comments)
            ? feedPost.comments
            : [], // Default to empty array if comments is a number
        }));
        setPosts(transformedPosts);
      } catch (err) {
        console.error("Error fetching feed:", err);
        setError("Failed to load the feed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  // Handle new post creation
  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const createdPost = await createPost(newPost);

      // Ensure the created post has the correct structure
      const newPostWithComments: PostType = {
        ...createdPost,
        comments: [],
      };

      setPosts((prevPosts) => [newPostWithComments, ...prevPosts]);
      setNewPost("");
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again.");
    }
  };

  // Handle liking a post
  const handleLikePost = async (postId: string) => {
    try {
      await likePost(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
      setError("Failed to like the post. Please try again.");
    }
  };

  // Handle unliking a post
  const handleUnlikePost = async (postId: string) => {
    try {
      await unlikePost(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes - 1 } : post
        )
      );
    } catch (err) {
      console.error("Error unliking post:", err);
      setError("Failed to unlike the post. Please try again.");
    }
  };

  const handleAddComment = async (postId: string, commentText: string) => {
    try {
      const newComment = await addComment(postId, commentText);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment. Please try again.");
    }
  };

  return (
    <div className="feed">
      <h2>Feed</h2>
      <div className="create-post">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          aria-label="Create a new post"
          rows={3}
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />
        <button
          onClick={handleCreatePost}
          disabled={!newPost.trim()}
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Post
        </button>
      </div>

      {/* Display loading spinner or error message */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="error-message" role="alert">
          {error}
        </p>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onLike={() => handleLikePost(post.id)}
            onUnlike={() => handleUnlikePost(post.id)}
            onAddComment={(commentText) => handleAddComment(post.id, commentText)}
          />
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default Feed;
