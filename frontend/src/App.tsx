'use client';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import EditPost from './pages/EditPost';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/posts/create" element={<CreatePost />} />
        <Route path="/posts/:id/edit" element={<EditPost />} />
      </Routes>
  );
}

export default App;


