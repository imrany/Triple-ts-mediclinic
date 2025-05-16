import { X } from 'lucide-react';
import { useAppContext } from '@/context';
import { Staff } from '@/types';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface NewAppointmentModalProps {
  departments: string[];
  doctors: Staff[];
  actions: {
    fetchAppointments: () => Promise<void>;
  }
}

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ departments, doctors, actions }) => {
  const { api_url, authData, isNewAppointmentModalOpen, setIsNewAppointmentModalOpen } = useAppContext();
  const [activeTab, setActiveTab] = useState<'patient' | 'appointment'>('patient');
  const [patientName, setPatientName] = useState<string>("");
  const [patientNationalID, setPatientNationalID] = useState<number | null>(null);
  const [patientPhoneNumber, setPatientPhone] = useState<string>("");
  const [patientAddress, setPatientAddress] = useState<string>("");
  const [patientEmail, setPatientEmail] = useState<string>("");
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [staffID, setStaffID] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");

  // Reset form when modal is closed
  useEffect(() => {
    if (!isNewAppointmentModalOpen) {
      resetForm();
    }
  }, [isNewAppointmentModalOpen]);

  // Reset department selection when department changes
  useEffect(() => {
    setStaffID("");
  }, [department]);

  const resetForm = () => {
    setActiveTab('patient');
    setPatientName("");
    setPatientNationalID(null);
    setPatientPhone("");
    setPatientAddress("");
    setPatientEmail("");
    setAppointmentDate("");
    setAppointmentTime("");
    setDepartment("");
    setStaffID("");
    setNotes("");
    setEmailError("");
    setPhoneError("");
  };

  if (!isNewAppointmentModalOpen) return null;

  const validateEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneFormat = (phone: string): boolean => {
    const phoneRegex = /^\+?[0-9]{10,14}$/;
    return phoneRegex.test(phone);
  };
  
  const validateEmail = (email: string): boolean => {
    const isValid = validateEmailFormat(email);
    setEmailError(isValid ? "" : "Please enter a valid email address");
    return isValid;
  };

  const validatePhone = (phone: string): boolean => {
    const isValid = validatePhoneFormat(phone);
    setPhoneError(isValid ? "" : "Please enter a valid phone number (10-14 digits)");
    return isValid;
  };

  const validatePatientForm = (): boolean => {
    // Don't call validateEmail/validatePhone directly here, as they set state and cause re-renders
    const isEmailValid = validateEmailFormat(patientEmail);
    const isPhoneValid = validatePhoneFormat(patientPhoneNumber);

    return !!(
      patientName.trim() &&
      patientNationalID &&
      patientNationalID >= 10000000 &&
      patientNationalID <= 99999999 &&
      patientAddress.trim() &&
      isEmailValid &&
      isPhoneValid
    );
  };

  const validateAppointmentDetails = (): boolean => {
    return !!(
      appointmentDate &&
      appointmentTime &&
      department &&
      staffID &&
      notes.trim()
    );
  };

  const handleCloseModal = () => {
    setIsNewAppointmentModalOpen(false);
  };

  const handleModalBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  async function handleSubmitAppointment(e: React.FormEvent) {
    e.preventDefault();

    if (!validatePatientForm() || !validateAppointmentDetails()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    // Check if appointment date is valid (not in the past)
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    const now = new Date();
    if (appointmentDateTime < now) {
      toast.error("Appointment time cannot be in the past");
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
          patient_name: patientName.trim(),
          patient_address: patientAddress.trim(),
          patient_phone_number: patientPhoneNumber,
          patient_email: patientEmail.trim(),
          appointment_date: appointmentDateTime.toISOString(),
          appointment_time: appointmentTime,
          department: department,
          staff_id: staffID,
          notes: notes.trim(),
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
        resetForm();
        handleCloseModal();
        actions.fetchAppointments();
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

  const filteredDoctors = doctors && Array.isArray(doctors) ? doctors.filter((doctor: Staff) => {
    return doctor.status === "active" && 
           (!department || doctor.department === department);
  }) : [];

  return (
    <div
      className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleModalBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Schedule New Appointment</h3>
          <button
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700"
            type="button"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-gray-600 mb-4">Fill in the details below to schedule a new appointment.</p>
        <form onSubmit={handleSubmitAppointment} className="space-y-4">
          <div className="flex border-b border-gray-300 mb-4">
            <button
              type="button"
              className={`flex-1 py-2 text-center font-medium hover:border-gray-300 text-gray-700 border-b-2 ${activeTab === "patient" ? "border-blue-500" : "border-transparent"}`}
              onClick={() => setActiveTab('patient')}
            >
              Patient Info
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-center font-medium hover:border-gray-300 text-gray-700 border-b-2 ${activeTab === "appointment" ? "border-blue-500" : "border-transparent"}`}
              onClick={() => {
                if (validatePatientForm()) {
                  setActiveTab('appointment');
                }
              }}
              disabled={!validatePatientForm()}
            >
              Appointment Details
            </button>
          </div>

          {activeTab === 'patient' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="patient-name" className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
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
                <label htmlFor="national-id" className="block text-sm font-medium text-gray-700 mb-1">National ID *</label>
                <input
                  id="national-id"
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter patient national ID"
                  required
                  min={10000000}
                  max={99999999}
                  value={patientNationalID || ''}
                  onChange={(e) => setPatientNationalID(e.target.value ? Number(e.target.value) : null)}
                />
              </div>

              <div>
                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  id="phone-number"
                  type="tel"
                  className={`w-full border ${phoneError ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2`}
                  placeholder="Enter patient phone number"
                  value={patientPhoneNumber}
                  required
                  onChange={(e) => {
                    setPatientPhone(e.target.value);
                    if (phoneError) validatePhone(e.target.value);
                  }}
                  onBlur={(e) => validatePhone(e.target.value)}
                />
                {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
              </div>

              <div>
                <label htmlFor="patient-address" className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
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
                <label htmlFor="patient-email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  id="patient-email"
                  type="email"
                  className={`w-full border ${emailError ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2`}
                  placeholder="Enter patient email address"
                  value={patientEmail}
                  required
                  onChange={(e) => {
                    setPatientEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  onBlur={(e) => validateEmail(e.target.value)}
                />
                {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!validatePatientForm()}
                  onClick={() => {
                    if (validatePatientForm()) {
                      setActiveTab('appointment');
                    }
                  }}
                  className={`px-4 py-2 ${!validatePatientForm() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 cursor-pointer"} text-white rounded-lg`}
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
                  <label htmlFor="appointment-date" className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    id="appointment-date"
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={appointmentDate}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    onChange={(e) => setAppointmentDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="appointment-time" className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                  <input
                    id="appointment-time"
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={appointmentTime}
                    required
                    onChange={(e) => setAppointmentTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Department</option>
                  {departments && Array.isArray(departments) ? departments.map((dept: string, index: number) => (
                    <option key={index} value={dept}>{dept}</option>
                  )) : null}
                </select>
              </div>

              <div>
                <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-1">Doctor *</label>
                <select
                  id="doctor"
                  value={staffID}
                  onChange={(e) => setStaffID(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                  disabled={!department}
                >
                  <option value="">Select Doctor</option>
                  {filteredDoctors.map((doctor: Staff) => (
                    <option key={doctor.id} value={doctor.id}>{`${doctor.firstName} ${doctor.lastName}`}</option>
                  ))}
                </select>
                {department && filteredDoctors.length === 0 && (
                  <p className="text-amber-500 text-xs mt-1">No active doctors available in this department</p>
                )}
              </div>

              <div>
                <label htmlFor="appointment-notes" className="block text-sm font-medium text-gray-700 mb-1">Appointment Notes *</label>
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
                  disabled={isLoading || !validateAppointmentDetails()}
                  className={`px-4 py-2 ${isLoading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"} text-white rounded-lg ${!validateAppointmentDetails() ? "opacity-50 cursor-not-allowed" : ""}`}
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

export default NewAppointmentModal