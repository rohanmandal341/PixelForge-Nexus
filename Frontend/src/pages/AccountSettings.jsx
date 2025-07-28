import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function AccountSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const navigate = useNavigate();

  const changePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert('❗ Please enter both current and new passwords.');
      return;
    }

    try {
      await api.put('/auth/change-password', null, {
        params: { currentPassword, newPassword },
      });
      alert('✅ Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error(error);
      alert('❌ Failed to update password. Please try again.');
    }
  };

  const toggleMfa = async () => {
    try {
      await api.put('/auth/toggle-mfa', null, {
        params: { enable: !mfaEnabled },
      });
      setMfaEnabled(!mfaEnabled);
      alert(`✅ MFA has been ${!mfaEnabled ? 'enabled' : 'disabled'}!`);
    } catch (error) {
      console.error(error);
      alert('❌ Failed to toggle MFA. Please try again.');
    }
  };

  const goBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-gray-200 px-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-6 font-bold text-center">Account Settings</h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <input
            placeholder="Current Password"
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <input
            placeholder="New Password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-md p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            onClick={changePassword}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium transition"
          >
            Change Password
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Multi-Factor Authentication (MFA)</h2>
          <button
            onClick={toggleMfa}
            className={`w-full ${
              mfaEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            } text-white py-3 rounded-md font-medium transition`}
          >
            {mfaEnabled ? 'Disable MFA' : 'Enable MFA'}
          </button>
        </div>

        <div>
          <button
            onClick={goBack}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md font-medium transition"
          >
            🔙 Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
