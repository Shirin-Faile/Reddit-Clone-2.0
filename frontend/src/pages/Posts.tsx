import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

interface Post {
  _id: string;
  title: string;
  content: string;
  user: {
    username: string;
    _id: string;
  };
}

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data);
      } catch (error: any) {
        setErrorMessage(
          error.response?.data?.message || 'An error occurred. Please try again.'
        );
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter((post) => post._id !== postId));
      alert('Post deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post.');
    }
  };

  const handleEditPost = (postId: string) => {
    navigate(`/posts/${postId}/edit`);
  };

  const handleCreatePost = () => {
    navigate('/posts/create');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <button
          onClick={handleCreatePost}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Post
        </button>
      </div>
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-4 rounded shadow">
            <Link
              to={`/posts/${post._id}`}
              className="text-xl font-bold text-blue-600 hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-gray-700">{post.content}</p>
            <p className="text-sm text-gray-500 mt-2">By: {post.user.username}</p>
            {post.user._id === loggedInUserId && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEditPost(post._id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Posts;

