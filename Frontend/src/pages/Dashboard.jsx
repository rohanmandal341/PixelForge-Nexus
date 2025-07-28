import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import api from '../api/api';
import ProjectForm from '../components/ProjectForm';
import ProjectCard from '../components/ProjectCard';
import UserForm from '../components/UserForm';
import DocumentUpload from '../components/DocumentUpload';
import AssignDeveloperForm from '../components/AssignDeveloperForm';
import { useNavigate } from 'react-router-dom'; // ✅ import this

export default function Dashboard() {
  const { role } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // ✅ init navigate

  const fetchProjects = async () => {
    const res = await api.get('/projects/active');
    setProjects(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  useEffect(() => {
    fetchProjects();
    if (role === 'ADMIN') {
      fetchUsers();
    }
  }, [role]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-gray-200 px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Pixel Dashboard ({role})</h1>
          {/* ✅ Settings Button */}
          <button
            onClick={() => navigate('/settings')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition"
          >
            Account Settings
          </button>
        </div>

        {/* ✅ Role Banner */}
        {role === 'ADMIN' && (
          <div className="mb-6 rounded-lg bg-green-900/20 p-4">
            <p className="text-green-400 font-semibold">
              Admin Mode: Manage all projects, users, and documents.
            </p>
          </div>
        )}
        {role === 'PROJECT_LEAD' && (
          <div className="mb-6 rounded-lg bg-blue-900/20 p-4">
            <p className="text-blue-400 font-semibold">
              Lead Mode: Manage your projects, assign developers, upload documents.
            </p>
          </div>
        )}
        {role === 'DEVELOPER' && (
          <div className="mb-6 rounded-lg bg-yellow-900/20 p-4">
            <p className="text-yellow-400 font-semibold">
              Developer Mode: View your assigned projects.
            </p>
          </div>
        )}

        {/* ✅ Admin Sections */}
        {role === 'ADMIN' && (
          <>
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Add New Project</h2>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <ProjectForm onAdd={fetchProjects} />
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Register New User</h2>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <UserForm onCreated={fetchUsers} />
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Upload Document</h2>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <DocumentUpload />
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">All Active Projects</h2>
              {projects.length === 0 ? (
                <p className="text-gray-400">No active projects.</p>
              ) : (
                projects.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    onDelete={fetchProjects}
                    onMarkComplete={fetchProjects}
                  />
                ))
              )}
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">All Users</h2>
              {users.length === 0 ? (
                <p className="text-gray-400">No users found.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg shadow-md">
                  <table className="min-w-full text-sm bg-gray-800 text-gray-200">
                    <thead className="bg-gray-700 text-gray-300">
                      <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr
                          key={u.id}
                          className="border-b border-gray-700 hover:bg-gray-700/50"
                        >
                          <td className="px-4 py-2">{u.id}</td>
                          <td className="px-4 py-2">{u.name}</td>
                          <td className="px-4 py-2">{u.email}</td>
                          <td className="px-4 py-2">{u.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {/* ✅ Project Lead */}
        {role === 'PROJECT_LEAD' && (
          <>
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Upload Document</h2>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <DocumentUpload />
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Assign Developers</h2>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <AssignDeveloperForm />
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Your Projects</h2>
              {projects.length === 0 ? (
                <p className="text-gray-400">No active projects.</p>
              ) : (
                projects.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    onMarkComplete={fetchProjects}
                  />
                ))
              )}
            </section>
          </>
        )}

        {/* ✅ Developer */}
        {role === 'DEVELOPER' && (
          <>
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Assigned Projects</h2>
              {projects.length === 0 ? (
                <p className="text-gray-400">No assigned projects.</p>
              ) : (
                projects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
