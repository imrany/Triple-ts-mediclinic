export type Doctor = {
    id: string;
    name: string;
    department: string;
    available: boolean;
    email:string;
    phone:string;
    experience:number;
    image:string;
    bio:string;
    specialization:string;
    patients:any;
    rating:number
};

export type Department = {
    id: string;
    name: string;
};

export interface Appointment {
    id: string;
    title: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    date: Date;
    startTime: string;
    endTime: string;
    type: string;
    notes: string;
    status: string;
}


export interface Staff {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: Date;
    nationalId: number;
    department: string;
    role: string;
    specialty: string;
    biography?: string;
    photo?: string;
    status: string;
    startDate: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    password?: string;
}

export type AuthData ={
    email:string,
    user_id:string,
    token:string,
}
