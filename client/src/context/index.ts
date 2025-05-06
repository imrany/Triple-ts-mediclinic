import React, { createContext, useContext } from 'react';

interface AppContextType {
    state: string;
    api_url:string;
    setState: React.Dispatch<React.SetStateAction<string>>;
    isNewAppointmentModalOpen:boolean, 
    setIsNewAppointmentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isNewDoctorModalOpen:boolean,
    setIsNewDoctorModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isNewPatientModalOpen:boolean,
    setIsNewPatientModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};