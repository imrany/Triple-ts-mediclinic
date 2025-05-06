import { useState, useEffect } from 'react';
import { useAppContext } from '@/context';
import { Calendar, Clock, User, Filter, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Appointment } from '@/types';
import { doctors, patients } from '@/data';
import useIsMobile from '@/hooks/useIsMobile';


export default function CalendarPage() {
  const { user } = useAppContext();
  const isDoctor = user?.role === 'doctor' || user?.role === 'Senior Physician';
  const isMobile = useIsMobile()
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'day', 'week', 'month'
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [filters, setFilters] = useState({
    status: 'all', // all, confirmed, pending, cancelled
    type: 'all',   // all, checkup, followup, procedure, etc.
  });

  // New appointment form state
  const [newAppointment, setNewAppointment] = useState<Appointment>({
    id: "",
    patientName: "",
    doctorName: "",
    title: '',
    patientId: '',
    doctorId: '',
    date: new Date,
    startTime: '',
    endTime: '',
    type: 'checkup',
    notes: '',
    status: 'pending',
  });

  // Time slots for the calendar
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  // Days of the week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Fetch data on component mount
  useEffect(() => {
    // In a real application, you would fetch these from an API
    fetchMockData();

    // Set filtered appointments based on initial filters
    filterAppointments();
  }, []);

  // Update filtered appointments when filters or appointments change
  useEffect(() => {
    filterAppointments();
  }, [filters, appointments]);

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
        id: 'a1',
        title: 'Annual Checkup',
        patientId: 'p1',
        patientName: 'John Smith',
        doctorId: 'd1',
        doctorName: 'Dr. Sarah Johnson',
        date: today,
        startTime: '09:00',
        endTime: '09:30',
        type: 'checkup',
        notes: 'Routine annual physical examination',
        status: 'confirmed',
      },
      {
        id: 'a2',
        title: 'Follow-up Consultation',
        patientId: 'p2',
        patientName: 'Emma Johnson',
        doctorId: 'd1',
        doctorName: 'Dr. Sarah Johnson',
        date: today,
        startTime: '10:00',
        endTime: '10:30',
        type: 'followup',
        notes: 'Follow-up after medication change',
        status: 'confirmed',
      },
      {
        id: 'a3',
        title: 'MRI Scan',
        patientId: 'p3',
        patientName: 'Michael Brown',
        doctorId: 'd2',
        doctorName: 'Dr. Robert Chen',
        date: tomorrow,
        startTime: '14:00',
        endTime: '15:00',
        type: 'procedure',
        notes: 'Brain MRI scan',
        status: 'pending',
      },
      {
        id: 'a4',
        title: 'Pediatric Checkup',
        patientId: 'p4',
        patientName: 'Sophia Davis',
        doctorId: 'd3',
        doctorName: 'Dr. Maria Garcia',
        date: dayAfter,
        startTime: '11:00',
        endTime: '11:30',
        type: 'checkup',
        notes: 'Regular pediatric checkup',
        status: 'confirmed',
      },
    ];

    setAppointments(mockAppointments);
    setFilteredAppointments(mockAppointments);
  };

  // Filter appointments based on selected filters
  const filterAppointments = () => {
    let filtered = [...appointments];

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === filters.status);
    }

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(appointment => appointment.type === filters.type);
    }

    // If user is a doctor, only show their appointments
    if (isDoctor) {
      filtered = filtered.filter(appointment => appointment.doctorId === user.id);
    }

    // If user is a patient, only show their appointments
    if (!isDoctor) {
      filtered = filtered.filter(appointment => appointment.patientId === user.id);
    }

    setFilteredAppointments(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle new appointment form changes
  const handleAppointmentChange = (e: any) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Create new appointment
  const handleCreateAppointment = (e: any) => {
    e.preventDefault();

    // Find patient and doctor info
    const patient = patients.find(p => p.id === newAppointment.patientId);
    const doctor = doctors.find(d => d.id === newAppointment.doctorId);

    const newAppointmentData = {
      id: `a${appointments.length + 1}`,
      title: newAppointment.title,
      patientId: newAppointment.patientId,
      doctorId: newAppointment.doctorId,
      date: newAppointment.date,
      startTime: newAppointment.startTime,
      endTime: newAppointment.endTime,
      type: newAppointment.type,
      notes: newAppointment.notes,
      status: newAppointment.status,
      patientName: patient?.name || 'Unknown Patient',
      doctorName: doctor?.name || 'Unknown Doctor',
    };

    setAppointments(prev => [...prev, newAppointmentData]);
    setShowModal(false);

    // Reset form
    setNewAppointment({
      id: "",
      patientName: "",
      doctorName: "",
      title: '',
      patientId: '',
      doctorId: '',
      date: new Date,
      startTime: '',
      endTime: '',
      type: 'checkup',
      notes: '',
      status: 'pending',
    });
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
  const getAppointmentsForDateTime = (date: any, time: any) => {
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = `${time.toString().padStart(2, '0')}:00`;

    return filteredAppointments.filter(appointment => {
      return (
        appointment.date === dateStr &&
        appointment.startTime.startsWith(timeStr.substring(0, 2))
      );
    });
  };

  // Format date for display
  const formatDate = (date: any) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Get status color
  const getStatusColor = (status: any) => {
    switch (status) {
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
  const renderAppointmentCard = (appointment: any) => {
    return (
      <div
        key={appointment.id}
        className={`p-2 mb-1 rounded-md border-l-4 border-pink-500 shadow-sm ${appointment.status === 'cancelled' ? 'opacity-50' : ''
          }`}
      >
        <div className="flex justify-between items-start">
          <div className="font-medium text-sm">{appointment.title}</div>
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <Clock className="w-3 h-3 mr-1" />
          {appointment.startTime} - {appointment.endTime}
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
              {appointment.doctorName}
            </>
          )}
        </div>
        <div className="text-xs mt-1 truncate">{appointment.notes}</div>
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
              className={`py-2 text-sm font-medium ${date.toDateString() === new Date().toDateString() ? 'bg-pink-50' : ''
                }`}
            >
              <div>{daysOfWeek[date.getDay()].substring(0, 3)}</div>
              <div className={`text-lg ${date.toDateString() === selectedDate.toDateString() ? 'bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>
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
                      className={`p-1 border-r min-h-16 ${date.toDateString() === new Date().toDateString() ? 'bg-pink-50' : ''
                        }`}
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

  // New Appointment Modal
  const RenderNewAppointmentModal = () => {
    return (
      <div className={`fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 ${showModal ? '' : 'hidden'}`}>
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Schedule New Appointment</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateAppointment}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newAppointment.title}
                  onChange={handleAppointmentChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={newAppointment.date.toISOString().split('T')[0]}
                    onChange={handleAppointmentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Type
                  </label>
                  <select
                    name="type"
                    value={newAppointment.type}
                    onChange={handleAppointmentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  >
                    <option value="checkup">Check-up</option>
                    <option value="followup">Follow-up</option>
                    <option value="procedure">Procedure</option>
                    <option value="consultation">Consultation</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={newAppointment.startTime}
                    onChange={handleAppointmentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={newAppointment.endTime}
                    onChange={handleAppointmentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  />
                </div>
              </div>

              {isDoctor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient
                  </label>
                  <select
                    name="patientId"
                    value={newAppointment.patientId}
                    onChange={handleAppointmentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  >
                    <option value="">Select a patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {!isDoctor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor
                  </label>
                  <select
                    name="doctorId"
                    value={newAppointment.doctorId}
                    onChange={handleAppointmentChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={newAppointment.notes}
                  onChange={handleAppointmentChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded-md text-sm hover:bg-pink-700"
                >
                  Schedule Appointment
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className={`container mx-auto ${isMobile ? "py-6" : "pb-6"} max-w-6xl`}>
      <RenderNewAppointmentModal/>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
          <p className="text-sm text-gray-500">Manage your medical calendar</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-pink-600 text-white rounded-md text-sm hover:bg-pink-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" /> 
          {!isMobile&&(<p>New Appointment</p>)}
        </button>
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
              <button className="px-3 py-1 text-sm border rounded-md flex items-center">
                <Filter className="w-4 h-4 mr-1" /> Filter
              </button>
              <div className="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg p-2 z-10 hidden">
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
            .filter(appointment => new Date(appointment.date.toISOString().split('T')[0]) >= new Date())
            .sort((a, b) => Number(new Date(a.date)) - Number(new Date(b.date)))
            .slice(0, 5)
            .map(appointment => (
              <div key={appointment.id} className="flex items-center p-3 border rounded-md">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${getStatusColor(appointment.status)}`}>
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{appointment.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(appointment.date.toISOString().split('T')[0]).toLocaleDateString()} at {appointment.startTime}
                  </div>
                  <div className="text-sm">
                    {isDoctor ? `Patient: ${appointment.patientName}` : `Doctor: ${appointment.doctorName}`}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}