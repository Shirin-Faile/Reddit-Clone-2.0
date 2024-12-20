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
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    alert('You have logged out.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-white">Community Posts</h1>
        <div>
          <button
            onClick={handleCreatePost}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold px-4 py-2 rounded-md shadow hover:opacity-90 mr-2"
          >
            Create Post
          </button>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-400 to-pink-500 text-white font-semibold px-4 py-2 rounded-md shadow hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </div>
      {errorMessage && (
        <div className="text-red-500 bg-red-100 p-4 rounded-lg mb-4">
          {errorMessage}
        </div>
      )}
      <div className="grid gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white p-6 rounded-lg shadow-lg transition-transform transform"
          >
            <Link
              to={`/posts/${post._id}`}
              className="text-2xl font-bold text-blue-600 hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-gray-700 mt-2">{post.content}</p>
            <p className="text-sm text-gray-500 mt-4">By: {post.user.username}</p>
            {post.user._id === loggedInUserId && (
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => handleEditPost(post._id)}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-md shadow hover:opacity-90"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-md shadow hover:opacity-90"
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
