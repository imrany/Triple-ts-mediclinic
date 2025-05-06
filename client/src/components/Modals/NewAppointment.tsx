import { X } from 'lucide-react';
import { useAppContext } from '@/context';
import { Department, Doctor } from '@/types';

const NewAppointmentModal = ({ departments, doctors }:{ departments:Department[], doctors:Doctor[] }) => {
    const { isNewAppointmentModalOpen, setIsNewAppointmentModalOpen } = useAppContext();
    if (!isNewAppointmentModalOpen) return null;

    
    return (
      <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Schedule New Appointment</h3>
            <button 
              onClick={() => setIsNewAppointmentModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Search or select patient..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  defaultValue="2025-05-06"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input 
                  type="time" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  defaultValue="09:00"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">Select Doctor</option>
                {doctors.filter(doctor => doctor.available).map(doctor => (
                  <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Notes</label>
              <textarea 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                placeholder="Add notes about the appointment..."
              ></textarea>
            </div>
            
            <div className="pt-4 flex justify-end space-x-2">
              <button 
                type="button"
                onClick={() => setIsNewAppointmentModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={() => setIsNewAppointmentModalOpen(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Schedule Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default NewAppointmentModal;