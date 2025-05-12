import { useState, useEffect } from 'react';
import { useAppContext } from '@/context';
import { Calendar, Clock, User, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Appointment } from '@/types';
import useIsMobile from '@/hooks/useIsMobile';

export default function CalendarPage() {
  const { staff } = useAppContext();
  const isDoctor = staff?.role === 'doctor';
  const isMobile = useIsMobile();
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [filters, setFilters] = useState({
    status: 'all', // all, confirmed, pending, cancelled
    type: 'all',   // all, checkup, followup, procedure, etc.
  });


  // Time slots for the calendar
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  // Days of the week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Fetch data on component mount
  useEffect(() => {
    // In a real application, you would fetch these from an API
    fetchMockData();
  }, []);

  // Update filtered appointments when filters or appointments change
  useEffect(() => {
    filterAppointments();
  }, [filters, appointments, staff]);

  // Mock data fetching
  const fetchMockData = () => {
    // Mock appointments
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(today.getDate() + 2);

    const mockAppointments = [
      {
        id: '1',
        patientNationalID: 123456789,
        patientName: 'John Doe',
        patientAddress: '123 Main St, Cityville',
        patientPhoneNumber: '555-1234',
        appointmentDate: today.toISOString().split('T')[0],
        appointmentTime: "09:00",
        department: 'Cardiology',
        staffId: 'doc123',
        status: 'confirmed',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString(),
        title: 'Annual Checkup',
        patientId: 'p1',
        doctorId: 'd1',
        doctorName: 'Dr. Sarah Johnson',
        startTime: '09:00',
        endTime: '09:30',
        type: 'checkup',
        notes: 'Routine annual physical examination',
        date: today.toISOString().split('T')[0],
      },
      {
        id: 'a2',
        patientNationalID: 456789123,
        patientName: 'Emma Johnson',
        patientAddress: '456 Oak Ave, Townsville',
        patientPhoneNumber: '555-5678',
        appointmentDate: today.toISOString().split('T')[0],
        appointmentTime: "10:00",
        department: 'Neurology',
        staffId: 'd1',
        status: 'confirmed',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString(),
        title: 'Follow-up Consultation',
        patientId: 'p2',
        doctorId: 'd1',
        doctorName: 'Dr. Sarah Johnson',
        startTime: '10:00',
        endTime: '10:30',
        type: 'followup',
        notes: 'Follow-up after medication change',
        date: today.toISOString().split('T')[0],
      },
      {
        id: 'a3',
        patientNationalID: 789123456,
        patientName: 'Michael Brown',
        patientAddress: '789 Pine St, Villageton',
        patientPhoneNumber: '555-9012',
        appointmentDate: tomorrow.toISOString().split('T')[0],
        appointmentTime: "14:00",
        department: 'Radiology',
        staffId: 'd2',
        status: 'pending',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString(),
        title: 'MRI Scan',
        patientId: 'p3',
        doctorId: 'd2',
        doctorName: 'Dr. Robert Chen',
        startTime: '14:00',
        endTime: '15:00',
        type: 'procedure',
        notes: 'Brain MRI scan',
        date: tomorrow.toISOString().split('T')[0],
      },
      {
        id: 'a4',
        patientNationalID: 321654987,
        patientName: 'Sophia Davis',
        patientAddress: '321 Maple Dr, Hamletburg',
        patientPhoneNumber: '555-3456',
        appointmentDate: dayAfter.toISOString().split('T')[0],
        appointmentTime: "11:00",
        department: 'Pediatrics',
        staffId: 'd3',
        status: 'confirmed',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString(),
        title: 'Pediatric Checkup',
        patientId: 'p4',
        doctorId: 'd3',
        doctorName: 'Dr. Maria Garcia',
        startTime: '11:00',
        endTime: '11:30',
        type: 'checkup',
        notes: 'Regular pediatric checkup',
        date: dayAfter.toISOString().split('T')[0],
      },
    ];

    setAppointments(mockAppointments as Appointment[]);
    setFilteredAppointments(mockAppointments as Appointment[]);
  };

  // Filter appointments based on selected filters
  const filterAppointments = () => {
    let filtered = [...appointments];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(appointment => appointment.status.toLowerCase() === filters.status);
    }

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(appointment => (appointment as any).type === filters.type);
    }

    // If user is a doctor, only show their appointments
    if (isDoctor && staff?.id) {
      filtered = filtered.filter(appointment => (appointment as any).doctorId === staff.id);
    }

    // If user is a patient, only show their appointments
    if (!isDoctor && staff?.id) {
      filtered = filtered.filter(appointment => (appointment as any).patientId === staff.id);
    }

    setFilteredAppointments(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  

  // Navigation functions
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Get date range for the current view
  const getDateRange = () => {
    const dates = [];
    const startDate = new Date(currentDate);

    if (view === 'day') {
      return [startDate];
    } else if (view === 'week') {
      // Start from Sunday of the current week
      const day = startDate.getDay();
      startDate.setDate(startDate.getDate() - day);

      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push(date);
      }
    } else if (view === 'month') {
      // Start from the first day of the month
      startDate.setDate(1);
      const month = startDate.getMonth();

      while (startDate.getMonth() === month) {
        dates.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
      }
    }

    return dates;
  };

  // Get appointments for a specific date and time
  const getAppointmentsForDateTime = (date: Date, time: number) => {
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = `${time.toString().padStart(2, '0')}:00`;

    return filteredAppointments.filter((appointment: Appointment) => {
      const apptDate = appointment.appointmentDate || (appointment as any).date;
      const apptTime = appointment.appointmentTime || (appointment as any).startTime;
      
      return (
        apptDate === dateStr &&
        apptTime && apptTime.startsWith(timeStr.substring(0, 2))
      );
    });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render appointment card
  const renderAppointmentCard = (appointment: Appointment) => {
    return (
      <div
        key={appointment.id}
        className={`p-2 mb-1 rounded-md border-l-4 border-pink-500 shadow-sm ${appointment.status.toLowerCase() === 'cancelled' ? 'opacity-50' : ''}`}
      >
        <div className="flex justify-between items-start">
          <div className="font-medium text-sm">{(appointment as any).title || `Appointment: ${appointment.patientName}`}</div>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <Clock className="w-3 h-3 mr-1" />
          {appointment.appointmentTime || (appointment as any).startTime}
        </div>
        <div className="flex items-center text-xs text-gray-500">
          {isDoctor ? (
            <>
              <User className="w-3 h-3 mr-1" />
              {appointment.patientName}
            </>
          ) : (
            <>
              <User className="w-3 h-3 mr-1" />
              {(appointment as any).doctorName || appointment.staffId}
            </>
          )}
        </div>
        <div className="text-xs mt-1 truncate">{appointment.department}</div>
      </div>
    );
  };

  // Render calendar header based on view
  const renderCalendarHeader = () => {
    if (view === 'day') {
      return (
        <div className="text-center font-medium py-2 border-b">
          {formatDate(currentDate)}
        </div>
      );
    } else if (view === 'week') {
      const dates = getDateRange();
      return (
        <div className="grid grid-cols-7 text-center border-b">
          {dates.map((date, index) => (
            <div
              key={index}
              className={`py-2 text-sm font-medium ${date.toDateString() === new Date().toDateString() ? 'bg-pink-50' : ''}`}
            >
              <div>{daysOfWeek[date.getDay()].substring(0, 3)}</div>
              <div 
                className={`text-lg ${date.toDateString() === selectedDate.toDateString() ? 'bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>
      );
    } else if (view === 'month') {
      // Month view header would go here
      return (
        <div className="text-center font-medium py-2 border-b">
          {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)}
        </div>
      );
    }
  };

  // Render calendar content
  const renderCalendarContent = () => {
    if (view === 'day') {
      return (
        <div className="flex flex-col">
          {timeSlots.map(time => {
            const appointments = getAppointmentsForDateTime(currentDate, time);
            return (
              <div key={time} className="flex border-b">
                <div className="w-16 py-2 text-xs text-right pr-2 text-gray-500">
                  {time}:00
                </div>
                <div className="flex-grow p-1 min-h-16">
                  {appointments.map(appointment => renderAppointmentCard(appointment))}
                </div>
              </div>
            );
          })}
        </div>
      );
    } else if (view === 'week') {
      const dates = getDateRange();
      return (
        <div className="flex flex-col">
          {timeSlots.map(time => (
            <div key={time} className="flex border-b">
              <div className="w-16 py-2 text-xs text-right pr-2 text-gray-500 border-r">
                {time}:00
              </div>
              <div className="flex-grow grid grid-cols-7">
                {dates.map((date, index) => {
                  const appointments = getAppointmentsForDateTime(date, time);
                  return (
                    <div
                      key={index}
                      className={`p-1 border-r min-h-16 ${date.toDateString() === new Date().toDateString() ? 'bg-pink-50' : ''}`}
                    >
                      {appointments.map(appointment => renderAppointmentCard(appointment))}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
    } else if (view === 'month') {
      // Month view content would go here
      return <div className="p-4 text-center text-gray-500">Month view is under development</div>;
    }
  };

  // Helper function to safely format dates
  const formatAppointmentDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid date";
    }
  };

  // Helper function to safely compare dates
  const isDateAfterToday = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className={`container mx-auto ${isMobile ? "py-6" : "pb-6"} max-w-6xl`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
          <p className="text-sm text-gray-500">Manage your medical calendar</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-pink-50 text-pink-600 rounded-md text-sm hover:bg-pink-100"
            >
              Today
            </button>
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-medium">
              {view === 'month'
                ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)
                : view === 'week'
                  ? `Week of ${new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(getDateRange()[0])}`
                  : formatDate(currentDate)
              }
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setView('day')}
                className={`px-3 py-1 text-sm ${view === 'day' ? 'bg-pink-50 text-pink-600' : 'bg-white'}`}
              >
                Day
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-3 py-1 text-sm ${view === 'week' ? 'bg-pink-50 text-pink-600' : 'bg-white'}`}
              >
                Week
              </button>
              <button
                onClick={() => setView('month')}
                className={`px-3 py-1 text-sm ${view === 'month' ? 'bg-pink-50 text-pink-600' : 'bg-white'}`}
              >
                Month
              </button>
            </div>

            <div className="relative">
              <button 
                className="px-3 py-1 text-sm border rounded-md flex items-center"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <Filter className="w-4 h-4 mr-1" /> Filter
              </button>
              <div className={`absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg p-2 z-10 ${showFilterDropdown ? "" : "hidden"}`}>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-2 py-1 text-sm border rounded"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-2 py-1 text-sm border rounded"
                  >
                    <option value="all">All Types</option>
                    <option value="checkup">Check-up</option>
                    <option value="followup">Follow-up</option>
                    <option value="procedure">Procedure</option>
                    <option value="consultation">Consultation</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {renderCalendarHeader()}
            {renderCalendarContent()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-lg font-medium mb-4">Upcoming Appointments</h2>
        <div className="space-y-2">
          {filteredAppointments
            .filter(appointment => {
              const dateToCheck = appointment.appointmentDate || (appointment as any).date;
              return isDateAfterToday(dateToCheck);
            })
            .sort((a, b) => {
              const dateA = new Date(a.appointmentDate || (a as any).date);
              const dateB = new Date(b.appointmentDate || (b as any).date);
              return dateA.getTime() - dateB.getTime();
            })
            .slice(0, 5)
            .map(appointment => (
              <div key={appointment.id} className="flex items-center p-3 border rounded-md">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${getStatusColor(appointment.status)}`}>
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{(appointment as any).title || `Appointment: ${appointment.patientName}`}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatAppointmentDate(appointment.appointmentDate || (appointment as any).date)} at {appointment.appointmentTime || (appointment as any).startTime}
                  </div>
                  <div className="text-sm">
                    {isDoctor ? `Patient: ${appointment.patientName}` : `Doctor: ${(appointment as any).doctorName || appointment.staffId}`}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}