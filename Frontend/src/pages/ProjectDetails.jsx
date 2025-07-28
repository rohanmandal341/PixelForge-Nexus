// src/pages/ProjectDetails.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // You probably have a dedicated GET by id later — here’s a placeholder:
      const allProjects = await api.get('/projects/active');
      const found = allProjects.data.find(p => p.id === parseInt(id));
      setProject(found);

      const res = await api.get(`/documents/project/${id}`);
      setDocs(res.data);
    };

    fetchData();
  }, [id]);

  if (!project) return <div className="p-4">Loading project...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
      <p className="mb-2">{project.description}</p>
      <p className="text-gray-500 mb-4">Deadline: {project.deadline}</p>

      <h2 className="text-xl font-semibold mb-2">Documents</h2>
      {docs.length === 0 ? (
        <p>No documents uploaded.</p>
      ) : (
        docs.map(doc => (
          <div key={doc.id} className="border p-2 mb-2">
            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {doc.name}
            </a>
            <p className="text-sm text-gray-500">Uploaded at: {doc.uploadedAt}</p>
          </div>
        ))
      )}
    </div>
  );
}
