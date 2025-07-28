// src/components/DocumentUpload.jsx
import { useState } from 'react';
import api from '../api/api';

export default function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [projectId, setProjectId] = useState('');
  const [userId, setUserId] = useState('');

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file.');
      return;
    }
    if (!projectId) {
      alert('Please enter a project ID.');
      return;
    }
    if (!userId) {
      alert('Please enter your user ID.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    formData.append('userId', userId);

    // ✅ Debug: see exactly what you are sending
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      await api.post('/documents/upload', formData);
      alert('Document uploaded!');

      // ✅ Reset inputs
      setFile(null);
      setProjectId('');
      setUserId('');

      // ✅ Also reset file input DOM element
      document.getElementById('fileInput').value = null;
    } catch (err) {
      console.error(err);
      alert('Upload failed. Check console for details.');
    }
  };

  return (
    <div className="border border-gray-700 p-4 mb-4">
      <h3 className="font-bold mb-2">Upload Document</h3>

      <label className="block mb-2">
        <span className="block mb-1 font-medium">Select File:</span>
        <input
          id="fileInput"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
className="border bg-gray-900 text-gray-200 border-gray-700 p-2 mb-2 w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"        />
      </label>

      <input
        placeholder="Project ID"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
className="border bg-gray-900 text-gray-200 border-gray-700 p-2 mb-2 w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"      />

      <input
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
       className="border bg-gray-900 text-gray-200 border-gray-700 p-2 mb-2 w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />

      <button
        onClick={handleUpload}
        className="bg-purple-600 rounded mt-2text-white px-4 py-2 w-full"
      >
        Upload Document
      </button>
    </div>
  );
}
