import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Use the API base URL from the environment variables
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setErrorMessage('Both title and content are required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/posts`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data.message);
      navigate('/');
    } catch (error: any) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-10 text-gray-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 text-purple-600">
          Create a New Post
        </h1>
        {errorMessage && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded-lg text-center">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleCreatePost} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm sm:text-base font-medium mb-2 text-gray-600"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-400 focus:outline-none"
              placeholder="Enter your post title"
              required
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-sm sm:text-base font-medium mb-2 text-gray-600"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border-2 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-400 focus:outline-none"
              placeholder="Write your post content here..."
              rows={6}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
          >
            Submit
          </button>
        </form>
        
        <button
          onClick={() => navigate('/')}
          className="mt-4 w-full py-3 bg-gray-200 text-gray-800 rounded-xl shadow hover:bg-gray-300 transition-transform transform hover:scale-105"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
