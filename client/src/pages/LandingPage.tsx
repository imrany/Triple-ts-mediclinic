import { Link } from "react-router-dom";
import {
    Calendar,
    Users,
    PhoneCall,
    ArrowRight,
    Clock,
    Star,
    Shield,
    MapPin,
    Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";

export default function LandingPage() {
    return (
        <div className="font-[family-name:var(--font-geist-sans)] bg-pink-50 min-h-screen">
            <NavBar/>
            <Hero/>

            {/* Key Features */}
            <div id="services" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Comprehensive healthcare solutions designed for your needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-pink-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                            <Calendar className="h-12 w-12 text-pink-800 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Online Appointments</h3>
                            <p className="text-gray-600">
                                Schedule appointments with ease through our intuitive online booking system.
                                Choose your preferred doctor and time slot.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-pink-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                            <Users className="h-12 w-12 text-pink-800 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Specialists</h3>
                            <p className="text-gray-600">
                                Access to a diverse team of specialist doctors across various medical disciplines
                                to provide the care you need.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-pink-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                            <Shield className="h-12 w-12 text-pink-800 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Digital Records</h3>
                            <p className="text-gray-600">
                                Secure access to your medical history, test results, and
                                prescriptions anytime, anywhere through our patient portal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-16 bg-pink-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Your journey to better health in three simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-pink-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Account</h3>
                            <p className="text-gray-600">
                                Sign up and complete your profile with your medical history and insurance information.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-pink-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Book Appointment</h3>
                            <p className="text-gray-600">
                                Browse through our specialists and book an appointment at your convenience.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-pink-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Receive Care</h3>
                            <p className="text-gray-600">
                                Visit our facility or connect through telehealth for your consultation and follow-up care.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Link to="/signup">
                            <Button className="bg-pink-800 hover:bg-pink-700 text-white">
                                Start Your Health Journey
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Doctors Section */}
            <div id="doctors" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Our Doctors</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Meet our team of experienced healthcare professionals
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Doctor 1 */}
                        <div className="bg-pink-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <img src="/api/placeholder/300/300" alt="Dr. Emily Johnson" className="w-full h-64 object-cover" />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-900">Dr. Emily Johnson</h3>
                                <p className="text-pink-800 font-medium">Cardiologist</p>
                                <p className="text-gray-600 mt-2">Specializing in preventive cardiology with over 15 years of experience.</p>
                            </div>
                        </div>

                        {/* Doctor 2 */}
                        <div className="bg-pink-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <img src="/api/placeholder/300/300" alt="Dr. Michael Chen" className="w-full h-64 object-cover" />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-900">Dr. Michael Chen</h3>
                                <p className="text-pink-800 font-medium">Neurologist</p>
                                <p className="text-gray-600 mt-2">Expert in neurodegenerative disorders and headache management.</p>
                            </div>
                        </div>

                        {/* Doctor 3 */}
                        <div className="bg-pink-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <img src="/api/placeholder/300/300" alt="Dr. Sarah Martinez" className="w-full h-64 object-cover" />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-900">Dr. Sarah Martinez</h3>
                                <p className="text-pink-800 font-medium">Pediatrician</p>
                                <p className="text-gray-600 mt-2">Dedicated to children's health with a focus on developmental care.</p>
                            </div>
                        </div>

                        {/* Doctor 4 */}
                        <div className="bg-pink-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <img src="/api/placeholder/300/300" alt="Dr. James Wilson" className="w-full h-64 object-cover" />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-900">Dr. James Wilson</h3>
                                <p className="text-pink-800 font-medium">Orthopedic Surgeon</p>
                                <p className="text-gray-600 mt-2">Specialized in sports medicine and joint replacement procedures.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Button variant="outline" className="border-pink-800 text-pink-800 hover:bg-pink-50">
                            View All Specialists
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div id="testimonials" className="py-16 bg-pink-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Patient Testimonials</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Hear what our patients say about their experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center mb-4">
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                            </div>
                            <p className="text-gray-600 italic mb-4">
                                "The online appointment system saved me so much time. Dr. Johnson was thorough and caring,
                                and I had access to my test results the same day. Exceptional service!"
                            </p>
                            <div className="flex items-center">
                                <div className="mr-4">
                                    <div className="h-10 w-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-800 font-bold">
                                        RB
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Robert Brown</h4>
                                    <p className="text-sm text-gray-500">Patient since 2023</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center mb-4">
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                            </div>
                            <p className="text-gray-600 italic mb-4">
                                "The medical team at MediCare truly listens. They took the time to understand my concerns
                                and developed a treatment plan tailored specifically for me. I'm grateful for their care."
                            </p>
                            <div className="flex items-center">
                                <div className="mr-4">
                                    <div className="h-10 w-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-800 font-bold">
                                        LT
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Lisa Thompson</h4>
                                    <p className="text-sm text-gray-500">Patient since 2022</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center mb-4">
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                            </div>
                            <p className="text-gray-600 italic mb-4">
                                "Having all my medical records in one secure place has been a game-changer.
                                The doctors are excellent, and the staff is always helpful and friendly."
                            </p>
                            <div className="flex items-center">
                                <div className="mr-4">
                                    <div className="h-10 w-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-800 font-bold">
                                        MK
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Mark Kim</h4>
                                    <p className="text-sm text-gray-500">Patient since 2021</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="py-16 bg-pink-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to prioritize your health?</h2>
                    <p className="text-lg mb-8 max-w-3xl mx-auto">
                        Join thousands of satisfied patients who have transformed their healthcare experience with MediCare.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/signup">
                            <Button className="bg-white text-pink-800 hover:bg-gray-100 px-6 py-3 text-lg">
                                Create Account
                            </Button>
                        </Link>
                        <Link to="/learn-more">
                            <Button variant="outline" className="border-white text-white hover:bg-pink-700 px-6 py-3 text-lg">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div id="contact" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Have questions? Our team is here to help
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="lg:col-span-1">
                            <div className="space-y-8">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <PhoneCall className="h-6 w-6 text-pink-800" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                                        <p className="mt-1 text-gray-600">+1 (800) 123-4567</p>
                                        <p className="text-gray-600">Monday to Friday, 8am to 6pm</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <Mail className="h-6 w-6 text-pink-800" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-medium text-gray-900">Email</h3>
                                        <p className="mt-1 text-gray-600">support@medicare.example.com</p>
                                        <p className="text-gray-600">We'll respond within 24 hours</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <Clock className="h-6 w-6 text-pink-800" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-medium text-gray-900">Hours</h3>
                                        <p className="mt-1 text-gray-600">Monday - Friday: 8:00 AM - 8:00 PM</p>
                                        <p className="text-gray-600">Saturday: 9:00 AM - 5:00 PM</p>
                                        <p className="text-gray-600">Sunday: Closed</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <MapPin className="h-6 w-6 text-pink-800" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-medium text-gray-900">Location</h3>
                                        <p className="mt-1 text-gray-600">123 Healthcare Avenue</p>
                                        <p className="text-gray-600">Medical District, NY 10001</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2 bg-pink-50 p-6 rounded-lg shadow-sm">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-800 focus:ring focus:ring-pink-200 focus:ring-opacity-50 p-2"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-800 focus:ring focus:ring-pink-200 focus:ring-opacity-50 p-2"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-800 focus:ring focus:ring-pink-200 focus:ring-opacity-50 p-2"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-800 focus:ring focus:ring-pink-200 focus:ring-opacity-50 p-2"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>
                                <div>
                                    <Button type="submit" className="w-full bg-pink-800 hover:bg-pink-700 text-white py-2">
                                        Send Message
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

           <Footer/>
        </div>
    )
}