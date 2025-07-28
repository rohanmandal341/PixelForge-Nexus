import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './auth/AuthContext';
import RequireAuth from './auth/RequireAuth';
import Login from './pages/Login';
import OtpVerify from './pages/OtpVerify';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import AccountSettings from './pages/AccountSettings';
import LandingPage from './pages/LandingPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
      
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<OtpVerify />} />
          <Route path="/dashboard" element={
            <RequireAuth><Dashboard /></RequireAuth>
          } />
          <Route path="/project/:id" element={
            <RequireAuth><ProjectDetails /></RequireAuth>
          } />
          <Route path="/settings" element={
            <RequireAuth><AccountSettings /></RequireAuth>
          } />
          <Route path="*" element={<div className="p-4">404: Not found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
