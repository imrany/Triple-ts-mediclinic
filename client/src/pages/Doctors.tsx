import { useAppContext } from '@/context';
import { departments, doctors } from '@/data';
import useIsMobile from '@/hooks/useIsMobile';
import { Doctor } from '@/types';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Mock data for the doctors page
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64dff'];

// Create departmental statistics based on doctor data
const getDepartmentStats = (doctorsList:Doctor[]) => {
  const deptCounts: Record<string, number> = {};
  
  doctorsList.forEach(doctor => {
    if (!deptCounts[doctor.department]) {
      deptCounts[doctor.department] = 0;
    }
    deptCounts[doctor.department]++;
  });
  
  return Object.keys(deptCounts).map(dept => ({
    name: dept,
    count: deptCounts[dept]
  }));
};

// Create availability statistics
const getAvailabilityStats = (doctorsList:Doctor[]) => {
  const available = doctorsList.filter(doctor => doctor.available).length;
  const unavailable = doctorsList.length - available;
  
  return [
    { name: 'Available', value: available },
    { name: 'Unavailable', value: unavailable }
  ];
};

// Create experience statistics
const getExperienceStats = (doctorsList:Doctor[]) => {
  const experienceLevels = {
    'Junior (0-5)': 0,
    'Mid-level (6-10)': 0,
    'Senior (11-15)': 0,
    'Expert (16+)': 0
  };
  
  doctorsList.forEach(doctor => {
    if (doctor.experience <= 5) {
      experienceLevels['Junior (0-5)']++;
    } else if (doctor.experience <= 10) {
      experienceLevels['Mid-level (6-10)']++;
    } else if (doctor.experience <= 15) {
      experienceLevels['Senior (11-15)']++;
    } else {
      experienceLevels['Expert (16+)']++;
    }
  });
  
  return Object.keys(experienceLevels).map(level => ({
    name: level,
    count: experienceLevels[level as keyof typeof experienceLevels]
  }));
};

export default function DoctorsPage() {
  const { setIsNewDoctorModalOpen } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const isMobile=useIsMobile()
  
  // Add experience property to doctors data
  const doctorsWithExperience = doctors.map(doctor => ({
    id: doctor.id,
    name:doctor.name,
    specialization:doctor.specialization,
    email:doctor.email,
    phone:doctor.phone,
    department:doctor.department,
    image:doctor.image,
    bio:doctor.name,
    experience: Math.floor(Math.random() * 20) + 1, // Random experience between 1-20 years
    available: Math.random() > 0.3, // 70% doctors are available
    patients: Math.floor(Math.random() * 100) + 20, // Random number of patients
    rating: (Math.random() * 1.5 + 3.5) // Random rating between 3.5-5.0
  }));

  // Filter and sort doctors
  useEffect(() => {
    let result = [...doctorsWithExperience];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply department filter
    if (selectedDepartment !== 'All') {
      result = result.filter(doctor => doctor.department === selectedDepartment);
    }
    
    // Apply availability filter
    if (availabilityFilter !== 'All') {
      const isAvailable = availabilityFilter === 'Available';
      result = result.filter(doctor => doctor.available === isAvailable);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'department') {
        return sortOrder === 'asc'
          ? a.department.localeCompare(b.department)
          : b.department.localeCompare(a.department);
      } else if (sortBy === 'patients') {
        return sortOrder === 'asc'
          ? a.patients - b.patients
          : b.patients - a.patients;
      } else if (sortBy === 'rating') {
        return sortOrder === 'asc'
          ? a.rating - b.rating
          : b.rating - a.rating;
      } else if (sortBy === 'experience') {
        return sortOrder === 'asc'
          ? a.experience - b.experience
          : b.experience - a.experience;
      }
      return 0;
    });
    
    setFilteredDoctors(result);
  }, [searchTerm, selectedDepartment, availabilityFilter, sortBy, sortOrder]);

  // Calculate statistics
  const departmentStats = getDepartmentStats(doctorsWithExperience);
  const availabilityStats = getAvailabilityStats(doctorsWithExperience);
  const experienceStats = getExperienceStats(doctorsWithExperience);

  const handleSort = (field:string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  // Components
  const StatCard = ({ title, value, description, icon, color }:{ title:string, value:number, description:string, icon:any, color:string }) => (
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
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
  
  const DoctorCard = ({ doctor }:{ doctor:Doctor }) => (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col h-full">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{doctor.name}</h3>
          <p className="text-sm text-gray-500">{doctor.department}</p>
          <div className="flex items-center mt-1">
            <span className={`inline-block w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-red-500'} mr-1`}></span>
            <span className="text-xs text-gray-500">{doctor.available ? 'Available' : 'Unavailable'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span className="text-sm font-medium">{doctor.rating}</span>
        </div>
      </div>
      <div className="mt-4 text-sm space-y-2 flex-grow">
        <div className="flex justify-between">
          <span className="text-gray-500">Email:</span>
          <span className="text-gray-800">{doctor.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Experience:</span>
          <span className="text-gray-800">{doctor.experience} years</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Patients:</span>
          <span className="text-gray-800">{doctor.patients}</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
        <button className="text-sm px-3 py-1 bg-pink-50 text-pink-600 rounded-md hover:bg-pink-100">Schedule</button>
        <button className="text-sm px-3 py-1 bg-green-50 text-green-600 rounded-md hover:bg-green-100">Message</button>
        <button className="text-sm px-3 py-1 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100">View</button>
      </div>
    </div>
  );

  return (
    <div className={`font-[family-name:var(--font-geist-sans)] ${isMobile?"py-6":"pb-6"}`}>
      {/* Page Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Doctors</h1>
          <p className="text-sm text-gray-500">Manage your medical center's doctors and specialists</p>
        </div>
        <button 
          onClick={() => setIsNewDoctorModalOpen(true)}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> 
          {!isMobile&&(<p>Add New Doctor</p>)}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Doctors" 
          value={doctors.length} 
          description="All registered specialists" 
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
          color="bg-pink-500"
        />
        <StatCard 
          title="Available Doctors" 
          value={availabilityStats[0].value} 
          description="Currently on duty" 
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="bg-green-500"
        />
        <StatCard 
          title="Departments" 
          value={departments.length} 
          description="Active medical specialties" 
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>}
          color="bg-purple-500"
        />
        <StatCard 
          title="Senior Specialists" 
          value={experienceStats[2].count + experienceStats[3].count} 
          description="11+ years of experience" 
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>}
          color="bg-yellow-500"
        />
      </div>

      {/* Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Department Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-6">Department Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {departmentStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} doctors`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Experience Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-6">Experience Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={experienceStats}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 30,
                }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8">
                  {experienceStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Availability Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-6">Availability Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={availabilityStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip formatter={(value) => [`${value} doctors`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="col-span-1 lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                placeholder="Search doctors by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              id="department"
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <select
              id="availability"
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredDoctors.length}</span> doctors
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <button 
            onClick={() => handleSort('name')}
            className={`text-sm px-3 py-1 rounded-md ${sortBy === 'name' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => handleSort('department')}
            className={`text-sm px-3 py-1 rounded-md ${sortBy === 'department' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Department {sortBy === 'department' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => handleSort('experience')}
            className={`text-sm px-3 py-1 rounded-md ${sortBy === 'experience' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Experience {sortBy === 'experience' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => handleSort('rating')}
            className={`text-sm px-3 py-1 rounded-md ${sortBy === 'rating' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {filteredDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
      
      {/* Pagination */}
      {filteredDoctors.length > 0 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center">
            <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 mr-1">
              Previous
            </button>
            <button className="px-3 py-1 rounded-md bg-pink-500 text-white mr-1">1</button>
            <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 mr-1">2</button>
            <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 mr-1">3</button>
            <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200">
              Next
            </button>
          </nav>
        </div>
      )}
      
      {/* Empty state */}
      {filteredDoctors.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 flex flex-col items-center justify-center text-center">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No doctors found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedDepartment('All');
              setAvailabilityFilter('All');
            }} 
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}