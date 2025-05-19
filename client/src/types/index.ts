export interface AppointmentData {
    day:string
    count:number
}

export interface Appointment{
    id: string;
    patientNationalID: number;
    patientName: string;
    patientAddress: string;
    patientPhoneNumber: string;
    patientEmail?: string;
    appointmentDate: string;
    appointmentTime: string;
    department: string;
    staffId: string;
    notes?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface DepartmentStats {
    name:string,
    patients:number,
}

export interface Staff {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
    nationalId: number;
    department: string;
    role: string;
    specialty: string;
    biography?: string;
    photo?: string;
    status: string;
    startDate: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
    password?: string;
    experience?:string
}

export type AuthData ={
    email:string,
    user_id:string,
    token:string,
}


export interface Patient {
	id :string    
	firstName:string 
	lastName :string   
	phoneNumber :string    
	dateOfBirth: string   
	nationalID: number       
	address  :string    
	gender   :string    
	status   :string    
	department: string   
	email    :string    
	createdAt:string    
	updatedAt:string 
    appointments?:any   
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  type: string;
  diagnosis: string;
  doctor: string;
}