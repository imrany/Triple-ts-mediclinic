import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Hero() {
    return (
        <div className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-green-50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 pb-10 md:pb-0">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Your Health, <span className="text-green-800">Our Priority</span>
                        </h1>
                        <p className="text-lg max-sm:text-base text-gray-600 mb-8">
                            Experience healthcare reimagined with MediCare's comprehensive medical system.
                            Schedule appointments, access your records, and connect with top healthcare
                            professionals all in one place.
                        </p>
                        <div className="flex flex-row gap-4">
                            <Link to="/signup">
                                <Button className="bg-green-800 hover:bg-green-700 text-white">
                                    Get Started
                                </Button>
                            </Link>
                            <a href="#contact">
                                <Button variant="outline" className="border-green-800 text-green-800 hover:bg-green-50">
                                    Contact Us
                                </Button>
                            </a>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        <img
                            src="/api/placeholder/600/400"
                            alt="Medical professionals"
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
