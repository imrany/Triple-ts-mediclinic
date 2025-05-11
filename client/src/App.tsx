import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './context';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import SignIn from './pages/SignIn';
import LandingPage from './pages/LandingPage';
import ForgotPassword from './pages/ForgotPassword';
import Layout from './layout/Layout';
import { Toaster } from "@/components/ui/sonner";
import Account from './pages/Account';
import Laboratory from './pages/Laboratory';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import Settings from './pages/Settings';
import CalendarPage from './pages/Calendar';
import Pharmacy from './pages/Pharmacy';
import { AuthData, Staff } from './types';
import { Loader2 } from 'lucide-react';

function App() {
  const [orgName, setOrgName] = useState<string>('Triple Ts Mediclinic');
  const [staff, setStaff] = useState<Staff | null>(null);
  // const api_url = `http://localhost:8000`; 
  const api_url = `https://api.triple-ts-mediclinic.com`; 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [isNewDoctorModalOpen, setIsNewDoctorModalOpen] = useState(false);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isNewMedicationModalOpen, setIsNewMedicationModalOpen] = useState(false);
  const [isNewTestModalOpen, setIsNewTestModalOpen] = useState(false);
  const authData: AuthData = JSON.parse(localStorage.getItem('authData') || '{}');

  async function fetchData() {
    try {
      const response = await fetch(`${api_url}/api/staff/${authData.user_id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authData.token}`
        }
      });
      const parseRes = await response.json();
      if (parseRes.error) {
        console.log(parseRes.error);
        // localStorage.removeItem('authData');
      } else {
        setIsAuthenticated(true);
        const data: Staff = {
          id: parseRes.id || '',
          firstName: parseRes.first_name || '',
          lastName: parseRes.last_name || '',
          email: parseRes.email || '',
          phoneNumber: parseRes.phone_number || '',
          role: parseRes.role || '',
          department: parseRes.department || '',
          address: parseRes.address || '',
          status: parseRes.status,
          photo: parseRes.photo || '',
          dateOfBirth: parseRes.date_of_birth || '',
          nationalId: parseRes.national_id || '',
          biography: parseRes.biography || '',
          specialty: parseRes.specialty || '',
          startDate: parseRes.start_date || '',
          endDate: parseRes.end_date || '',
          createdAt: parseRes.created_at || '',
          updatedAt: parseRes.updated_at || '',
        };
        setStaff(data)
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      let errorMessage= error.message==="Failed to fetch"?"No internet":error.message;
      console.log(errorMessage);
      console.log(error);
    }
  }

  useEffect(()=>{
    if (!authData?.token || !authData?.user_id || !authData?.email) {
      console.error("No authentication data found.");
      setIsLoading(false);
    }else{
      fetchData()
    }
  },[])
  return (
    <>
      {isLoading?(
        <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-white ">
          <Loader2 className="animate-spin w-12 h-12 text-pink-500" />
          <p className="mt-4 text-lg font-medium">Get ready!</p>
        </div>
      ):(
        <AppContext.Provider value={{ 
          orgName, setOrgName, api_url, isNewAppointmentModalOpen, setIsNewAppointmentModalOpen, 
          isNewDoctorModalOpen, setIsNewDoctorModalOpen, isNewPatientModalOpen, setIsNewPatientModalOpen, 
          isNewMedicationModalOpen, setIsNewMedicationModalOpen, isNewTestModalOpen, setIsNewTestModalOpen, 
          staff, authData
        }}>
          <Router>
            <Routes>
              {/* Unprotected Routes */}
              <Route path="/" element={!isAuthenticated?<LandingPage />:<Navigate to="/dashboard" />} />
              <Route path="/signin" element={!isAuthenticated?<SignIn />: <Navigate to="/dashboard" />} />
              <Route path="/forgot-password" element={!isAuthenticated?<ForgotPassword />: <Navigate to="/dashboard" />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={isAuthenticated?<Layout />:<Navigate to="/signin" />}>
                <Route index element={<Dashboard />} />
                <Route path="account" element={<Account />} />
                <Route path="patients" element={<Patients />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="doctors" element={<Doctors />} />
                <Route path="pharmacy" element={<Pharmacy />} />
                <Route path="laboratory" element={<Laboratory />} />
                <Route path="settings" element={<Settings />} />
                <Route path="calendar" element={<CalendarPage />} />
              </Route>

              {/* Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AppContext.Provider>
      )}
    </>
  );
}

export default App;
