import { X } from 'lucide-react';
import { useAppContext } from '@/context';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface NewStaffProps {
  departments: string[];
  roles: string[];
  specialties: string[];
}

const NewStaff: React.FC<NewStaffProps> = ({ departments, roles, specialties }) => {
  const { api_url, authData, isNewStaffModalOpen, setIsNewStaffModalOpen, fetchStaffAndDepartments } = useAppContext();
  const [activeTab, setActiveTab] = useState<'first' | 'second'>('first');

  // Form state
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [nationalId, setNationalId] = useState<number | null>(null);
  const [department, setDepartment] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [specialty, setSpecialty] = useState<string>("");
  const [biography, setBiography] = useState<string>("");
  const [photo, setPhoto] = useState<string>("");
  const [status, setStatus] = useState<string>("active");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  
  // Loading and validation states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  // Reset form when modal is closed
  useEffect(() => {
    if (!isNewStaffModalOpen) {
      resetForm();
    }
  }, [isNewStaffModalOpen]);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setAddress("");
    setDateOfBirth("");
    setNationalId(null);
    setDepartment("");
    setRole("");
    setSpecialty("");
    setBiography("");
    setPhoto("");
    setStatus("active");
    setStartDate("");
    setEndDate("");
    setPassword("");
    setExperience("");
    setEmailError("");
    setPhoneError("");
    setPasswordError("");
  };

  if (!isNewStaffModalOpen) return null;

  const validateEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneFormat = (phone: string): boolean => {
    const phoneRegex = /^\+?[0-9]{10,14}$/;
    return phoneRegex.test(phone);
  };

  const validatePasswordFormat = (password: string): boolean => {
    return password.length >= 8;
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

  const validatePassword = (password: string): boolean => {
    const isValid = validatePasswordFormat(password);
    setPasswordError(isValid ? "" : "Password must be at least 8 characters long");
    return isValid;
  };

  const validateFirstTabForm = (): boolean => {
    const isEmailValid = validateEmailFormat(email);
    const isPhoneValid = validatePhoneFormat(phoneNumber);
    const isPasswordValid = validatePasswordFormat(password);

    return !!(
      firstName.trim() &&
      lastName.trim() &&
      nationalId &&
      nationalId >= 10000000 &&
      nationalId <= 99999999 &&
      isEmailValid &&
      isPhoneValid &&
      isPasswordValid
    );
  };

  const validateFullForm = (): boolean => {
    const isEmailValid = validateEmailFormat(email);
    const isPhoneValid = validatePhoneFormat(phoneNumber);
    const isPasswordValid = validatePasswordFormat(password);

    // Create an age validation based on date of birth
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const isValidAge = age >= 18 && age <= 80; // Staff should be adults

    return !!(
      firstName.trim() &&
      lastName.trim() &&
      dateOfBirth &&
      isValidAge &&
      nationalId &&
      nationalId >= 10000000 &&
      nationalId <= 99999999 &&
      address.trim() &&
      department &&
      role &&
      specialty &&
      startDate &&
      isEmailValid &&
      isPhoneValid &&
      isPasswordValid
    );
  };

  const handleCloseModal = () => {
    setIsNewStaffModalOpen(false);
  };

  const handleModalBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

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

  const staffAge = calculateAge();
  const isValidAge = staffAge !== null && staffAge >= 18 && staffAge <= 80;

  async function handleSubmitStaff(e: React.FormEvent) {
    e.preventDefault();

    if (!validateFullForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      setIsLoading(true);
      const currentDate = new Date();
      
      const staffData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone_number: phoneNumber,
        address: address.trim(),
        date_of_birth: dateOfBirth ? new Date(`${dateOfBirth}T00:00:00Z`).toISOString() : undefined,
        national_id: nationalId,
        department: department,
        role: role,
        specialty: specialty,
        biography: biography.trim() || undefined,
        photo: photo.trim() || "no image",
        status: status,
        start_date: startDate ? new Date(`${startDate}T00:00:00Z`).toISOString() : undefined,
        end_date: endDate ? new Date(`${endDate}T00:00:00Z`).toISOString() : undefined,
        password: password,
        experience: experience.trim() || undefined,
        created_at: currentDate.toISOString(),
        updated_at: currentDate.toISOString(),
      };

      const response = await fetch(`${api_url}/api/staff`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authData?.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(staffData)
      });

      const parseRes = await response.json();
      if (parseRes.error) {
        toast.error(parseRes.error, {
          description:parseRes.details?parseRes.details:"",
          action: {
            label: "Retry",
            onClick: () => handleSubmitStaff(e)
          },
        });
      } else {
        toast.success(parseRes.message || "Staff member added successfully");
        resetForm();
        fetchStaffAndDepartments();
        handleCloseModal();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error("Something went wrong!", {
        description: errorMessage,
        action: {
          label: "Retry",
          onClick: () => handleSubmitStaff(e)
        },
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50"
      onDoubleClick={handleModalBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Add New Staff Member</h3>
          <button
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700"
            type="button"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">Fill in the details below to register a new staff member.</p>
        
        <form onSubmit={handleSubmitStaff} className="space-y-4">
          <div className="flex border-b border-gray-300 mb-4">
            <button
              type="button"
              className={`flex-1 py-2 text-center font-medium hover:border-gray-300 text-gray-700 border-b-2 ${activeTab === "first" ? "border-blue-500" : "border-transparent"}`}
              onClick={() => setActiveTab('first')}
            >
              Personal Info
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-center font-medium hover:border-gray-300 text-gray-700 border-b-2 ${activeTab === "second" ? "border-blue-500" : "border-transparent"}`}
              onClick={() => {
                if (validateFirstTabForm()) {
                  setActiveTab('second');
                }
              }}
              disabled={!validateFirstTabForm()}
            >
              Professional Info
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  id="password"
                  type="password"
                  className={`w-full border ${passwordError ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2`}
                  placeholder="Enter password (min. 8 characters)"
                  value={password}
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                  }}
                  onBlur={(e) => validatePassword(e.target.value)}
                />
                {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
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
                  disabled={!validateFirstTabForm()}
                  className={`px-4 py-2 ${!validateFirstTabForm() ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white rounded-lg ${!validateFirstTabForm() ? "opacity-50 cursor-not-allowed" : ""}`}
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
                  required
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
                {staffAge !== null && (
                  <p className={`text-xs mt-1 ${!isValidAge ? "text-red-500" : "text-gray-500"}`}>
                    Age: {staffAge} years {!isValidAge && "- Staff must be between 18-80 years old"}
                  </p>
                )}
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
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Select Role</option>
                    {roles && Array.isArray(roles) ? roles.map((r: string, index: number) => (
                      <option key={index} value={r}>{r}</option>
                    )) : (
                      <>
                        <option value="Doctor">Doctor</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Admin">Admin</option>
                        <option value="Technician">Technician</option>
                        <option value="Receptionist">Receptionist</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">Specialty *</label>
                <select
                  id="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Select Specialty</option>
                  {specialties && Array.isArray(specialties) ? specialties.map((spec: string, index: number) => (
                    <option key={index} value={spec}>{spec}</option>
                  )) : (
                    <>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Administration">Administration</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    id="start-date"
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    required
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

                <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                <select
                  id="experience"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  <option value="">Select experience range</option>
                  <option value="0-5 years">0-5 years</option>
                  <option value="6-10 years">6-10 years</option>
                  <option value="11-15 years">11-15 years</option>
                  <option value="16+ years">16+ years</option>
                </select>
                </div>

              <div>
                <label htmlFor="biography" className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
                <textarea
                  id="biography"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
                  placeholder="Enter brief biography (optional)"
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                />
              </div>

              {/* <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                <input
                  id="photo"
                  type="url"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter photo URL (optional)"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                />
              </div> */}

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
                  disabled={isLoading || !validateFullForm()}
                  className={`px-4 py-2 ${isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white rounded-lg ${!validateFullForm() ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? "Adding..." : "Add Staff Member"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewStaff;