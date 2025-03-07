import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface Comment {
  _id: string;
  content: string;
  user: {
    username: string;
    _id: string;
  };
  post: string;
}

interface Post {
  title: string;
  content: string;
  user: {
    username: string;
    _id: string;
  };
}

function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const loggedInUserId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postResponse = await axios.get(`${BASE_URL}/api/posts/${id}`);
        setPost(postResponse.data);

        const commentsResponse = await axios.get(`${BASE_URL}/api/comments/${id}`);
        setComments(commentsResponse.data);
        console.log('Fetched comments:', commentsResponse.data); // Debugging
      } catch (error: any) {
        console.error('Error fetching post and comments:', error);
        setErrorMessage('Failed to load post or comments.');
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${BASE_URL}/api/comments/${id}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newCommentData = response.data.comment;

      console.log('New comment from backend:', newCommentData);

      if (newCommentData.user && typeof newCommentData.user === 'string') {
        newCommentData.user = {
          _id: newCommentData.user,
          username: localStorage.getItem('username') || 'Unknown User',
        };
      }

      console.log('Updated comment after processing:', newCommentData);

      setComments([newCommentData, ...comments]);
      setNewComment('');
    } catch (error: any) {
      console.error('Error adding comment:', error);
      setErrorMessage('Failed to add comment.');
    }
  };

  const handleEditComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/api/comments/${commentId}`,
        { content: editingComment?.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(
        comments.map((comment) =>
          comment._id === commentId ? { ...comment, content: response.data.comment.content } : comment
        )
      );
      setEditingComment(null);
    } catch (error: any) {
      console.error('Error editing comment:', error);
      alert('Failed to edit comment.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((comment) => comment._id !== commentId));
      alert('Comment deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-6">
      {post ? (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold text-pink-600">{post.title}</h1>
          <p className="text-gray-700 mt-4">{post.content}</p>
          <p className="text-sm text-gray-500 mt-2">
            By: {post.user?.username || 'Unknown User'}
          </p>

          <h2 className="text-3xl font-bold text-purple-600 mt-8">Comments</h2>
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-gray-100 p-4 rounded-lg shadow-md mt-4 transform transition hover:scale-105"
            >
              {editingComment && editingComment._id === comment._id ? (
                <div>
                  <textarea
                    value={editingComment.content}
                    onChange={(e) =>
                      setEditingComment({ ...editingComment, content: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded mb-2"
                  />
                  <button
                    onClick={() => handleEditComment(comment._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingComment(null)}
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <p>{comment.content}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    By: {comment.user?.username || 'Unknown User'}
                  </p>
                  {comment.user._id === loggedInUserId && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => setEditingComment(comment)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          <div className="mt-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              className="w-full px-4 py-2 border-2 border-pink-300 rounded-xl focus:ring-4 focus:ring-pink-400 focus:outline-none"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl shadow-md hover:scale-105 transform"
            >
              Add Comment
            </button>
          </div>
        </div>
      ) : (
        <p className="text-white text-center text-lg">Loading post...</p>
      )}
      {errorMessage && (
        <div className="mt-4 text-red-500 bg-red-100 p-4 rounded-lg text-center">
          {errorMessage}
        </div>
      )}

      <button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 transition-transform transform hover:scale-105 mx-auto block text-center"
      >
        Back to Home
      </button>
    </div>
  );
}

export default PostDetail;
