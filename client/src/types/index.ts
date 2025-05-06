export type Doctor = {
    id: number;
    name: string;
    department: string;
    available: boolean;
    email:string;
    phone:string;
    experience:number;
    image:string;
    bio:string;
    specialization:string;
};

export type Department = {
    id: number;
    name: string;
};
