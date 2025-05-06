import { JSX, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './context';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';
import Layout from './layout/Layout';
import { Toaster } from "@/components/ui/sonner"
import Account from './pages/Account';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import Settings from './pages/Settings';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem('authData'); // Replace with your auth logic
  return isAuthenticated ? children : <Navigate to="/signin" />;
}

function UnProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem('authData'); // Replace with your auth logic
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

function App() {
  const [state, setState] = useState<string>('default value');
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [isNewDoctorModalOpen, setIsNewDoctorModalOpen] = useState(false);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const api_url=`http://localhost:8000`

  return (
    <AppContext.Provider value={{ state, setState, api_url, isNewAppointmentModalOpen, setIsNewAppointmentModalOpen, isNewDoctorModalOpen, setIsNewDoctorModalOpen, isNewPatientModalOpen, setIsNewPatientModalOpen }}>
      <Router>
        <Routes>
          {/* Unprotected Routes */}
          <Route path="/" element={<UnProtectedRoute><LandingPage /></UnProtectedRoute>} />
          <Route path="/signin" element={<UnProtectedRoute><SignIn /></UnProtectedRoute>} />
          <Route path="/signup" element={<UnProtectedRoute><SignUp /></UnProtectedRoute>} />
          <Route path="/forgot-password" element={<UnProtectedRoute><ForgotPassword /></UnProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            {/* Protected Routes */}
            <Route index element={<Dashboard />} />
            <Route path="account" element={<Account />} />
            <Route path="patients" element={<Patients />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Router>
      <Toaster />
    </AppContext.Provider>
  );
}

export default App;
