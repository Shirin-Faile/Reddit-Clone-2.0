'use client';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Posts from './pages/Posts.tsx';
import CreatePost from './pages/CreatePost.tsx';
import PostDetail from './pages/PostDetail.tsx';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/posts/create" element={<CreatePost />} />
      </Routes>
  );
}

export default App;


