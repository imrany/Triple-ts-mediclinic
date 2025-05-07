import NewMedicationModal from '@/components/Modals/NewMedicationModal';
import { useAppContext } from '@/context';
import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

// Mock data for the pharmacy dashboard
const salesData = [
  { day: 'Mon', sales: 4200 },
  { day: 'Tue', sales: 5800 },
  { day: 'Wed', sales: 4900 },
  { day: 'Thu', sales: 5200 },
  { day: 'Fri', sales: 6500 },
  { day: 'Sat', sales: 3800 },
  { day: 'Sun', sales: 2100 },
];

const medicationCategories = [
  { name: 'Antibiotics', count: 32 },
  { name: 'Painkillers', count: 28 },
  { name: 'Vitamins', count: 24 },
  { name: 'Cardiovascular', count: 18 },
  { name: 'Respiratory', count: 14 },
];

const lowStockItems = [
  { name: 'Amoxicillin 500mg', category: 'Antibiotics', quantity: 12, threshold: 20 },
  { name: 'Paracetamol 500mg', category: 'Painkillers', quantity: 15, threshold: 25 },
  { name: 'Aspirin 75mg', category: 'Cardiovascular', quantity: 8, threshold: 15 },
  { name: 'Salbutamol Inhaler', category: 'Respiratory', quantity: 5, threshold: 10 },
  { name: 'Metformin 500mg', category: 'Diabetes', quantity: 10, threshold: 20 },
];

const expiringMedications = [
  { id: 1, name: 'Ciprofloxacin 250mg', category: 'Antibiotics', expiryDate: '2025-06-15', quantity: 45 },
  { id: 2, name: 'Metronidazole 400mg', category: 'Antibiotics', expiryDate: '2025-06-30', quantity: 32 },
  { id: 3, name: 'Ibuprofen 200mg', category: 'Painkillers', expiryDate: '2025-07-12', quantity: 78 },
  { id: 4, name: 'Vitamin C 1000mg', category: 'Vitamins', expiryDate: '2025-07-25', quantity: 56 },
  { id: 5, name: 'Loratadine 10mg', category: 'Antihistamines', expiryDate: '2025-08-05', quantity: 27 },
];

const recentPrescriptions = [
  { id: 1, patient: 'Emma Wilson', doctor: 'Dr. Johnson', medication: 'Amoxicillin 500mg', quantity: '30 tablets', date: '2025-05-07', status: 'Filled' },
  { id: 2, patient: 'Michael Brown', doctor: 'Dr. Martinez', medication: 'Lisinopril 10mg', quantity: '60 tablets', date: '2025-05-07', status: 'Pending' },
  { id: 3, patient: 'Sophia Davis', doctor: 'Dr. Thompson', medication: 'Salbutamol Inhaler', quantity: '1 inhaler', date: '2025-05-06', status: 'Filled' },
  { id: 4, patient: 'James Miller', doctor: 'Dr. Garcia', medication: 'Ibuprofen 400mg', quantity: '20 tablets', date: '2025-05-06', status: 'Pending' },
  { id: 5, patient: 'Olivia Taylor', doctor: 'Dr. Wilson', medication: 'Cetirizine 10mg', quantity: '30 tablets', date: '2025-05-05', status: 'Filled' },
];

const salesByCategory = [
  { name: 'Antibiotics', value: 35 },
  { name: 'Painkillers', value: 25 },
  { name: 'Vitamins', value: 15 },
  { name: 'Cardiovascular', value: 12 },
  { name: 'Others', value: 13 },
];

const monthlySales = [
  { month: 'Jan', sales: 125000 },
  { month: 'Feb', sales: 134000 },
  { month: 'Mar', sales: 158000 },
  { month: 'Apr', sales: 148000 },
  { month: 'May', sales: 156000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a64dff'];

export default function Pharmacy() {
  const { setIsNewMedicationModalOpen } = useAppContext();
  const [timeframe, setTimeframe] = useState('week');
  
  const StatCard = ({ title, value, description, icon, color }:{ title:string, value:string, description:string, icon:any, color:string }) => (
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

  const MedicationRow = ({ name, category, expiryDate, quantity }:{ name:string, category:string, expiryDate:Date, quantity:number }) => (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 px-2">{name}</td>
      <td className="py-3 px-2">{category}</td>
      <td className="py-3 px-2">{expiryDate.toLocaleDateString()}</td>
      <td className="py-3 px-2">{quantity}</td>
      <td className="py-3 px-2">
        <span className={`px-2 py-1 text-xs rounded-full ${
          getDaysUntilExpiry(expiryDate) <= 30 ? 'bg-red-100 text-red-800' : 
          getDaysUntilExpiry(expiryDate) <= 60 ? 'bg-yellow-100 text-yellow-800' : 
          'bg-green-100 text-green-800'
        }`}>
          {getDaysUntilExpiry(expiryDate)} days
        </span>
      </td>
    </tr>
  );

  const PrescriptionRow = ({ patient, doctor, medication, quantity, date, status }:{ patient:string, doctor:string, medication:string, quantity:number, date:Date, status:string }) => (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 px-2">{patient}</td>
      <td className="py-3 px-2">{doctor}</td>
      <td className="py-3 px-2">{medication}</td>
      <td className="py-3 px-2">{quantity}</td>
      <td className="py-3 px-2">{date.toLocaleDateString()}</td>
      <td className="py-3 px-2">
        <span className={`px-2 py-1 text-xs rounded-full ${
          status === 'Filled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {status}
        </span>
      </td>
    </tr>
  );

  const LowStockRow = ({ name, category, quantity, threshold }:{ name:string, category:string, quantity:number, threshold:number }) => (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 px-2">{name}</td>
      <td className="py-3 px-2">{category}</td>
      <td className="py-3 px-2">{quantity}</td>
      <td className="py-3 px-2">{threshold}</td>
      <td className="py-3 px-2">
        <span className={`px-2 py-1 text-xs rounded-full ${
          quantity / threshold < 0.5 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {getStockStatus(quantity, threshold)}
        </span>
      </td>
    </tr>
  );

  function getDaysUntilExpiry(expiryDate:Date) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = Math.abs(expiry.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function getStockStatus(quantity:number, threshold:number) {
    const percentage = (quantity / threshold) * 100;
    return `${percentage.toFixed(0)}% of threshold`;
  }

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      {/* Pharmacy Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pharmacy Management</h1>
        <p className="text-sm text-gray-500">Monitor inventory, prescriptions, and sales in your pharmacy.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Medications" 
          value="486" 
          description="52 categories" 
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>}
          color="bg-blue-500"
        />
        <StatCard 
          title="Prescriptions" 
          value="28" 
          description="8 pending today" 
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
          color="bg-green-500"
        />
        <StatCard 
          title="Low Stock Items" 
          value="15" 
          description="5 critically low" 
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
          color="bg-red-500"
        />
        <StatCard 
          title="Today's Sales" 
          value="KES 42,680" 
          description="+12.3% from yesterday" 
          icon={<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="bg-purple-500"
        />
      </div>

      {/* Charts & Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-800">Sales Analytics</h2>
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
                data={salesData}
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
                <Tooltip formatter={(value) => [`KES ${value}`, 'Sales']} />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales By Category */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-6">Sales By Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Medication By Category & Monthly Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Medication By Category */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-6">Medication By Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={medicationCategories}
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
                  {medicationCategories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Sales Chart */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-6">Monthly Sales Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlySales}
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
                <Tooltip formatter={(value) => [`KES ${value}`, 'Sales']} />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Inventory & Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Low Stock Items */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-800">Low Stock Items</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">Order Inventory</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="pb-3 font-medium">Medication</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Quantity</th>
                  <th className="pb-3 font-medium">Threshold</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item, index) => (
                  <LowStockRow key={index} {...item} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-800">Expiring Soon</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                  <th className="pb-3 font-medium">Medication</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Expiry Date</th>
                  <th className="pb-3 font-medium">Quantity</th>
                  <th className="pb-3 font-medium">Days Left</th>
                </tr>
              </thead>
              <tbody>
                {expiringMedications.map((medication) => (
                  <MedicationRow key={medication.id} {...medication} expiryDate={new Date(medication.expiryDate)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Prescriptions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-800">Recent Prescriptions</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800">View All Prescriptions</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Doctor</th>
                <th className="pb-3 font-medium">Medication</th>
                <th className="pb-3 font-medium">Quantity</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPrescriptions.map((prescription) => (
                <PrescriptionRow key={prescription.id} {...prescription} quantity={parseInt(prescription.quantity, 10)} date={new Date(prescription.date)} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4">
          <button className="text-sm text-blue-600 hover:text-blue-800">Load More</button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button onClick={() => setIsNewMedicationModalOpen(true)} className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <span className="text-sm font-medium">Add Medication</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <span className="text-sm font-medium">New Prescription</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
            </div>
            <span className="text-sm font-medium">Generate Report</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </div>
            <span className="text-sm font-medium">Update Inventory</span>
          </button>
        </div>
      </div>
      <NewMedicationModal />
    </div>
  );
}