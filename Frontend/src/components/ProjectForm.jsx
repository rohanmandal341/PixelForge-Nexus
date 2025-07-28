import { useState, useEffect } from 'react';
import api from '../api/api';

export default function ProjectForm({ onAdd }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [deadline, setDeadline] = useState('');
  const [leadId, setLeadId] = useState('');
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    api.get('/users/role/PROJECT_LEAD').then(res => setLeads(res.data));
  }, []);

  const handleSubmit = async () => {
    if (!name || !desc || !deadline || !leadId) {
      alert('Please fill in all fields!');
      return;
    }

    await api.post('/projects/add', {
      name,
      description: desc,
      deadline,
      leadId,
    });

    onAdd();
    setName('');
    setDesc('');
    setDeadline('');
    setLeadId('');
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Add Project</h3>

      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />

      <textarea
        placeholder="Description"
        value={desc}
        onChange={e => setDesc(e.target.value)}
        rows="3"
        className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />

      <input
        type="date"
        value={deadline}
        onChange={e => setDeadline(e.target.value)}
        className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />

      <select
        value={leadId}
        onChange={e => setLeadId(e.target.value)}
        className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
      >
        <option value="">Select Lead</option>
        {leads.map(lead => (
          <option key={lead.id} value={lead.id}>
            {lead.name} ({lead.email})
          </option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-semibold transition"
      >
        Add Project
      </button>
    </div>
  );
}
