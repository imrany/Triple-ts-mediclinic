import NewPatient from '@/components/Modals/NewPatient';
import { useAppContext } from '@/context';
import useIsMobile from '@/hooks/useIsMobile';
import { fromSnakeCaseToCamelCase } from '@/lib/utils';
import { MedicalRecord, Patient } from '@/types';
import { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64dff'];

export default function PatientsPage() {
  const { api_url, setIsNewPatientModalOpen, departments, authData, staff } = useAppContext()
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [patientsPerPage] = useState(5);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    newThisMonth: 0,
    appointmentsToday: 0
  });
  const isMobile = useIsMobile();

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api_url}/api/patients`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authData?.token}`
        }
      });
      const parseRes = await response.json()
      if (parseRes.error) {
        console.log(parseRes)
        toast(`Something went wrong!`, {
          description: `${parseRes.error}`,
          action: {
            label: "Retry",
            onClick: () => fetchPatients()
          },
        });
      } else {
        const data = fromSnakeCaseToCamelCase(parseRes) as Patient[];
        console.log(data);
        setPatients(data);
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const newThisMonth = data.filter((p) => {
          const createdAt = new Date(p.createdAt);
          return createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear;
        }).length;

         // Calculate today's appointments
        const today = new Date();
        const appointmentsToday = medicalRecords.filter((record) => {
          const recordDate = new Date(record.date);
          return (
            recordDate.getFullYear() === today.getFullYear() &&
            recordDate.getMonth() === today.getMonth() &&
            recordDate.getDate() === today.getDate()
          );
        }).length;

        const Stats = {
          totalPatients: data.length,
          activePatients: data.filter((p) => p.status === 'Active').length,
          newThisMonth,
          appointmentsToday
        }
        setStats(Stats)

          // Fetch recent medical records for stats (if not already fetched)
          // This is just an example of how you might set medicalRecords if you had them in the response
          // If you want to set medicalRecords from the patients API, you need to map/transform accordingly.
          // Here, we just leave it as is, since fetchMedicalRecords() will update it.
          setMedicalRecords([]); // No-op here, handled by fetchMedicalRecords
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch patients data');
      setLoading(false);
      console.error('Error fetching patients:', err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Calculate patient statistics for charts
  const calculatePatientsByGender = () => {
    const genderMap = patients.reduce((acc, patient) => {
      acc[patient.gender] = (acc[patient.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(genderMap).map(gender => ({
      name: gender,
      value: genderMap[gender]
    }));
  };

  const calculatePatientsByAge = () => {
    const ageGroups = {
      '0-18': 0,
      '19-35': 0,
      '36-50': 0,
      '51-65': 0,
      '65+': 0
    };

    patients.forEach(patient => {
      const birthDate = new Date(patient.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age <= 18) ageGroups['0-18']++;
      else if (age <= 35) ageGroups['19-35']++;
      else if (age <= 50) ageGroups['36-50']++;
      else if (age <= 65) ageGroups['51-65']++;
      else ageGroups['65+']++;
    });

    return Object.keys(ageGroups).map(group => ({
      name: group,
      value: ageGroups[group as keyof typeof ageGroups]
    }));
  };

  const calculatePatientsByDepartment = () => {
    const deptMap = patients.reduce((acc, patient) => {
      acc[patient.department] = (acc[patient.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(deptMap).map(dept => ({
      name: dept,
      count: deptMap[dept]
    }));
  };

  // Filter patients based on search and status
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      patient.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || patient.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toISOString().split('T')[0];
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Handle patient view, edit, and delete actions
  const handleViewPatient = (patientId: string) => {
    console.log(`View patient details for ID: ${patientId}`);
    // Implement navigation to patient details page
  };

  const handleEditPatient = (patientId: string) => {
    console.log(`Edit patient with ID: ${patientId}`);
    // Implement edit functionality
  };

  const handleDeletePatient = (patientId: string) => {
    console.log(`Delete patient with ID: ${patientId}`);
    // Implement delete functionality with confirmation
    if (confirm("Are you sure you want to delete this patient?")) {
      // Replace axios.delete with fetch
      fetch(`${api_url}/api/patients/${patientId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${authData?.token}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to delete patient");
          }
          return response.json();
        })
        .then(() => {
          // Remove patient from state
          setPatients(patients.filter(patient => patient.id !== patientId));
          toast("Patient deleted successfully", {
            description: "The patient record has been removed.",
          });
        })
        .catch((err) => {
          console.error("Error deleting patient:", err);
          toast("Failed to delete patient", {
            description: "Please try again.",
            action: {
              label: "Retry",
              onClick: () => handleDeletePatient(patientId)
            },
          });
        });
    }
  };

  const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) => (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 font-medium">{title}</h3>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <div className="mb-2">
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className={`font-[family-name:var(--font-geist-sans)] ${isMobile ? "py-6" : "pb-6"}`}>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        <p className="text-sm text-gray-500">View and manage all patient information.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients || patients.length}
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
          color="bg-pink-500"
        />
        <StatCard
          title="Active Patients"
          value={stats.activePatients || patients.filter(p => p.status === 'active').length}
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="bg-green-500"
        />
        <StatCard
          title="New This Month"
          value={stats.newThisMonth || 0}
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>}
          color="bg-purple-500"
        />
        <StatCard
          title="Appointments Today"
          value={stats.appointmentsToday || 0}
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
          color="bg-yellow-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Gender Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-6">Gender Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={calculatePatientsByGender()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {calculatePatientsByGender().map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} patients`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-6">Age Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={calculatePatientsByAge()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {calculatePatientsByAge().map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} patients`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-6">Patients by Department</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={calculatePatientsByDepartment()}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8">
                  {calculatePatientsByDepartment().map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4 md:mb-0">Patients List</h2>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-full md:w-64"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-2.5">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            {/* Filter Dropdown */}
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Add Patient Button */}
            <button
              onClick={() => setIsNewPatientModalOpen(true)}
              className="bg-pink-500 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-pink-600 transition"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Patient
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Age</th>
                <th className="pb-3 font-medium">Gender</th>
                <th className="pb-3 font-medium">Contact</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Last Updated</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.length > 0 ? (
                currentPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-2">{`${patient.firstName} ${patient.lastName}`}</td>
                    <td className="py-3 px-2">{calculateAge(patient.dateOfBirth)}</td>
                    <td className="py-3 px-2">{patient.gender}</td>
                    <td className="py-3 px-2">{patient.phoneNumber}</td>
                    <td className="py-3 px-2">{patient.department}</td>
                    <td className="py-3 px-2">{formatDate(patient.updatedAt)}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPatient(patient.id)}
                          className="p-1 text-pink-600 hover:text-pink-800"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </button>
                        {(staff?.role.toLowerCase()=="admin"||staff?.role==="Nurse"||staff?.role==="Receptionist")&&(<button
                          onClick={() => handleEditPatient(patient.id)}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                          </svg>
                        </button>)}
                        {(staff?.role.toLowerCase()=="admin"||staff?.role==="Nurse"||staff?.role==="Receptionist")&&(<button
                          onClick={() => handleDeletePatient(patient.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-500">
                    {loading ? "Loading patients..." : "No patients found matching your criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-1">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg ${currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 rounded-lg ${currentPage === i + 1
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg ${currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Medical Records */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-800">Recent Medical Records</h2>
          <button className="text-sm text-pink-600 hover:text-pink-800">View All Records</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Diagnosis</th>
                <th className="pb-3 font-medium">Doctor</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {medicalRecords.length > 0 ? (
                medicalRecords.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-2">{record.patientName}</td>
                    <td className="py-3 px-2">{formatDate(record.date)}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${record.type === 'Emergency'
                        ? 'bg-red-100 text-red-800'
                        : record.type === 'Checkup'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-pink-100 text-pink-800'
                        }`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="py-3 px-2">{record.diagnosis}</td>
                    <td className="py-3 px-2">{record.doctor}</td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => console.log(`View record details for ID: ${record.id}`)}
                        className="text-pink-600 hover:text-pink-800"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    No recent medical records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewPatient departments={departments} actions={{ fetchPatients }} />
    </div>
  );
}