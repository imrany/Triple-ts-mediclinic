import { useAppContext } from "@/context";
import { Button } from "./ui/button";
import { Calendar, FileText, MapPin, Search, Users } from "lucide-react";

export default function Hero() {
    const { setIsNewAppointmentModalOpen, orgName }=useAppContext()
    return (
        <div className="bg-[url('/doctor.jpg')] bg-cover bg-no-repeat bg-center py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="md:w-1/2 pr-2 text-white">
                        <h1 className="text-4xl font-bold mb-4">Welcome to {orgName}</h1>
                        <p className="text-lg mb-8 text-gray-100">
                            Your trusted partner for quality healthcare services in Tharaka Nithi County
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <Button onClick={() => setIsNewAppointmentModalOpen(true)} className="bg-white text-pink-800 hover:bg-pink-50 px-6 py-3 text-base font-medium rounded">
                                Book Appointment
                            </Button>

                            <Button onClick={()=>window.location.href="#services"} variant="outline" className="text-white hover:text-white px-6 py-3 text-base font-medium rounded">
                                Our Services
                            </Button>
                        </div>
                    </div>
                    <div className="mt-8 md:mt-0 md:w-1/2">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-pink-800 mb-4">Find Our Services</h2>
                            <div className="flex mb-4">
                                <input
                                    type="text"
                                    placeholder="Search for services..."
                                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                                <button className="bg-pink-800 text-white px-4 py-2 rounded-r hover:bg-pink-700">
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                                <div className="bg-pink-50 p-3 rounded flex items-center text-pink-800 hover:bg-pink-100 cursor-pointer">
                                    <Calendar className="h-5 w-5 mr-2" />
                                    <span>Appointments</span>
                                </div>
                                <div className="bg-pink-50 p-3 rounded flex items-center text-pink-800 hover:bg-pink-100 cursor-pointer">
                                    <Users className="h-5 w-5 mr-2" />
                                    <span>Specialists</span>
                                </div>
                                <div className="bg-pink-50 p-3 rounded flex items-center text-pink-800 hover:bg-pink-100 cursor-pointer">
                                    <FileText className="h-5 w-5 mr-2" />
                                    <span>Medical Records</span>
                                </div>
                                <div className="bg-pink-50 p-3 rounded flex items-center text-pink-800 hover:bg-pink-100 cursor-pointer">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    <span>Find Location</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
