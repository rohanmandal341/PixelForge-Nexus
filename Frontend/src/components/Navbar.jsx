// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white px-4 py-2 flex justify-between">
      <Link to="/dashboard" className="font-bold">Pixelforge</Link>
      <div className="space-x-4">
        <Link to="/settings">Account</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
