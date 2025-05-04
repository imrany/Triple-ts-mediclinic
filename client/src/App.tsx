import { JSX, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './context';
import Home from './pages/Desktop/Home';
import Dashboard from './pages/Desktop/Dashboard';
import useIsMobile from './hooks/useIsMobile';
import MobileLayout from './layouts/MobileLayout';
import DesktopLayout from './layouts/DesktopLayout';
import NotFound from './pages/NotFound';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem('authToken'); // Replace with your auth logic
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const isMobile = useIsMobile();
  const [state, setState] = useState<string>('default value');

  return (
    <AppContext.Provider value={{ state, setState }}>
      <Router>
        <Routes>
          {/* Unprotected Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/welcome" element={<Home />} />
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
