
// Mock data for appointments
export const appointmentsData = [
  { id: 1, patient: 'Emma Wilson', time: '09:00 AM', date: '2025-05-06', doctor: 'Dr. Johnson', department: 'Cardiology', status: 'Confirmed', notes: 'Follow-up checkup' },
  { id: 2, patient: 'Michael Brown', time: '10:15 AM', date: '2025-05-06', doctor: 'Dr. Martinez', department: 'Neurology', status: 'Pending', notes: 'Initial consultation' },
  { id: 3, patient: 'Sophia Davis', time: '11:30 AM', date: '2025-05-06', doctor: 'Dr. Thompson', department: 'Pediatrics', status: 'Confirmed', notes: 'Vaccination' },
  { id: 4, patient: 'James Miller', time: '01:45 PM', date: '2025-05-06', doctor: 'Dr. Garcia', department: 'Orthopedics', status: 'Confirmed', notes: 'Post-surgery checkup' },
  { id: 5, patient: 'Olivia Taylor', time: '03:00 PM', date: '2025-05-06', doctor: 'Dr. Wilson', department: 'Dermatology', status: 'Pending', notes: 'Skin examination' },
  { id: 6, patient: 'Noah Johnson', time: '09:30 AM', date: '2025-05-07', doctor: 'Dr. Anderson', department: 'Cardiology', status: 'Confirmed', notes: 'ECG test' },
  { id: 7, patient: 'Ava Martinez', time: '11:00 AM', date: '2025-05-07', doctor: 'Dr. Thomas', department: 'Ophthalmology', status: 'Cancelled', notes: 'Eye examination' },
  { id: 8, patient: 'William Lee', time: '02:30 PM', date: '2025-05-07', doctor: 'Dr. White', department: 'Neurology', status: 'Confirmed', notes: 'MRI results discussion' },
  { id: 9, patient: 'Isabella Clark', time: '04:15 PM', date: '2025-05-07', doctor: 'Dr. Lewis', department: 'Pediatrics', status: 'Confirmed', notes: 'Annual checkup' },
  { id: 10, patient: 'Benjamin Adams', time: '10:45 AM', date: '2025-05-08', doctor: 'Dr. Hall', department: 'Orthopedics', status: 'Pending', notes: 'X-ray review' },
  { id: 11, patient: 'Mia Rodriguez', time: '01:00 PM', date: '2025-05-08', doctor: 'Dr. Moore', department: 'Dermatology', status: 'Confirmed', notes: 'Allergy testing' },
  { id: 12, patient: 'Alexander Walker', time: '03:30 PM', date: '2025-05-08', doctor: 'Dr. Johnson', department: 'Cardiology', status: 'Confirmed', notes: 'Blood pressure monitoring' },
];

// Mock data for doctors
export const doctors = [
  { id: 1, name: 'Dr. Johnson', department: 'Cardiology', available: true },
  { id: 2, name: 'Dr. Martinez', department: 'Neurology', available: true },
  { id: 3, name: 'Dr. Thompson', department: 'Pediatrics', available: true },
  { id: 4, name: 'Dr. Garcia', department: 'Orthopedics', available: false },
  { id: 5, name: 'Dr. Wilson', department: 'Dermatology', available: true },
  { id: 6, name: 'Dr. Anderson', department: 'Cardiology', available: true },
  { id: 7, name: 'Dr. Thomas', department: 'Ophthalmology', available: false },
  { id: 8, name: 'Dr. White', department: 'Neurology', available: true },
  { id: 9, name: 'Dr. Lewis', department: 'Pediatrics', available: true },
  { id: 10, name: 'Dr. Hall', department: 'Orthopedics', available: true },
];

// Mock data for departments
export const departments = [
  { id: 1, name: 'Cardiology' },
  { id: 2, name: 'Neurology' },
  { id: 3, name: 'Pediatrics' },
  { id: 4, name: 'Orthopedics' },
  { id: 5, name: 'Dermatology' },
  { id: 6, name: 'Ophthalmology' },
];