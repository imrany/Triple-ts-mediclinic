import { X } from 'lucide-react';
import { useAppContext } from '@/context';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface NewPatientProps {
  departments: string[];
  actions: {
    fetchPatients: () => Promise<void>;
  }
}

const NewPatient: React.FC<NewPatientProps> = ({ departments, actions }) => {
  const { api_url, authData, isNewPatientModalOpen, setIsNewPatientModalOpen } = useAppContext();
  const [activeTab, setActiveTab] = useState<'first' | 'second'>('first');
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [nationalId, setNationalId] = useState<number | null>(null);
  const [address, setAddress] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");

  // Reset form when modal is closed
  useEffect(() => {
    if (!isNewPatientModalOpen) {
      resetForm();
    }
  }, [isNewPatientModalOpen]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setDateOfBirth("");
    setNationalId(null);
    setAddress("");
    setGender("");
    setDepartment("");
    setEmail("");
    setEmailError("");
    setPhoneError("");
  };

  if (!isNewPatientModalOpen) return null;

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

  const validateForm = (): boolean => {
    const isEmailValid = validateEmailFormat(email);
    const isPhoneValid = validatePhoneFormat(phoneNumber);

    // Create an age validation based on date of birth
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const isValidAge = age >= 0 && age <= 120;

    return !!(
      firstName.trim() &&
      lastName.trim() &&
      dateOfBirth &&
      isValidAge &&
      nationalId &&
      nationalId >= 10000000 &&
      nationalId <= 99999999 &&
      address.trim() &&
      gender &&
      department &&
      isEmailValid &&
      isPhoneValid
    );
  };

  const handleCloseModal = () => {
    setIsNewPatientModalOpen(false);
  };

  const handleModalBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  async function handleSubmitPatient(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      setIsLoading(true);
      const currentDate = new Date();
      const response = await fetch(`${api_url}/api/patients`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authData?.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone_number: phoneNumber,
          date_of_birth: dateOfBirth ? new Date(`${dateOfBirth}T00:00:00Z`).toISOString() : undefined,
          national_id: nationalId,
          address: address.trim(),
          gender: gender,
          status: "active",
          department: department,
          email: email.trim(),
          created_at: currentDate.toISOString(),
          updated_at: currentDate.toISOString(),
        })
      });

      const parseRes = await response.json();

      if (parseRes.error) {
        toast.error(parseRes.error, {
          description:parseRes.details?parseRes.details:"An error occurred while adding the patient.",
          duration: 5000,
          action: {
            label: "Retry",
            onClick: () => handleSubmitPatient(e)
          },
        });
      } else {
        toast.success(parseRes.message);
        resetForm();
        handleCloseModal();
        actions.fetchPatients();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error("Something went wrong!", {
        description: errorMessage,
        action: {
          label: "Retry",
          onClick: () => handleSubmitPatient(e)
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  const calculateAge = () => {
    if (!dateOfBirth) return null;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const patientAge = calculateAge();
  const isValidAge = patientAge !== null && patientAge >= 0 && patientAge <= 120;

  const validatePatientForm = (): boolean => {
    const isEmailValid = validateEmailFormat(email);
    const isPhoneValid = validatePhoneFormat(phoneNumber);

    return !!(
      firstName.trim() &&
      lastName.trim() &&
      nationalId &&
      nationalId >= 10000000 &&
      nationalId <= 99999999 &&
      isEmailValid &&
      isPhoneValid
    );
  };

  return (
    <div
      className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50"
      onDoubleClick={handleModalBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Add New Patient</h3>
          <button
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700"
            type="button"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-gray-600 mb-4">Fill in the details below to register a new patient.</p>
        <form onSubmit={handleSubmitPatient} className="space-y-4">
          <div className="flex border-b border-gray-300 mb-4">
            <button
              type="button"
              className={`flex-1 py-2 text-center font-medium hover:border-gray-300 text-gray-700 border-b-2 ${activeTab === "first" ? "border-blue-500" : "border-transparent"}`}
              onClick={() => setActiveTab('first')}
            >
              First Tab
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-center font-medium hover:border-gray-300 text-gray-700 border-b-2 ${activeTab === "second" ? "border-blue-500" : "border-transparent"}`}
              onClick={() => {
                if (validatePatientForm()) {
                  setActiveTab('second');
                }
              }}
              disabled={!validatePatientForm()}
            >
              Second Tab
            </button>
          </div>
          {activeTab === 'first' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    id="first-name"
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter first name"
                    value={firstName}
                    required
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    id="last-name"
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Enter last name"
                    value={lastName}
                    required
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="national-id" className="block text-sm font-medium text-gray-700 mb-1">National ID *</label>
                <input
                  id="national-id"
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter national ID"
                  required
                  min={10000000}
                  max={99999999}
                  value={nationalId || ''}
                  onChange={(e) => setNationalId(e.target.value ? Number(e.target.value) : null)}
                />
              </div>

              <div>
                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  id="phone-number"
                  type="tel"
                  className={`w-full border ${phoneError ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2`}
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  required
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (phoneError) validatePhone(e.target.value);
                  }}
                  onBlur={(e) => validatePhone(e.target.value)}
                />
                {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  id="email"
                  type="email"
                  className={`w-full border ${emailError ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2`}
                  placeholder="Enter email address"
                  value={email}
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
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
                  onClick={() => setActiveTab("second")}
                  disabled={!validatePatientForm()}
                  className={`px-4 py-2 ${!validatePatientForm() ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-600/80"} text-white rounded-lg ${!validatePatientForm() ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Next
                </button>
              </div>
            </>
          )}
          {activeTab === 'second' && (
            <>
              <div>
                <label htmlFor="date-of-birth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input
                  id="date-of-birth"
                  type="date"
                  className={`w-full border ${!isValidAge && dateOfBirth ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2`}
                  value={dateOfBirth}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
                {patientAge !== null && (
                  <p className={`text-xs mt-1 ${!isValidAge ? "text-red-500" : "text-gray-500"}`}>
                    Age: {patientAge} years {!isValidAge && "- Please enter a valid date of birth"}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
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
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  id="address"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                  placeholder="Enter full address"
                  value={address}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>
              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("first")}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !validateForm()}
                  className={`px-4 py-2 ${isLoading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"} text-white rounded-lg ${!validateForm() ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? "Adding..." : "Add Patient"}
                </button>
              </div>
            </>
          )}



        </form>
      </div>
    </div>
  );
};

export default NewPatient;