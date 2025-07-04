import { AuthData, Staff, Patient } from '@/types';
import React, { createContext, useContext } from 'react';

interface AppContextType {
    orgName: string;
    setOrgName: React.Dispatch<React.SetStateAction<string>>;
    api_url:string;
    isNewAppointmentModalOpen:boolean, 
    setIsNewAppointmentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isNewStaffModalOpen:boolean,
    setIsNewStaffModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isNewPatientModalOpen:boolean,
    setIsNewPatientModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isNewMedicationModalOpen:boolean; 
    setIsNewMedicationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isNewTestModalOpen: boolean;
    setIsNewTestModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    staff:Staff | null,
    authData: AuthData | null,
    doctors: Staff[],
    departments:string[],
    patients:Patient[],
    roles:string[],
    specialities:string[],
    staffs:Staff[] | null,
    fetchStaffAndDepartments: ()=> Promise<void>
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};