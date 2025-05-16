import useIsMobile from "@/hooks/useIsMobile";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAppContext } from "@/context";

export default function NavBar() {
    const isMobile = useIsMobile();
    const { orgName, setIsNewAppointmentModalOpen } = useAppContext()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <nav className="bg-gray-100 shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link to="/">
                                <div className="flex items-center">
                                    <div className="h-12 w-12 bg-pink-800 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
                                        TTS
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-pink-800">{`${orgName.trim().split(" ")[0]} ${orgName.trim().split(" ")[1].toUpperCase()}`}</h1>
                                        <p className="text-sm text-gray-600">MediClinic</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="font-medium text-pink-800 hover:text-pink-600">Home</Link>
                        <a href="#services" className="font-medium text-gray-600 hover:text-pink-600">Services</a>
                        <a href="#doctors" className="font-medium text-gray-600 hover:text-pink-600">Doctors</a>
                        <a href="#contact" className="font-medium text-gray-600 hover:text-pink-600">Contact</a>
                        <button onClick={() => setIsNewAppointmentModalOpen(true)} className="bg-pink-800 text-white px-4 py-2 rounded hover:bg-pink-700 transition">
                            Book Appointment
                        </button>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 hover:text-pink-800">
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isMobile && mobileMenuOpen && (
                <div className="md:hidden bg-gray-100 pt-2 pb-4 px-4">
                    <div className="flex flex-col space-y-2">
                        <a href="#services" className="text-gray-700 hover:text-pink-800 block px-3 py-2 text-base font-medium"
                            onClick={() => setMobileMenuOpen(false)}>
                            Services
                        </a>
                        <a href="#doctors" className="text-gray-700 hover:text-pink-800 block px-3 py-2 text-base font-medium"
                            onClick={() => setMobileMenuOpen(false)}>
                            Our Doctors
                        </a>
                        <a href="#contact" className="text-gray-700 hover:text-pink-800 block px-3 py-2 text-base font-medium"
                            onClick={() => setMobileMenuOpen(false)}>
                            Contact
                        </a>
                        <div className="pt-3 border-t border-gray-200">
                            <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full bg-pink-800 hover:bg-pink-700 text-white">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}