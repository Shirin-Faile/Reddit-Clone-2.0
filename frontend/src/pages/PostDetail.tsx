import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Comment {
  _id: string;
  content: string;
  user: {
    username: string;
  };
  createdAt: string;
}

interface Post {
  title: string;
  content: string;
  user: {
    username: string;
  };
}

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch post and comments
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const postResponse = await axios.get(`http://localhost:5000/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const commentsResponse = await axios.get(`http://localhost:5000/api/comments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPost(postResponse.data);
        setComments(commentsResponse.data);
      } catch (error: any) {
        setErrorMessage('Failed to fetch post or comments. Please try again.');
      }
    };

    fetchPostAndComments();
  }, [id]);

  // Handle comment submission
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setErrorMessage('Comment cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/comments/${id}`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments((prev) => [...prev, response.data.comment]);
      setNewComment('');
    } catch (error: any) {
      setErrorMessage('Failed to add comment. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {post && (
        <>
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <p className="text-gray-700 mt-4">{post.content}</p>
          <p className="text-sm text-gray-500 mt-2">By: {post.user.username}</p>
        </>
      )}

      <h2 className="text-xl font-bold mt-8">Comments</h2>
      {errorMessage && (
        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
      )}
      <div className="mt-4">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-white p-4 rounded shadow mb-4">
            <p className="text-gray-700">{comment.content}</p>
            <p className="text-sm text-gray-500 mt-2">By: {comment.user.username}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddComment} className="mt-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
          placeholder="Write your comment here..."
          rows={3}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Comment
        </button>
      </form>
    </div>
  );
}

export default PostDetail;
