// src/components/ProjectCard.jsx

import { useState } from 'react';
import api from '../api/api';
import { useAuth } from '../auth/AuthContext';

export default function ProjectCard({ project, onDelete, onMarkComplete }) {
  const { role } = useAuth();
  const [docs, setDocs] = useState([]);
  const [showDocs, setShowDocs] = useState(false);

  const handleDelete = async () => {
    await api.delete(`/projects/${project.id}`);
    onDelete && onDelete();
  };

  const handleComplete = async () => {
    await api.put(`/projects/mark-complete/${project.id}`);
    onMarkComplete && onMarkComplete();
  };

  const handleShowDocs = async () => {
    if (showDocs) {
      // Hide if already showing
      setShowDocs(false);
    } else {
      try {
        const res = await api.get(`/documents/project/${project.id}`);
        console.log('Fetched docs:', res.data);
        setDocs(res.data);
        setShowDocs(true);
      } catch (err) {
        console.error('Error fetching documents:', err);
        alert('Failed to load documents.');
      }
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800 p-6 mb-5 shadow-md hover:shadow-lg transition">
      {/* Accent bar */}
      <div className="absolute left-0 top-0 h-full w-1 bg-purple-600"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          📌 {project.name}
        </h2>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            project.status === 'COMPLETED'
              ? 'bg-green-600 text-white'
              : 'bg-yellow-500 text-black'
          }`}
        >
          {project.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-300 mb-4 text-sm leading-relaxed">
        {project.description}
      </p>

      {/* Meta */}
      <div className="space-y-1 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          📅 <span className="text-gray-500 font-medium">Deadline:</span>{' '}
          {project.deadline}
        </div>
        {project.leadName && (
          <div className="flex items-center gap-2 text-gray-400">
            👤 <span className="text-gray-500 font-medium">Lead:</span>{' '}
            {project.leadName}
          </div>
        )}
        {project.developerNames && project.developerNames.length > 0 && (
          <div className="flex items-start gap-2 text-gray-400">
            👥 <span className="text-gray-500 font-medium">Developers:</span>{' '}
            {project.developerNames.join(', ')}
          </div>
        )}
      </div>

      {/* Docs toggle */}
      <button
        onClick={handleShowDocs}
        className="text-sm text-purple-400 underline mb-2"
      >
        {showDocs ? 'Hide Documents' : 'Show Documents'}
      </button>

    {showDocs && (
  <div className="mt-3 border border-gray-700 rounded-md bg-gray-900 p-4">
    <h4 className="text-sm text-purple-400 font-semibold mb-2 flex items-center gap-2">
      📑 Project Documents
    </h4>
    {docs.length === 0 ? (
      <p className="text-gray-400 text-sm italic">No documents uploaded yet.</p>
    ) : (
      <ul className="space-y-2">
        {docs.map(doc => (
          <li
            key={doc.id}
            className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition p-2 rounded-md"
          >
            <span className="flex items-center gap-2 text-gray-200 text-sm">
              📄 {doc.name}
            </span>
            <a
              href={`http://localhost:1010/${doc.fileUrl}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-purple-400 hover:underline"
            >
              View
            </a>
          </li>
        ))}
      </ul>
    )}
  </div>
)}


      {/* Actions: Only for Admin */}
      {role === 'ADMIN' && (
        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={handleDelete}
            className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs uppercase tracking-wide transition"
          >
            Delete
          </button>
          <button
            onClick={handleComplete}
            className="px-4 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-xs uppercase tracking-wide transition"
          >
            Mark Complete
          </button>
        </div>
      )}
    </div>
  );
}
