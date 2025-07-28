import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../auth/AuthContext';
import { jwtDecode } from 'jwt-decode';

export default function OtpVerify() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleVerify = async () => {
    try {
      const email = localStorage.getItem('email');
      const res = await api.post('/auth/verify-otp', { email, otp });

      const decoded = jwtDecode(res.data.token);

      localStorage.setItem('token', res.data.token);

      login(res.data.token, decoded.role);

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('OTP verification failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-gray-200 px-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl mb-6 font-bold text-center">Verify OTP</h1>
        <input
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-md p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          onClick={handleVerify}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium transition"
        >
          Verify & Continue
        </button>
      </div>
    </div>
  );
}
