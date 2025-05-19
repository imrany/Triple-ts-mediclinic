-- +goose Up
CREATE TABLE staff (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    national_id INT NOT NULL UNIQUE, 
    address TEXT NOT NULL,
    biography TEXT,
    photo TEXT,
    department TEXT NOT NULL,
    specialty TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT DEFAULT 'active',
    role TEXT DEFAULT 'user',
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email TEXT UNIQUE NOT NULL,
    experience TEXT DEFAULT '0-5 years'
);
CREATE INDEX idx_staff_email ON staff(email);
CREATE INDEX idx_staff_phone_number ON staff(phone_number);

-- Create patients table
CREATE TABLE patients (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    national_id INT NOT NULL UNIQUE,
    address TEXT NOT NULL,
    gender TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    department TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_patients_phone_number ON patients(phone_number);
CREATE INDEX idx_patients_email ON patients(email);

-- Create appointments table
CREATE TABLE appointments (
    id TEXT PRIMARY KEY,
    patient_national_id INT NOT NULL,
    patient_name TEXT NOT NULL,
    patient_address TEXT NOT NULL,
    patient_phone_number TEXT NOT NULL,
    patient_email TEXT,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    department TEXT NOT NULL,
    staff_id TEXT NOT NULL REFERENCES staff(id),
    notes TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_national_id);
CREATE INDEX idx_appointments_staff_id ON appointments(staff_id);
CREATE INDEX idx_appointments_appointment_date ON appointments(appointment_date);

-- Create notifications table
CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES staff(id),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create pharmacy table
CREATE TABLE pharmacy (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_pharmacy_name ON pharmacy(name);
CREATE INDEX idx_pharmacy_price ON pharmacy(price);

-- Create laboratory table
CREATE TABLE laboratory (
    id TEXT PRIMARY KEY,
    test_name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_laboratory_test_name ON laboratory(test_name);
CREATE INDEX idx_laboratory_price ON laboratory(price);

-- Create billing table
CREATE TABLE billing (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id),
    phone_number TEXT NOT NULL,
    appointment_id TEXT NOT NULL REFERENCES appointments(id),
    amount DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_billing_patient_id ON billing(patient_id);
CREATE INDEX idx_billing_appointment_id ON billing(appointment_id);
CREATE INDEX idx_billing_status ON billing(status);

-- Create medical_records table
CREATE TABLE medical_records (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL REFERENCES patients(id),
    staff_id TEXT NOT NULL REFERENCES staff(id),
    diagnosis TEXT NOT NULL,
    treatment TEXT NOT NULL,
    prescription TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
