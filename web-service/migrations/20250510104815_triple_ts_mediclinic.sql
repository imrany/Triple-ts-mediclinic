CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
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
    CONSTRAINT unique_staff UNIQUE (first_name, last_name, phone_number)
    email TEXT UNIQUE NOT NULL
);
CREATE INDEX idx_staff_name ON staff (id);
