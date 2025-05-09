import useIsMobile from "@/hooks/useIsMobile";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAppContext } from "@/context";

export default function NavBar() {
    const isMobile = useIsMobile();
    const { orgName }=useAppContext()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <Heart className="h-8 w-8 text-pink-800" />
                            <span className="ml-2 text-xl font-bold text-pink-800">{orgName}</span>
                        </div>

                        {!isMobile && (
                            <div className="hidden md:ml-6 md:flex md:space-x-8">
                                <a href="#services" className="border-transparent text-gray-700 hover:text-pink-800 inline-flex items-center px-1 pt-1 text-sm font-medium">
                                    Services
                                </a>
                                <a href="#doctors" className="border-transparent text-gray-700 hover:text-pink-800 inline-flex items-center px-1 pt-1 text-sm font-medium">
                                    Our Doctors
                                </a>
                                <a href="#testimonials" className="border-transparent text-gray-700 hover:text-pink-800 inline-flex items-center px-1 pt-1 text-sm font-medium">
                                    Testimonials
                                </a>
                                <a href="#contact" className="border-transparent text-gray-700 hover:text-pink-800 inline-flex items-center px-1 pt-1 text-sm font-medium">
                                    Contact
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center">
                        {!isMobile ? (
                            <div className="flex space-x-4">
                                {/* <Link to="/signin">
                                    <Button variant="outline" className="border-pink-800 text-pink-800 hover:bg-pink-50">
                                        Sign In
                                    </Button>
                                </Link> */}
                                <Link to="/signin">
                                    <Button className="bg-pink-800 hover:bg-pink-700 text-white">
                                        Sign In
                                    </Button>
                                </Link>
                                 {/* <Link to="/signup">
                                    <Button className="bg-pink-800 hover:bg-pink-700 text-white">
                                        Register
                                    </Button>
                                </Link> */}
                            </div>
                        ) : (
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-md text-gray-600 hover:text-pink-800 focus:outline-none"
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobile && mobileMenuOpen && (
                <div className="md:hidden bg-white pt-2 pb-4 px-4">
                    <div className="flex flex-col space-y-2">
                        <a href="#services" className="text-gray-700 hover:text-pink-800 block px-3 py-2 text-base font-medium"
                            onClick={() => setMobileMenuOpen(false)}>
                            Services
                        </a>
                        <a href="#doctors" className="text-gray-700 hover:text-pink-800 block px-3 py-2 text-base font-medium"
                            onClick={() => setMobileMenuOpen(false)}>
                            Our Doctors
                        </a>
                        <a href="#testimonials" className="text-gray-700 hover:text-pink-800 block px-3 py-2 text-base font-medium"
                            onClick={() => setMobileMenuOpen(false)}>
                            Testimonials
                        </a>
                        <a href="#contact" className="text-gray-700 hover:text-pink-800 block px-3 py-2 text-base font-medium"
                            onClick={() => setMobileMenuOpen(false)}>
                            Contact
                        </a>
                        <div className="pt-3 border-t border-gray-200">
                            {/* <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full mb-2 border-pink-800 text-pink-800 hover:bg-pink-50">
                                    Sign In
                                </Button>
                            </Link> */}
                            <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full bg-pink-800 hover:bg-pink-700 text-white">
                                    Sign In
                                </Button>
                            </Link>
                            {/* <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full bg-pink-800 hover:bg-pink-700 text-white">
                                    Register
                                </Button>
                            </Link> */}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}