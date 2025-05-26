import NewAppointmentModal from '@/components/Modals/NewAppointment';
import NewPatient from '@/components/Modals/NewPatient';
import NewStaff from '@/components/Modals/NewStaff';
import { useAppContext } from '@/context';
import { fromSnakeCaseToCamelCase } from '@/lib/utils';
import { Appointment, AppointmentData, DepartmentStats } from '@/types';
import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { toast } from 'sonner';

// Define the Staff type that was missing
type Staff = {
  department: string;
  email: string;
  experience: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  photo: string;
  role: string;
  specialty: string;
  status: string;
};

// Define a proper type for the appointment data structure as received from API
type AppointmentWithStaff = {
  appointment: Appointment;
  staff: Staff;
};

const patientStats = [
  { name: 'New', value: 45 },
  { name: 'Returning', value: 85 },
  { name: 'Referred', value: 30 },
];

const revenueData = [
  { month: 'Jan', revenue: 24000 },
  { month: 'Feb', revenue: 26000 },
  { month: 'Mar', revenue: 32000 },
  { month: 'Apr', revenue: 28000 },
  { month: 'May', revenue: 30000 },
  { month: 'Jun', revenue: 34000 },
];

const notifications = [
  { id: 1, message: 'New patient registration: Lucas Moore', time: '5 mins ago', type: 'info' },
  { id: 2, message: 'Appointment rescheduled: Emma Wilson', time: '27 mins ago', type: 'warning' },
  { id: 3, message: 'Lab results ready: Michael Brown', time: '1 hour ago', type: 'success' },
  { id: 4, message: 'Prescription renewal: Sophia Davis', time: '3 hours ago', type: 'info' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64dff'];

export default function Dashboard() {
  const { setIsNewAppointmentModalOpen, setIsNewStaffModalOpen, fetchStaffAndDepartments, roles, specialities, api_url, staff, authData, setIsNewPatientModalOpen, doctors, departments, patients } = useAppContext();
  const [timeframe, setTimeframe] = useState('week');
  const [notificationCount, setNotificationCount] = useState(4);
  const [appointments, setAppointments] = useState<AppointmentWithStaff[]>([]);
  const [appointmentData, setAppointData] = useState<AppointmentData[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const navigate = useNavigate()
  const [count, setCount] = useState(6)

  async function fetchAppointments() {
    try {
      const response = await fetch(`${api_url}/api/appointments`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authData?.token || ''}`
        }
      });
      const parseRes = await response.json();
      if (parseRes.error) {
        toast(`Something went wrong!`, {
          description: `${parseRes.error}`,
          action: {
            label: "Retry",
            onClick: () => fetchAppointments()
          },
        });
      } else {
        const data = fromSnakeCaseToCamelCase(parseRes) as AppointmentWithStaff[];
        console.log(data);
        setAppointments(data);

        // Process appointment data for chart
        const groupedAppointments = data.reduce((acc: Record<string, number>, item: AppointmentWithStaff) => {
          const day = new Date(item.appointment.appointmentDate).toLocaleDateString('en-US', {
            weekday: 'short',
          });

          acc[day] = (acc[day] || 0) + 1;
          return acc;
        }, {});

        setAppointData(Object.entries(groupedAppointments).map(([day, count]) => ({
          day,
          count: count as number,
        })));

        setNotificationCount(data.length);

        // Calculate department statistics
        const deptStats = Object.entries(
          data.reduce((acc: Record<string, number>, item: AppointmentWithStaff) => {
            const department = item.appointment.department;
            acc[department] = (acc[department] || 0) + 1;
            return acc;
          }, {})
        )
          .map(([name, patients]) => ({ name, patients: patients as number }))
          .sort((a, b) => b.patients - a.patients);

        setDepartmentStats(deptStats);
      }
    } catch (error: any) {
      console.log(error.message);
      toast(`Something went wrong!`, {
        description: `${error.message}`,
        action: {
          label: "Retry",
          onClick: () => fetchAppointments()
        },
      });
    }
  }

  async function fetchPatients() {
    try {
      const response = await fetch(`${api_url}/api/appointments`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${authData?.token || ''}`
        }
      });
      const parseRes = await response.json();
      if (parseRes.error) {
        toast(`Something went wrong!`, {
          description: `${parseRes.error}`,
          action: {
            label: "Retry",
            onClick: () => fetchAppointments()
          },
        });
      } else {
        const data = fromSnakeCaseToCamelCase(parseRes) as AppointmentWithStaff[];
        console.log(data);
        setAppointments(data);
      }
    } catch (error: any) {
      console.log(error.message);
      toast(`Something went wrong!`, {
        description: `${error.message}`,
        action: {
          label: "Retry",
          onClick: () => fetchPatients()
        },
      });
    }
  }

  useEffect(() => {
    fetchStaffAndDepartments()
    fetchPatients()
    fetchAppointments();
  }, []);

  const StatCard: React.FC<{ title: string; value: string; description: string; icon: React.ReactNode; color: string }> = ({ title, value, description, icon, color }) => (
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

  const NotificationItem: React.FC<{ message: string; time: string; type: string }> = ({ message, time, type }) => {
    const getTypeStyles = () => {
      switch (type) {
        case 'info':
          return 'bg-blue-100 text-blue-800';
        case 'warning':
          return 'bg-yellow-100 text-yellow-800';
        case 'success':
          return 'bg-green-100 text-green-800';
        case 'error':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="border-b border-gray-100 last:border-0 py-3">
        <div className="flex items-start">
          <div className={`w-2 h-2 rounded-full mt-2 mr-2 ${type === 'info' ? 'bg-blue-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
          <div className="flex-1">
            <p className="text-sm">{message}</p>
            <p className="text-xs text-gray-500 mt-1">{time}</p>
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${getTypeStyles()}`}>
            {type}
          </div>
        </div>
      </div>
    );
  };

  const AppointmentRow: React.FC<{ appointment: Appointment; staff: Staff }> = ({ appointment, staff }) => (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 px-2 text-sm">{appointment.patientName}</td>
      <td className="py-3 px-2 text-sm">{appointment.appointmentTime}</td>
      <td className="py-3 px-2 text-sm">{`${staff.firstName} ${staff.lastName}`}</td>
      <td className="py-3 px-2 text-sm">{appointment.department}</td>
      <td className="py-3 px-2 text-sm">
        <span className={`px-2 py-1 text-xs rounded-full ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
          {appointment.status}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome back! Here's what's happening in your medical center.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Patients"
          value={patients.length.toString()}
          description="+15% from last month"
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
          color="bg-blue-500"
        />
        <StatCard
          title="Appointments"
          value={appointments.length.toString()}
          description="Today's appointments"
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
          color="bg-green-500"
        />
        <StatCard
          title="Available Doctors"
          value={doctors.length.toString()}
          description={`${doctors.filter((doctor: { status: string }) => doctor.status === "active").length} currently on duty`}
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
          color="bg-purple-500"
        />
        <StatCard
          title="Revenue"
          value="KES 34,580"
          description="+8.2% from last week"
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="bg-yellow-500"
        />
      </div>

      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Appointments Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-800">Appointment Analytics</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setTimeframe('week')}
                className={`px-3 py-1 text-xs rounded-full ${timeframe === 'week' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeframe('month')}
                className={`px-3 py-1 text-xs rounded-full ${timeframe === 'month' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeframe('year')}
                className={`px-3 py-1 text-xs rounded-full ${timeframe === 'year' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              >
                Year
              </button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={appointmentData}
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
                <Line type="monotone" dataKey="count" stroke="#3b82f6" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-6">Patient Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={patientStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {patientStats.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Statistics & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Department Statistics */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-6">Department Statistics</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={departmentStats}
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
                <Bar dataKey="patients" fill="#8884d8">
                  {departmentStats.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-6">Revenue Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Appointments & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-800">Today's Appointments</h2>
            <button onClick={() => navigate("/dashboard/appointments")} className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Time</th>
                  <th className="pb-3 font-medium">Doctor</th>
                  <th className="pb-3 font-medium">Department</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(0, count).map((item) => (
                  <AppointmentRow
                    key={item.appointment.id}
                    appointment={item.appointment}
                    staff={item.staff}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <button onClick={() => setCount(count + 3)} className="text-sm text-blue-600 hover:text-blue-800">Load More</button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-800">Notifications</h2>
            <div className="flex items-center">
              <span className="bg-blue-100 text-blue-800 text-xs rounded-full px-2 py-1 mr-2">{notificationCount}</span>
              <button
                onClick={() => setNotificationCount(0)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            </div>
          </div>
          <div className="space-y-1">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                message={notification.message}
                time={notification.time}
                type={notification.type}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <button className="text-sm text-blue-600 hover:text-blue-800">View All Notifications</button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(staff?.role==="Admin"||staff?.role==="Nurse"||staff?.role==="Receptionist")&&(<button onClick={() => setIsNewAppointmentModalOpen(true)} className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <span className="text-sm font-medium">New Appointment</span>
          </button>)}
          {(staff?.role==="Admin"||staff?.role==="Doctor"||staff?.role==="Nurse"||staff?.role==="Receptionist")&&(<button onClick={()=>setIsNewPatientModalOpen(true)} className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            </div>
            <span className="text-sm font-medium">Add Patient</span>
          </button>)}
          {(staff?.role==="Admin"||staff?.role==="Receptionist"||staff?.role==="Technician")&&(
            <button onClick={()=>setIsNewStaffModalOpen(true)} className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition">
              <div className="w-10 text-white h-10 rounded-full bg-yellow-500 flex items-center justify-center mb-2">
                <User/>
              </div>
              <span className="text-sm font-medium">Add Staff</span>
            </button>
          )}
          {/* <button onClick={()=>alert("Cannot Generate report, try again later")} className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <span className="text-sm font-medium">Generate Report</span>
          </button> */}
         
        </div>
      </div>
      <NewAppointmentModal departments={departments} doctors={doctors} actions={{ fetchAppointments }} />
      <NewPatient departments={departments} actions={{ fetchPatients }} />
      <NewStaff departments={departments} roles={roles} specialties={specialities}/>
    </div>
  );
}