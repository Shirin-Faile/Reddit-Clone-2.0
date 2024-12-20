import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
  const [errorMessage, setErrorMessage] = useState('');
  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postResponse = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setPost(postResponse.data);

        const commentsResponse = await axios.get(`http://localhost:5000/api/comments/${id}`);
        setComments(commentsResponse.data);
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
        `http://localhost:5000/api/comments/${id}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([response.data.comment, ...comments]);
      setNewComment('');
    } catch (error: any) {
      console.error('Error adding comment:', error);
      setErrorMessage('Failed to add comment.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
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
    <div className="p-6 bg-gray-100 min-h-screen">
      {post ? (
        <div>
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <p className="text-gray-700">{post.content}</p>
          <p className="text-sm text-gray-500 mt-2">By: {post.user.username}</p>

          <h2 className="text-xl font-bold mt-6">Comments</h2>
          {comments.map((comment) => (
            <div key={comment._id} className="bg-white p-4 rounded shadow mt-4">
              <p>{comment.content}</p>
              <p className="text-sm text-gray-500 mt-2">By: {comment.user.username}</p>
              {(comment.user._id === loggedInUserId || post.user._id === loggedInUserId) && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded mt-2 hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          <div className="mt-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              className="w-full px-3 py-2 border rounded mb-2"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Comment
            </button>
          </div>
        </div>
      ) : (
        <p>Loading post...</p>
      )}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}

export default PostDetail;

