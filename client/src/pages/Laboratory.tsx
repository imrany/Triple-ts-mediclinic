import { useState } from 'react';
import { useAppContext } from '@/context';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from 'recharts';
import NewTestModal from '@/components/Modals/NewTestModal';

// Mock data for laboratory tests
const pendingTests = [
  { id: 1, patient: 'Emma Wilson', testName: 'Complete Blood Count', requestedBy: 'Dr. Johnson', requestDate: '2025-05-06', priority: 'Urgent' },
  { id: 2, patient: 'Michael Brown', testName: 'Lipid Panel', requestedBy: 'Dr. Martinez', requestDate: '2025-05-06', priority: 'Normal' },
  { id: 3, patient: 'Sophia Davis', testName: 'Urinalysis', requestedBy: 'Dr. Thompson', requestDate: '2025-05-06', priority: 'Normal' },
  { id: 4, patient: 'James Miller', testName: 'Liver Function Test', requestedBy: 'Dr. Garcia', requestDate: '2025-05-05', priority: 'Urgent' },
  { id: 5, patient: 'Olivia Taylor', testName: 'Thyroid Function Test', requestedBy: 'Dr. Wilson', requestDate: '2025-05-05', priority: 'Normal' },
];

const completedTests = [
  { id: 1, patient: 'Lucas Moore', testName: 'Blood Glucose', requestedBy: 'Dr. Miller', requestDate: '2025-05-04', completionDate: '2025-05-05', status: 'Normal' },
  { id: 2, patient: 'Ava Martinez', testName: 'Hemoglobin A1C', requestedBy: 'Dr. Johnson', requestDate: '2025-05-03', completionDate: '2025-05-04', status: 'Abnormal' },
  { id: 3, patient: 'Noah Rodriguez', testName: 'Electrolyte Panel', requestedBy: 'Dr. Thompson', requestDate: '2025-05-03', completionDate: '2025-05-04', status: 'Normal' },
  { id: 4, patient: 'Isabella Wilson', testName: 'Kidney Function Test', requestedBy: 'Dr. Martinez', requestDate: '2025-05-02', completionDate: '2025-05-04', status: 'Abnormal' },
  { id: 5, patient: 'Ethan Davis', testName: 'Liver Enzymes', requestedBy: 'Dr. Garcia', requestDate: '2025-05-02', completionDate: '2025-05-03', status: 'Normal' },
];

const testCategoryData = [
  { name: 'Hematology', count: 42 },
  { name: 'Biochemistry', count: 36 },
  { name: 'Microbiology', count: 21 },
  { name: 'Immunology', count: 18 },
  { name: 'Pathology', count: 12 },
];

const testResultStats = [
  { name: 'Normal', value: 68 },
  { name: 'Abnormal', value: 32 },
];

const weeklyTestData = [
  { day: 'Mon', tests: 28 },
  { day: 'Tue', tests: 35 },
  { day: 'Wed', tests: 42 },
  { day: 'Thu', tests: 32 },
  { day: 'Fri', tests: 38 },
  { day: 'Sat', tests: 22 },
  { day: 'Sun', tests: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64dff'];

export default function Laboratory() {
  const { setIsNewTestModalOpen } = useAppContext();
  const [activeTab, setActiveTab] = useState('pending');
  const [filter, setFilter] = useState('all');
  const [timeframe, setTimeframe] = useState('week');
  
  // Filter tests based on priority if needed
  const filteredPendingTests = filter === 'all' 
    ? pendingTests 
    : pendingTests.filter(test => test.priority.toLowerCase() === filter.toLowerCase());

  // Component for lab test status badge
  const StatusBadge = ({ status }:{ status:string }) => {
    const getStatusStyles = () => {
      switch (status.toLowerCase()) {
        case 'urgent':
          return 'bg-red-100 text-red-800';
        case 'normal':
          return 'bg-pink-100 text-pink-800';
        case 'abnormal':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-green-100 text-green-800';
      }
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyles()}`}>
        {status}
      </span>
    );
  };

  // Statistical card component
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

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      {/* Laboratory Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Laboratory</h1>
        <p className="text-sm text-gray-500">Manage and monitor all laboratory tests and results.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Pending Tests" 
          value={24} 
          description="5 marked as urgent" 
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>}
          color="bg-yellow-500"
        />
        <StatCard 
          title="Completed Today" 
          value={18} 
          description="6 with abnormal results" 
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="bg-green-500"
        />
        <StatCard 
          title="Equipment Status" 
          value={96} 
          description="All major equipment operational" 
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>}
          color="bg-pink-500"
        />
        <StatCard 
          title="Avg Turnaround Time" 
          value={12.5} 
          description="2.3 hrs faster than last week" 
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="bg-purple-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Tests by Day */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-800">Tests Processed</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeframe('week')}
                className={`px-3 py-1 text-xs rounded-full ${timeframe === 'week' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'}`}
              >
                Week
              </button>
              <button 
                onClick={() => setTimeframe('month')}
                className={`px-3 py-1 text-xs rounded-full ${timeframe === 'month' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'}`}
              >
                Month
              </button>
              <button 
                onClick={() => setTimeframe('year')}
                className={`px-3 py-1 text-xs rounded-full ${timeframe === 'year' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'}`}
              >
                Year
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weeklyTestData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tests" stroke="#3b82f6" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Test Results Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-6">Test Results</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={testResultStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {testResultStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tests`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Test Category Distribution */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-6">Test Categories</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={testCategoryData}
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
                {testCategoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Laboratory Tests Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'pending'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Tests
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'completed'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed Tests
            </button>
          </div>
          <div className="flex items-center space-x-2">
            {activeTab === 'pending' && (
              <select
                className="text-sm border border-gray-300 rounded-md px-3 py-1"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Tests</option>
                <option value="urgent">Urgent Only</option>
                <option value="normal">Normal Priority</option>
              </select>
            )}
            <button 
              onClick={() => setIsNewTestModalOpen && setIsNewTestModalOpen(true)}
              className="bg-pink-600 text-white text-sm rounded-md px-4 py-1 flex items-center hover:bg-pink-700"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              New Test
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'pending' ? (
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Test Name</th>
                  <th className="pb-3 font-medium">Requested By</th>
                  <th className="pb-3 font-medium">Request Date</th>
                  <th className="pb-3 font-medium">Priority</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPendingTests.map((test) => (
                  <tr key={test.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-2">{test.patient}</td>
                    <td className="py-3 px-2">{test.testName}</td>
                    <td className="py-3 px-2">{test.requestedBy}</td>
                    <td className="py-3 px-2">{test.requestDate}</td>
                    <td className="py-3 px-2">
                      <StatusBadge status={test.priority} />
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex space-x-2">
                        <button className="text-pink-600 hover:text-pink-800">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Test Name</th>
                  <th className="pb-3 font-medium">Requested By</th>
                  <th className="pb-3 font-medium">Completion Date</th>
                  <th className="pb-3 font-medium">Result</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedTests.map((test) => (
                  <tr key={test.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-2">{test.patient}</td>
                    <td className="py-3 px-2">{test.testName}</td>
                    <td className="py-3 px-2">{test.requestedBy}</td>
                    <td className="py-3 px-2">{test.completionDate}</td>
                    <td className="py-3 px-2">
                      <StatusBadge status={test.status} />
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex space-x-2">
                        <button className="text-pink-600 hover:text-pink-800">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Laboratory Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition">
            <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <span className="text-sm font-medium">New Test Request</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <span className="text-sm font-medium">Upload Results</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <span className="text-sm font-medium">Generate Reports</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <span className="text-sm font-medium">Equipment Status</span>
          </button>
        </div>
      </div>
      
      {/* New Test Modal would be imported here */}
      <NewTestModal />
    </div>
  );
}