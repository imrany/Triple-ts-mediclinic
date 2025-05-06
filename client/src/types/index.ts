export type Doctors={
    name:string;
    specialization:string;
    experience:string;
    image:string;
    bio:string;
}
export type Doctor = {
    id: number;
    name: string;
    department: string;
    available: boolean;
};

export type Department = {
    id: number;
    name: string;
};
