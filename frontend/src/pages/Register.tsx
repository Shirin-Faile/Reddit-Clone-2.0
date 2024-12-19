import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
      });
      alert(response.data.message);
      navigate('/login');
    } catch (error: any) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error ocurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        {errorMessage && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Username
            </label>
            <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Password
            </label>
            <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter your password"
            required
             />
          </div>
          <button type="submit" className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
