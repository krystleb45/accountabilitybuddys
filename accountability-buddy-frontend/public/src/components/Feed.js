import React, { useState, useEffect } from 'react';
import { getFeed, createPost, likePost, unlikePost, addComment } from '../services/api'; // Import API methods
import Post from './Post'; // Assuming there's a Post component to display each post
import LoadingSpinner from './LoadingSpinner'; // Optional: Add a loading spinner for fetching

const Feed = () => {
  const [posts, setPosts] = useState([]);      // Store feed posts
  const [loading, setLoading] = useState(true); // Loading state
  const [newPost, setNewPost] = useState('');   // State for new post content
  const [error, setError] = useState(null);     // State for handling errors

  // Fetch the initial feed
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await getFeed();       // Fetch posts from backend
        setPosts(response.data);                // Set posts in state
      } catch (err) {
        setError('Failed to load the feed');    // Handle error state
      } finally {
        setLoading(false);                      // Remove loading spinner
      }
    };

    fetchFeed();
  }, []);

  // Handle creating a new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (newPost.trim() === '' || newPost.length > 500) {
      setError('Post must be between 1 and 500 characters.');
      return;
    }
    setError(null);
    try {
      const response = await createPost({ message: newPost });
      setPosts([response.data, ...posts]);
      setNewPost('');
    } catch (err) {
      setError('Failed to create post');
    }
  };
  

  // Handle liking a post
  const handleLike = async (postId) => {
    try {
      await likePost(postId);                    // Like a post via API
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (err) {
      setError('Failed to like post');
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        // Load more posts here
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle unliking a post
  const handleUnlike = async (postId) => {
    try {
      await unlikePost(postId);                  // Unlike a post via API
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: post.likes - 1 } : post
        )
      );
    } catch (err) {
      setError('Failed to unlike post');
    }
  };

  // Handle adding a comment
  const handleAddComment = async (postId, comment) => {
    try {
      const response = await addComment(postId, { text: comment });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, response.data] }
            : post
        )
      );
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  if (loading) return (
    <div className="feed-skeleton">
      <div className="skeleton-post"></div>
      <div className="skeleton-post"></div>
      <div className="skeleton-post"></div>
    </div>
  );
  
  return (
    <div className="feed">
      <h2>Social Feed</h2>

      {/* New post form */}
      <form onSubmit={handleCreatePost}>
      <textarea
  aria-label="Post content"
  value={newPost}
  onChange={(e) => setNewPost(e.target.value)}
  placeholder="What's on your mind?"
/>
<button type="submit" aria-label="Post to feed">Post</button>

      </form>

      {/* Error message */}
      {error && <p style={{ color: 'red' }} aria-live="assertive">{error}</p>}


      {/* Display posts */}
      {posts.length === 0 ? (
        <p>No posts to show</p>
      ) : (
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            onLike={() => handleLike(post._id)}
            onUnlike={() => handleUnlike(post._id)}
            onAddComment={(comment) => handleAddComment(post._id, comment)}
          />
        ))
      )}
    </div>
  );
};

export default Feed;
