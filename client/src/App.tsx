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
import Laboratory from './pages/Laboratory';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import Settings from './pages/Settings';
import CalendarPage from './pages/Calendar';
import Pharmacy from './pages/Pharmacy';
import { AuthData, Patient, Staff } from './types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fromSnakeCaseToCamelCase } from './lib/utils';

function App() {
  const [orgName, setOrgName] = useState<string>('Triple Ts Mediclinic');
  const [staff, setStaff] = useState<Staff | null>(null);
  const api_url = 'http://localhost:8000';
  // const api_url ='https://api.triple-ts-mediclinic.com';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [isNewStaffModalOpen, setIsNewStaffModalOpen] = useState(false);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isNewMedicationModalOpen, setIsNewMedicationModalOpen] = useState(false);
  const [isNewTestModalOpen, setIsNewTestModalOpen] = useState(false);
  const [doctors, setDoctors] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [patients, setPatients] = useState<Patient[]>([])

  // Safely parse auth data
  const getAuthData = (): AuthData | null => {
    try {
      const storedAuthData = localStorage.getItem('authData');
      return storedAuthData ? JSON.parse(storedAuthData) : null;
    } catch (error) {
      console.error('Error parsing auth data:', error);
      return null;
    }
  };

  const authData = getAuthData();



  // Fetch user details
  const fetchUserData = async (token: string, userId: string) => {
    try {
      const response = await fetch(`${api_url}/api/staff/${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const parseRes = await response.json();

      if (parseRes.error) {
        throw new Error(parseRes.error);
      }

      const userData = fromSnakeCaseToCamelCase(parseRes)
      setStaff(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      toast.error('Failed to load user data', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      localStorage.removeItem('authData');
      setIsAuthenticated(false);
    }
  };

  // Fetch staff and departments
  const fetchStaffAndDepartments = async () => {
    try {
      const response = await fetch(`${api_url}/api/staff`);

      const parseRes: any = await response.json();

      if (parseRes.error) {
        throw new globalThis.Error(parseRes.error);
      }

      const medicalStaff = fromSnakeCaseToCamelCase(parseRes.filter((member: Staff) =>
        member.role?.toLowerCase().includes('doctor')
      ));

      const allDepartments = fromSnakeCaseToCamelCase(parseRes
        .map((member: Staff) => member.department)
        .filter((department: string | undefined, index: number, self: (string | undefined)[]) =>
          department && self.indexOf(department) === index
        ));

      setDepartments(allDepartments as string[]);
      setDoctors(medicalStaff);
    } catch (error) {
      console.error('Failed to fetch staff:', error instanceof Error ? error.message : error);
      toast.error('Failed to load staff data', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  const fetchPatients = async (token: string) => {
    try {
      const response = await fetch(`${api_url}/api/patients`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const parseRes = await response.json()
      if (parseRes.error) {
        console.log(parseRes)
        toast(`Something went wrong!`, {
          description: `${parseRes.error}`,
          action: {
            label: "Retry",
            onClick: () => fetchPatients(token)
          },
        });
      } else {
        const data = fromSnakeCaseToCamelCase(parseRes) as Patient[];
        console.log(data);
        setPatients(data);
      }
    } catch (error: any) {
      toast(`Something went wrong!`, {
        description: `${error.message}`,
        action: {
          label: "Retry",
          onClick: () => fetchPatients(token)
        },
      });
      console.error('Error fetching patients:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for valid authentication data
        if (!authData?.token || !authData?.user_id || !authData?.email) {
          setIsLoading(false);
          return;
        }

        // Fetch user data and staff information
        await Promise.all([
          fetchUserData(authData.token, authData.user_id),
          fetchStaffAndDepartments(),
          fetchPatients(authData.token)
        ]);
      } catch (error) {
        console.error('Initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <Loader2 className="animate-spin w-12 h-12 text-pink-500" />
        <p className="mt-4 text-lg font-medium">Getting ready!</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      orgName,
      setOrgName,
      api_url,
      isNewAppointmentModalOpen,
      setIsNewAppointmentModalOpen,
      isNewStaffModalOpen,
      setIsNewStaffModalOpen,
      isNewPatientModalOpen,
      setIsNewPatientModalOpen,
      isNewMedicationModalOpen,
      setIsNewMedicationModalOpen,
      isNewTestModalOpen,
      setIsNewTestModalOpen,
      staff,
      authData,
      doctors,
      departments,
      patients
    }}>
      <Router>
        <Routes>
          {/* Unprotected Routes */}
          <Route
            path="/"
            element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/signin"
            element={!isAuthenticated ? <SignIn /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/forgot-password"
            element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Layout /> : <Navigate to="/signin" />}
          >
            <Route index element={<Dashboard />} />
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
  );
}

export default App;