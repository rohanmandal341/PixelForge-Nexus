import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await api.post('/auth/login', { email, password });
      localStorage.setItem('email', email);
      navigate('/verify-otp');
    } catch (err) {
      console.error(err);
      alert('Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-gray-200 px-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl mb-6 font-bold text-center">Sign In</h1>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-md p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium transition"
        >
          Continue
        </button>

        {/* ✅ Forgot Password Link */}
        <p className="mt-4 text-center text-sm text-gray-400">
          <button
            onClick={() => navigate('/settings')}
            className="text-purple-400 hover:underline"
          >
            Forgot Password?
          </button>
        </p>
      </div>
    </div>
  );
}
