import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Post {
  _id: string; 
  title: string; 
  content: string;
  user: {
    username: string;
  };
 }

 function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/posts', {
          headers: {
            Authorization: token? `Bearer ${token}` : '',
          },
        });
        setPosts(response.data);
      } catch (error: any) {
        if (error.response) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('An error occured. Please try again.');
        }
      }
    };

    fetchPosts();
  }, []);

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
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-700">{post.content}</p>
            <p className="text-sm text-gray-500 mt-2">By: {post.user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
