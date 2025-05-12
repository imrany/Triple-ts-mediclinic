import { useEffect, useState } from 'react';
import { Calendar, Clock, Filter, Plus, Search, ChevronLeft, ChevronRight, MoreHorizontal, X } from 'lucide-react';
import { useAppContext } from '@/context';
import NewAppointmentModal from '@/components/Modals/NewAppointment';
import useIsMobile from '@/hooks/useIsMobile';
import { Appointment, Staff } from '@/types';
import { toast } from 'sonner';
import { fromSnakeCaseToCamelCase } from '@/lib/utils';

export default function AppointmentsPage() {
  const { departments, doctors, api_url, authData } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date('2025-05-06'));
  const [view, setView] = useState('day'); // day, week, month
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    department: 'all',
    doctor: 'all',
  });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const { setIsNewAppointmentModalOpen } = useAppContext();
  const isMobile = useIsMobile();
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Navigate to previous day/week/month
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next day/week/month
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Get initials from a name
  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  async function fetchAppointments() {
    setIsLoading(true);
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
        setAppointments([]);
      } else {
        const data = fromSnakeCaseToCamelCase(parseRes);
        setAppointments(data);
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
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Filter appointments whenever dependencies change
  useEffect(() => {
    if (!appointments) return;
    
    const filtered = appointments.filter((appointment: Appointment) => {
      // Match search term
      const matchesSearch = searchTerm === '' || (
        (appointment.patientName && appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.staffId && appointment.staffId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appointment.notes && appointment.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      // Match filters
      const matchesStatus = filters.status === 'all' || appointment.status === filters.status;
      const matchesDepartment = filters.department === 'all' || appointment.department === filters.department;
      const matchesDoctor = filters.doctor === 'all' || appointment.staffId === filters.doctor;

      // For day view, only show appointments for the selected date
      const appointmentDate = new Date(appointment.appointmentDate);
      const matchesDate = view === 'day'
        ? appointmentDate.toDateString() === currentDate.toDateString()
        : true; // For week and month view, we'll handle display separately

      return matchesSearch && matchesStatus && matchesDepartment && matchesDoctor && matchesDate;
    });

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, filters, view, currentDate]);

  // Initial data fetch
  useEffect(() => {
    fetchAppointments();
  }, []);

  const StatusBadge = ({ status }: { status: string }) => {
    let bgColor;
    let textColor;

    switch (status) {
      case 'Confirmed':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      case 'Pending':
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-800';
        break;
      case 'Cancelled':
        bgColor = 'bg-red-100';
        textColor = 'text-red-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }

    return (
      <span className={`px-3 py-1 text-xs rounded-full ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };

  const AppointmentDetails = ({ appointment }: { appointment: Appointment }) => {
    if (!appointment) return null;

    // Find doctor details from staffId
    const doctor = doctors?.find((doc: Staff) => doc.id === appointment.staffId);
    const doctorName = doctor ? `${doctor.firstName} ${doctor.lastName}` : appointment.staffId;

    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold">{appointment.patientName}</h3>
          <button
            onClick={() => setSelectedAppointment(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <Clock size={18} className="text-gray-500 mr-2" />
            <p>{new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.appointmentTime}</p>
          </div>

          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center mr-2">
              {doctor ? getInitials(`${doctor.firstName} ${doctor.lastName}`) :
                appointment.staffId.length <= 2 ? appointment.staffId : appointment.staffId.substring(0, 2)}
            </div>
            <div>
              <p className="font-medium">{doctorName}</p>
              <p className="text-sm text-gray-500">{appointment.department}</p>
            </div>
          </div>

          <div>
            <p className="font-medium mb-1">Status</p>
            <StatusBadge status={appointment.status} />
          </div>

          <div>
            <p className="font-medium mb-1">Notes</p>
            <p className="text-gray-700">{appointment.notes || 'No notes available'}</p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Reschedule
            </button>
            {appointment.status !== 'Cancelled' && (
              <button className="px-4 py-2 bg-white border border-red-300 rounded-lg text-red-700 hover:bg-red-50">
                Cancel
              </button>
            )}
            <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
              Edit Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FilterPanel = () => (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Filters</h3>
        <button
          onClick={() => setIsFilterPanelOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">Select Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          >
            <option value="all">Select Department</option>
            {Array.isArray(departments) && departments.map((dept: string, index: number) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            value={filters.doctor}
            onChange={(e) => setFilters({ ...filters, doctor: e.target.value })}
          >
            <option value="all">Select Doctor</option>
            {Array.isArray(doctors) && doctors.map((doctor: Staff) => (
              <option key={doctor.id} value={doctor.id}>{`${doctor.firstName} ${doctor.lastName}`}</option>
            ))}
          </select>
        </div>

        <div className="pt-4 flex justify-end space-x-2">
          <button
            onClick={() => setFilters({ status: 'all', department: 'all', doctor: 'all' })}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={() => setIsFilterPanelOpen(false)}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );

  const AppointmentsList = () => {
    const doctorMap = Array.isArray(doctors) ?
      doctors.reduce((map: Record<string, Staff>, doctor: Staff) => {
        map[doctor.id] = doctor;
        return map;
      }, {}) : {};

    if (isLoading) {
      return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Loading appointments...</h3>
          </div>
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500">Please wait while we fetch the appointments.</p>
          </div>
        </div>
      );
    }

    if (!appointments) {
      return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">No appointments data</h3>
          </div>
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500">Unable to load appointments.</p>
            <button
              onClick={fetchAppointments}
              className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 inline-flex items-center"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Appointments for {formatDate(currentDate)}</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment: Appointment) => {
              const doctor = doctorMap[appointment.staffId];
              const doctorName = doctor ?
                `${doctor.firstName} ${doctor.lastName}` :
                appointment.staffId;

              return (
                <div
                  key={appointment.id}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-800 flex items-center justify-center font-medium mr-3">
                        {getInitials(appointment.patientName)}
                      </div>
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500">
                          {appointment.appointmentTime} • {doctorName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <StatusBadge status={appointment.status} />
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500">No appointments found for this date with the selected filters.</p>
              <button
                onClick={() => setIsNewAppointmentModalOpen(true)}
                className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 inline-flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Schedule New Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`font-[family-name:var(--font-geist-sans)] ${isMobile ? "py-6" : "pb-6"}`}>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <p className="text-sm text-gray-500">Manage and schedule patient appointments</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('day')}
            className={`px-4 py-2 rounded-lg ${view === 'day' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Day
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-lg ${view === 'week' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded-lg ${view === 'month' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'}`}
          >
            Month
          </button>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search appointments..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={18} />
          </button>
          <button
            onClick={() => setIsNewAppointmentModalOpen(true)}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 inline-flex items-center"
          >
            <Plus size={18} className="mr-1" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={navigatePrevious}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center space-x-2">
          <Calendar size={18} className="text-gray-500" />
          <span className="font-medium">{formatDate(currentDate)}</span>
        </div>
        <button
          onClick={navigateNext}
          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters Panel - Only shown when filter button is clicked */}
        {isFilterPanelOpen && (
          <div className="lg:col-span-1">
            <FilterPanel />
          </div>
        )}

        {/* Appointments List */}
        <div className={`${selectedAppointment || isFilterPanelOpen ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <AppointmentsList />
        </div>

        {/* Appointment Details - Only shown when an appointment is selected */}
        {selectedAppointment && (
          <div className="lg:col-span-1">
            <AppointmentDetails appointment={selectedAppointment} />
          </div>
        )}
      </div>

      {/* New Appointment Modal */}
      <NewAppointmentModal departments={departments} doctors={doctors} />
    </div>
  );
}