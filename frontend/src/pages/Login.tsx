import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Use the API base URL from the environment variables
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                username,
                password,
            });

            alert(response.data.message);

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);

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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 text-white p-4">
          <div className="bg-white text-gray-900 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-pink-600">
              Welcome Back!
            </h2>
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-md text-sm">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium text-sm sm:text-base mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-pink-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium text-sm sm:text-base mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-pink-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md font-semibold shadow-md hover:opacity-90 focus:outline-none focus:ring focus:ring-pink-300"
              >
                Login
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <span
                onClick={() => navigate('/register')}
                className="text-pink-600 font-semibold cursor-pointer hover:underline"
              >
                Register here
              </span>
            </p>
          </div>
        </div>
      );
}

export default Login;
