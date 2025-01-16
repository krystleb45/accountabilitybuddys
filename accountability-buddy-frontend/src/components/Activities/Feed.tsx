import React, { useState, useEffect } from "react";
import {
  getFeed,
  createPost,
  likePost,
  unlikePost,
  addComment,
} from "../services/apiService"; // Correct path to apiService
import Post from "../../src/components/Post"; // Assuming there is a Post component to display each post
import LoadingSpinner from "./LoadingSpinner"; // Optional: Add a loading spinner for fetching

interface PostType {
  id: string;
  content: string;
  likes: number;
  comments: { id: string; text: string }[];
  // Add other fields as necessary
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newPost, setNewPost] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Fetch the initial feed
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const posts: PostType[] = await getFeed(); // Assuming getFeed returns PostType[]
        setPosts(posts);
      } catch (err) {
        setError("Failed to load the feed");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return; // Prevent empty posts

    try {
      const post: PostType = await createPost(newPost); // Assuming createPost returns a PostType
      setPosts([post, ...posts]);
      setNewPost("");
    } catch (err) {
      setError("Failed to create the post");
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await likePost(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (err) {
      console.error("Error liking the post:", err);
    }
  };

  const handleUnlikePost = async (postId: string) => {
    try {
      await unlikePost(postId);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes - 1 } : post
        )
      );
    } catch (err) {
      console.error("Error unliking the post:", err);
    }
  };

  const handleAddComment = async (postId: string, commentText: string) => {
    try {
      const comment = await addComment(postId, commentText); // Assuming addComment returns the new comment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, comment] }
            : post
        )
      );
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <div className="feed">
      <h2>Community Feed</h2>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div>
          <input
            type="text"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
          />
          <button onClick={handleCreatePost}>Post</button>
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onLike={() => handleLikePost(post.id)}
              onUnlike={() => handleUnlikePost(post.id)}
              onAddComment={(text) => handleAddComment(post.id, text)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
