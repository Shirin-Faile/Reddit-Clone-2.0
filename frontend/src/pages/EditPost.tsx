import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface Post {
  title: string;
  content: string;
  user: {
    username: string;
    _id: string;
  };
}

function EditPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(response.data);
      } catch (error: any) {
        console.error('Error fetching post details:', error);
        setErrorMessage('Failed to load post details.');
      }
    };

    fetchPostDetails();
  }, [id]);

  const handleEditPost = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation: Check if title or content is empty
    if (!post?.title || !post?.content) {
      setErrorMessage('Both title and content are required.');
      return;
    }

    try {
      setErrorMessage(''); // Clear previous error messages
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/posts/${id}`,
        post,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Post updated successfully!');
      navigate('/');
    } catch (error: any) {
      console.error('Error updating post:', error);
      setErrorMessage('Failed to update post.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-500 flex items-center justify-center">
      {post ? (
        <form
          onSubmit={handleEditPost}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg text-gray-800"
        >
          <h1 className="text-3xl font-bold text-purple-600 text-center mb-6">Edit Post</h1>
          {errorMessage && (
            <p className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-center">
              {errorMessage}
            </p>
          )}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-600">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-400 focus:outline-none"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium mb-2 text-gray-600">
              Content
            </label>
            <textarea
              id="content"
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              className="w-full px-4 py-2 border-2 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-400 focus:outline-none"
              rows={6}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
          >
            Update Post
          </button>
        </form>
      ) : (
        <p className="text-white text-lg text-center">{errorMessage || 'Loading post...'}</p>
      )}
    </div>
  );
}

export default EditPost;
