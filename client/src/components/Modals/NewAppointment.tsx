import { X } from 'lucide-react';
import { useAppContext } from '@/context';
import { Staff } from '@/types';
import { useState } from 'react';
import { toast } from 'sonner';

interface NewAppointmentModalProps {
  departments: string[];
  doctors: Staff[];
}

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ departments, doctors }) => {
  const { api_url, authData } = useAppContext();
  const [activeTab, setActiveTab] = useState<'patient' | 'appointment'>('patient');
  const [patientName, setPatientName] = useState<string>("");
  const [patientNationalID, setPatientNationalID] = useState(0);
  const [patientPhoneNumber, setPatientPhoneNumber] = useState<string>("");
  const [patientAddress, setPatientAddress] = useState<string>("");
  const [patientEmail, setPatientEmail] = useState<string>("");
  const [appointmentDate, setAppointmentDate] = useState<string | null>(null);
  const [appointmentTime, setAppointmentTime] = useState<string | null>(null);
  const [department, setDepartment] = useState<string>("");
  const [staffID, setStaffID] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isNewAppointmentModalOpen, setIsNewAppointmentModalOpen } = useAppContext();

  if (!isNewAppointmentModalOpen) return null;

  const validateForm = () => {
    return !!(
      patientName &&
      patientNationalID &&
      patientPhoneNumber &&
      patientAddress &&
      patientEmail
    );
  };

  const validateAppointmentDetails = () => {
    return !!(
      appointmentDate &&
      appointmentTime &&
      department &&
      staffID &&
      notes
    );
  };

  async function handleSubmitAppointment(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm() || !validateAppointmentDetails()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const currentDate = new Date();
      const response = await fetch(`${api_url}/api/appointments`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authData?.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          patient_national_id: patientNationalID,
          patient_name: patientName,
          patient_address: patientAddress,
          patient_phone_number: patientPhoneNumber,
          patient_email: patientEmail,
          appointment_date: new Date(`${appointmentDate}T${appointmentTime}`).toISOString(),
          appointment_time: appointmentTime,
          department: department,
          staff_id: staffID,
          notes: notes,
          status: "Pending",
          createdAt: currentDate.toISOString(),
          updatedAt: currentDate.toISOString(),
        })
      });

      const parseRes = await response.json();

      if (parseRes.error) {
        toast.error(parseRes.error, {
          action: {
            label: "Retry",
            onClick: () => handleSubmitAppointment(e)
          },
        });
      } else {
        toast.success(parseRes.message);
        setIsNewAppointmentModalOpen(false);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error("Something went wrong!", {
        description: errorMessage,
        action: {
          label: "Retry",
          onClick: () => handleSubmitAppointment(e)
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Schedule New Appointment</h3>
          <button
            onClick={() => setIsNewAppointmentModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-gray-600 mb-4">Fill in the details below to schedule a new appointment.</p>
        <form onSubmit={handleSubmitAppointment} className="space-y-4">
          <div className="flex border-b border-gray-300 mb-4">
            <button
              type='button'
              className={`flex-1 py-2 text-center font-medium hover:border-gray-300 text-gray-700 border-b-2 ${activeTab === "patient" ? "border-blue-500" : "border-transparent"}`}
              onClick={() => setActiveTab('patient')}
            >
              Patient Info
            </button>
            <button
              type='button'
              className={`flex-1 py-2 text-center font-medium hover:border-gray-300 text-gray-700 border-b-2 ${activeTab === "appointment" ? "border-blue-500" : "border-transparent"}`}
              onClick={() => setActiveTab('appointment')}
              disabled={!validateForm()}
            >
              Appointment Details
            </button>
          </div>

          {activeTab === 'patient' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="patient-name" className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                <input
                  id="patient-name"
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter patient full name"
                  value={patientName}
                  required
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="national-id" className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                <input
                  id="national-id"
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter patient national ID"
                  required
                  min={10000000}
                  max={99999999}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatientNationalID(Number(e.target.value))}
                />
              </div>

              <div>
                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  id="phone-number"
                  type="tel"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter patient phone number"
                  value={patientPhoneNumber}
                  required
                  minLength={10}
                  maxLength={14}
                  onChange={(e) => setPatientPhoneNumber(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="patient-address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  id="patient-address"
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter patient location"
                  value={patientAddress}
                  required
                  onChange={(e) => setPatientAddress(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="patient-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="patient-email"
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter patient email address"
                  value={patientEmail}
                  required
                  onChange={(e) => setPatientEmail(e.target.value)}
                />
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
                  disabled={!validateForm()}
                  onClick={() => setActiveTab('appointment')}
                  className={`px-4 py-2 ${!validateForm() ? "cursor-not-allowed bg-gray-600 hover:bg-gray-600" : "bg-blue-500 cursor-pointer hover:bg-blue-600"} text-white rounded-lg`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appointment' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="appointment-date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    id="appointment-date"
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={appointmentDate || ''}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    onChange={(e) => setAppointmentDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="appointment-time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    id="appointment-time"
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={appointmentTime || ''}
                    required
                    onChange={(e) => setAppointmentTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept: string, index: number) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {department && department.length !== 0 && (<div>
                <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                <select
                  id="doctor"
                  value={staffID}
                  onChange={(e) => setStaffID(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors
                    .filter((doctor: Staff) => doctor.status === "active")
                    .map((doctor: Staff) => (
                      <option key={doctor.id} value={doctor.id}>{`${doctor.firstName} ${doctor.lastName}`}</option>
                    ))}
                </select>
              </div>)}

              <div>
                <label htmlFor="appointment-notes" className="block text-sm font-medium text-gray-700 mb-1">Appointment Notes</label>
                <textarea
                  id="appointment-notes"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                  placeholder="Add notes about the appointment"
                  value={notes}
                  required
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('patient')}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 ${isLoading ? "bg-blue-400" : "bg-blue-500"} text-white rounded-lg hover:bg-blue-600 ${!validateAppointmentDetails() ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {isLoading ? "Scheduling..." : "Schedule Appointment"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentModal;