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
