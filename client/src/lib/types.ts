// Types matching the Go API (snake_case JSON keys)

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  national_id: number;
  address: string;
  gender: string;
  status: string;
  department: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_national_id: number;
  patient_name: string;
  patient_address: string;
  patient_phone_number: string;
  patient_email?: string | null;
  appointment_date: string;
  appointment_time: string;
  department: string;
  staff_id: string;
  notes?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  national_id: number;
  address: string;
  biography?: string | null;
  photo?: string | null;
  department: string;
  specialty: string;
  start_date: string;
  end_date?: string | null;
  status: string;
  role: string;
  email: string;
  created_at: string;
  updated_at: string;
  experience: string;
}

// API response shapes
export interface AppointmentWithStaff {
  appointment: Appointment;
  staff: {
    first_name: string;
    last_name: string;
    phone_number: string;
    photo?: string | null;
    department: string;
    specialty: string;
    role: string;
    email: string;
    status: string;
    experience: string;
  };
}

export interface PatientWithAppointments {
  patient: Patient;
  appointments: Appointment[];
}

export interface CreatePatientPayload {
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  national_id: number;
  address: string;
  gender: string;
  status: string;
  department: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentPayload {
  patient_national_id: number;
  patient_name: string;
  patient_address: string;
  patient_phone_number: string;
  patient_email?: string;
  appointment_date: string;
  appointment_time: string;
  department: string;
  staff_id: string;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStaffPayload {
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  national_id: number;
  address: string;
  biography?: string;
  photo?: string;
  department: string;
  specialty: string;
  start_date: string;
  end_date?: string;
  status: string;
  role: string;
  email: string;
  password: string;
  experience: string;
  created_at: string;
  updated_at: string;
}
