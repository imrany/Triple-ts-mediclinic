import { JSX, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './context';
import Dashboard from './pages/Desktop/Dashboard';
import useIsMobile from './hooks/useIsMobile';
import MobileLayout from './layouts/MobileLayout';
import DesktopLayout from './layouts/DesktopLayout';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import LandingPage from './pages/LandingPage';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem('authToken'); // Replace with your auth logic
  return isAuthenticated ? children : <Navigate to="/signin" />;
}

function UnProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem('authToken'); // Replace with your auth logic
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

function App() {
  const isMobile = useIsMobile();
  const [state, setState] = useState<string>('default value');

  return (
    <AppContext.Provider value={{ state, setState }}>
      <Router>
        <Routes>
          {/* Unprotected Routes */}
          <Route path="/" element={<UnProtectedRoute><LandingPage /></UnProtectedRoute>} />
          <Route path="/signin" element={<UnProtectedRoute><SignIn /></UnProtectedRoute>} />
          <Route path="/signup" element={<UnProtectedRoute><SignUp /></UnProtectedRoute>} />
          {isMobile ? (
            <Route path="/dashboard" element={<ProtectedRoute><MobileLayout /></ProtectedRoute>}>
              {/* Protected Routes */}
              <Route index element={<Dashboard />} />
            </Route>
          ) : (
            <Route path="/dashboard" element={<ProtectedRoute><DesktopLayout /></ProtectedRoute>}>
              {/* Protected Routes */}
              <Route index element={<Dashboard />} />
            </Route>
          )}
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
