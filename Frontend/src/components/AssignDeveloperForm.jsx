
import { useEffect, useState } from 'react';
import api from '../api/api';

export default function AssignDeveloperForm() {
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [projectId, setProjectId] = useState('');
  const [devId, setDevId] = useState('');

  useEffect(() => {
    api.get('/projects/active').then(res => setProjects(res.data));
    api.get('/users/role/DEVELOPER').then(res => setDevelopers(res.data));
  }, []);

  const handleAssign = async () => {
    if (!projectId || !devId) {
      alert('Select project and developer.');
      return;
    }
    await api.post('/projects/assign-dev', { projectId, devId });
    alert('Developer assigned!');
  };

  return (
    <div className="border border-gray-700 p-4 mb-4">
      <h3 className="font-bold mb-2">Assign Developer to Project</h3>
      <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border bg-gray-900 text-gray-200 border-gray-700 p-2 mb-2 w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600" >
        <option value="">Select Project</option>
        {projects.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <select value={devId} onChange={e => setDevId(e.target.value)} className="border bg-gray-900 text-gray-200 border-gray-700 p-2 mb-2 w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600" >
        <option value="">Select Developer</option>
        {developers.map(d => (
          <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
        ))}
      </select>

      <button onClick={handleAssign} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition">Assign</button>
    </div>
  );
}
