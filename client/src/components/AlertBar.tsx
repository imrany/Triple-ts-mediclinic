import useIsMobile from "@/hooks/useIsMobile";
import { AlertTriangle } from "lucide-react";

export default function AlertBar() {
    const isMobile = useIsMobile()
    const alertMessage = (
        <>
            {!isMobile ? (
                <p className="text-center">
                    System service unavailable. If you are the owner for contract renegotiation, contact our developer <a className="text-blue-500 underline" href="mailto:imranmat254@gmail.com?subject=Triple TS MediClinic Service Inquiry">here</a>
                </p>
            ) : (
                <p className="text-sm text-center">
                    Service unavailable. contact our developer <a className="text-blue-500 underline" href="mailto:imranmat254@gmail.com?subject=Triple TS MediClinic Service Inquiry">here</a>
                </p>
            )}
        </>
    )
    
    return (
        <div className="bg-white py-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="hover:text-pink-200 flex items-center gap-2">
                            <AlertTriangle width={16} height={16} />
                            {alertMessage}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}