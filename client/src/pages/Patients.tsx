import { useState } from 'react';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for patients page
const patientsData = [
  { id: 1, name: 'Emma Wilson', age: 42, gender: 'Female', contact: '254712345670', address: '123 Main St, Anytown', lastVisit: '2025-04-30', doctor: 'Dr. Johnson', department: 'Cardiology', status: 'Active' },
  { id: 2, name: 'Michael Brown', age: 35, gender: 'Male', contact: '254723456780', address: '456 Oak Ave, Somewhere', lastVisit: '2025-05-02', doctor: 'Dr. Martinez', department: 'Neurology', status: 'Active' },
  { id: 3, name: 'Sophia Davis', age: 8, gender: 'Female', contact: '254734567890', address: '789 Pine Rd, Nowhere', lastVisit: '2025-04-28', doctor: 'Dr. Thompson', department: 'Pediatrics', status: 'Active' },
  { id: 4, name: 'James Miller', age: 65, gender: 'Male', contact: '254745678900', address: '101 Cedar Ln, Elsewhere', lastVisit: '2025-05-01', doctor: 'Dr. Garcia', department: 'Orthopedics', status: 'Inactive' },
  { id: 5, name: 'Olivia Taylor', age: 29, gender: 'Female', contact: '254756789010', address: '202 Birch Blvd, Anywhere', lastVisit: '2025-04-25', doctor: 'Dr. Wilson', department: 'Dermatology', status: 'Active' },
  { id: 6, name: 'Lucas Moore', age: 52, gender: 'Male', contact: '254767890120', address: '303 Maple Dr, Someplace', lastVisit: '2025-05-03', doctor: 'Dr. Lee', department: 'Cardiology', status: 'Active' },
  { id: 7, name: 'Charlotte Adams', age: 44, gender: 'Female', contact: '254778901230', address: '404 Elm St, Othertown', lastVisit: '2025-04-29', doctor: 'Dr. Clark', department: 'Neurology', status: 'Active' },
  { id: 8, name: 'Ethan Wright', age: 71, gender: 'Male', contact: '254789012340', address: '505 Willow Ct, Newcity', lastVisit: '2025-05-04', doctor: 'Dr. Rodriguez', department: 'Orthopedics', status: 'Inactive' },
];

const patientsByGender = [
  { name: 'Male', value: 4 },
  { name: 'Female', value: 4 }
];

const patientsByAge = [
  { name: '0-18', value: 1 },
  { name: '19-35', value: 2 },
  { name: '36-50', value: 2 },
  { name: '51-65', value: 1 },
  { name: '65+', value: 2 }
];

const patientsByDepartment = [
  { name: 'Cardiology', count: 2 },
  { name: 'Neurology', count: 2 },
  { name: 'Pediatrics', count: 1 },
  { name: 'Orthopedics', count: 2 },
  { name: 'Dermatology', count: 1 }
];

const recentMedicalRecords = [
  { id: 1, patient: 'Emma Wilson', date: '2025-04-30', type: 'Checkup', diagnosis: 'Hypertension', doctor: 'Dr. Johnson' },
  { id: 2, patient: 'Michael Brown', date: '2025-05-02', type: 'Consultation', diagnosis: 'Migraine', doctor: 'Dr. Martinez' },
  { id: 3, patient: 'Lucas Moore', date: '2025-05-03', type: 'Emergency', diagnosis: 'Chest Pain', doctor: 'Dr. Lee' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64dff'];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [patientsPerPage] = useState(5);
  
  // Filter patients based on search and status
  const filteredPatients = patientsData.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         patient.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || patient.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  
  // Calculate pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  
  // Change page
  const paginate = (pageNumber:number) => setCurrentPage(pageNumber);
  
  const StatCard = ({ title, value, icon, color }:{ title:string, value:number, icon:any, color:string }) => (
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
  
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patients Management</h1>
        <p className="text-sm text-gray-500">View and manage all patient information.</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Patients" 
          value={patientsData.length}
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
          color="bg-pink-500"
        />
        <StatCard 
          title="Active Patients" 
          value={patientsData.filter(p => p.status === 'Active').length}
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="bg-green-500"
        />
        <StatCard 
          title="New This Month" 
          value={24}
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>}
          color="bg-purple-500"
        />
        <StatCard 
          title="Appointments Today" 
          value={16}
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
                  data={patientsByGender}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {patientsByGender.map((_, index) => (
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
                  data={patientsByAge}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {patientsByAge.map((_, index) => (
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
                data={patientsByDepartment}
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
                  {patientsByDepartment.map((_, index) => (
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
            <button className="bg-pink-500 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-pink-600 transition">
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
                <th className="pb-3 font-medium">Last Visit</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((patient) => (
                <tr key={patient.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-2">{patient.name}</td>
                  <td className="py-3 px-2">{patient.age}</td>
                  <td className="py-3 px-2">{patient.gender}</td>
                  <td className="py-3 px-2">{patient.contact}</td>
                  <td className="py-3 px-2">{patient.department}</td>
                  <td className="py-3 px-2">{patient.lastVisit}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex space-x-2">
                      <button className="p-1 text-pink-600 hover:text-pink-800">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-800">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-800">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 1
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
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === i + 1
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
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages
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
              {recentMedicalRecords.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-2">{record.patient}</td>
                  <td className="py-3 px-2">{record.date}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      record.type === 'Emergency' 
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
                    <button className="text-pink-600 hover:text-pink-800">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Patient Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition">
            <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <span className="text-sm font-medium">Send Message</span>
          </button>
        </div>
      </div>
    </div>
  );
}