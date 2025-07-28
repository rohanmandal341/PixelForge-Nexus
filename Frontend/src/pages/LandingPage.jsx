import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-gray-200">
      <Navbar />
      <main className="px-8 py-20 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">PixelForge Nexus</h1>
        <p className="mb-10 text-gray-300 text-lg md:text-xl">
          A secure project management hub for Admins, Project Leads, and Developers.
        </p>
        <Link
          to="/login"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md text-lg font-medium transition"
        >
          Login &rarr;
        </Link>

        <section className="mt-20 grid md:grid-cols-3 gap-8 text-left">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Admin</h3>
            <p className="text-gray-300">
              Full control to add or remove projects, register users, manage documents, and monitor the entire workspace.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Project Lead</h3>
            <p className="text-gray-300">
              Assign developers, manage your own projects, upload assets and ensure delivery with deadlines.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Developer</h3>
            <p className="text-gray-300">
              Securely view assigned projects and access important documents. Stay focused, stay productive.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
