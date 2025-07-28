// src/components/UserForm.jsx
import { useState } from 'react';
import api from '../api/api';

export default function UserForm({ onCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('DEVELOPER');

  const handleSubmit = async () => {
    await api.post('/auth/register', { name, email, password, role });
    onCreated && onCreated();
    setName('');
    setEmail('');
    setPassword('');
    setRole('DEVELOPER');
    alert('User created!');
  };

  return (
    <div className="border border-gray-700  p-4 mb-4">
      <h3 className="font-bold mb-2">Register User</h3>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border bg-gray-900 text-gray-200 border-gray-700 p-2 mb-2 w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600" />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border bg-gray-900 text-gray-200 border-gray-700 p-2 mb-2 w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600" />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border bg-gray-900 text-gray-200 border-gray-700 p-2 mb-2 w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600" />
      <select value={role} onChange={(e) => setRole(e.target.value)}  className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600">
        <option value="ADMIN">Admin</option>
        <option value="PROJECT_LEAD">Project Lead</option>
        <option value="DEVELOPER">Developer</option>
      </select>
      <button onClick={handleSubmit}  className="w-full bg-green-600 mt-4 hover:bg-purple-700 text-white py-3 rounded-md font-semibold transition" >Create</button>
    </div>
  );
}
