// import { Link } from "react-router-dom";
// import {
//     Calendar,
//     Users,
//     PhoneCall,
//     ArrowRight,
//     Clock,
//     Star,
//     Shield,
//     MapPin,
//     Mail,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Footer from "@/components/Footer";
// import NavBar from "@/components/NavBar";
// import Hero from "@/components/Hero";
// import { doctors } from "@/data";

// type Doctor={
//     id: string;
//     name: string;
//     specialization: string;
//     bio: string;
//     image: string;
// }

// export default function LandingPage() {
//     return (
//         <div className="font-[family-name:var(--font-geist-sans)] bg-pink-50 min-h-screen">
//             <NavBar/>
//             <Hero/>

//             {/* Key Features */}
//             <div id="services" className="py-16 bg-white">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-12">
//                         <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
//                         <p className="mt-4 text-lg text-gray-600">
//                             We offer a wide range of healthcare services tailored to meet your needs.
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                         {/* Feature 1 */}
//                         {/* Sulturing - 1500, Suturing removal - 500, Implant - removal - 500,
//                                 Wound Cleaning/dressing - minor 200 : extensive 500, implant insertatiion - 700, injections - 200, Circumcision - 2000. */}
//                         <div className="bg-pink-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
//                             <Calendar className="h-12 w-12 text-pink-800 mb-4" />
//                             <h3 className="text-xl font-semibold text-gray-900 mb-2">Online Appointments</h3>
//                             <p className="text-gray-600">
//                                 Schedule appointments with ease through our intuitive online booking system.
//                                 Choose your preferred doctor and time slot.
//                             </p>
//                         </div>

//                         {/* Feature 2 */}
//                         <div className="bg-pink-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
//                             <Users className="h-12 w-12 text-pink-800 mb-4" />
//                             <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Specialists</h3>
//                             <p className="text-gray-600">
//                                 Access to a diverse team of specialist doctors across various medical disciplines
//                                 to provide the care you need.
//                             </p>
//                         </div>

//                         {/* Feature 3 */}
//                         <div className="bg-pink-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
//                             <Shield className="h-12 w-12 text-pink-800 mb-4" />
//                             <h3 className="text-xl font-semibold text-gray-900 mb-2">Digital Records</h3>
//                             <p className="text-gray-600">
//                                 Secure access to your medical history, test results, and
//                                 prescriptions anytime, anywhere through our patient portal.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* How It Works */}
//             <div className="py-16 bg-pink-50">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-12">
//                         <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
//                         <p className="mt-4 text-lg text-gray-600">
//                             Your journey to better health in three simple steps
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                         {/* Step 1 */}
//                         <div className="flex flex-col items-center text-center">
//                             <div className="w-16 h-16 bg-pink-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
//                                 1
//                             </div>
//                             <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Account</h3>
//                             <p className="text-gray-600">
//                                 Sign up and complete your profile with your medical history and insurance information.
//                             </p>
//                         </div>

//                         {/* Step 2 */}
//                         <div className="flex flex-col items-center text-center">
//                             <div className="w-16 h-16 bg-pink-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
//                                 2
//                             </div>
//                             <h3 className="text-xl font-semibold text-gray-900 mb-2">Book Appointment</h3>
//                             <p className="text-gray-600">
//                                 Browse through our specialists and book an appointment at your convenience.
//                             </p>
//                         </div>

//                         {/* Step 3 */}
//                         <div className="flex flex-col items-center text-center">
//                             <div className="w-16 h-16 bg-pink-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
//                                 3
//                             </div>
//                             <h3 className="text-xl font-semibold text-gray-900 mb-2">Receive Care</h3>
//                             <p className="text-gray-600">
//                                 Visit our facility or connect through telehealth for your consultation and follow-up care.
//                             </p>
//                         </div>
//                     </div>

//                     <div className="mt-12 text-center">
//                         <Link to="/signup">
//                             <Button className="bg-pink-800 hover:bg-pink-700 text-white">
//                                 Start Your Health Journey
//                                 <ArrowRight className="ml-2 h-4 w-4" />
//                             </Button>
//                         </Link>
//                     </div>
//                 </div>
//             </div>

//             {/* Doctors Section */}
//             <div id="doctors" className="py-16 bg-white">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-12">
//                         <h2 className="text-3xl font-bold text-gray-900">Our Doctors</h2>
//                         <p className="mt-4 text-lg text-gray-600">
//                             Meet our team of experienced healthcare professionals
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//                         {doctors&&doctors.map((doctor:Doctor)=>(
//                         <div className="bg-pink-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
//                             <img src={doctor.image} alt={doctor.name} className="w-full h-64 object-cover" />
//                             <div className="p-4">
//                                 <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
//                                 <p className="text-pink-800 font-medium">{doctor.specialization}</p>
//                                 <p className="text-gray-600 mt-2">{doctor.bio}</p>
//                             </div>
//                         </div>
//                         ))}
//                     </div>

//                     <div className="mt-12 text-center">
//                         <Button variant="outline" className="border-pink-800 text-pink-800 hover:bg-pink-50">
//                             View All Specialists
//                             <ArrowRight className="ml-2 h-4 w-4" />
//                         </Button>
//                     </div>
//                 </div>
//             </div>

//             {/* Testimonials */}
//             <div id="testimonials" className="py-16 bg-pink-50">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-12">
//                         <h2 className="text-3xl font-bold text-gray-900">Patient Testimonials</h2>
//                         <p className="mt-4 text-lg text-gray-600">
//                             Hear what our patients say about their experience
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                         {/* Testimonial 1 */}
//                         <div className="bg-white p-6 rounded-lg shadow">
//                             <div className="flex items-center mb-4">
//                                 <Star className="h-5 w-5 text-yellow-400" />
//                                 <Star className="h-5 w-5 text-yellow-400" />
//                                 <Star className="h-5 w-5 text-yellow-400" />
//                                 <Star className="h-5 w-5 text-yellow-400" />
//                                 <Star className="h-5 w-5 text-yellow-400" />
//                             </div>
//                             <p className="text-gray-600 italic mb-4">
//                                 "The online appointment system saved me so much time. Dr. Johnson was thorough and caring,
//                                 and I had access to my test results the same day. Exceptional service!"
//                             </p>
//                             <div className="flex items-center">
//                                 <div className="mr-4">
//                                     <div className="h-10 w-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-800 font-bold">
//                                         RB
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <h4 className="font-semibold text-gray-900">Robert Brown</h4>
//                                     <p className="text-sm text-gray-500">Patient since 2023</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Testimonial 2 */}
//                         <div className="bg-white p-6 rounded-lg shadow">
//                             <div className="flex items-center mb-4">
//                                 <Star className="h-5 w-5 text-yellow-400" />
//                                 <Star className="h-5 w-5 text-yellow-400" />
//                                 <Star className="h-5 w-5 text-yellow-400" />
//                                 <Star className="h-5 w-5 text-yellow-400" />
//                                 <Star className="h-5 w-5 text-yellow-400" />
//                             </div>
//                             <p className="text-gray-600 italic mb-4">
//                                 "The medical team at MediCare truly listens. They took the time to understand my concerns
//                                 and developed a treatment plan tailored specifically for me. I'm grateful for their care."
//                             </p>
//                             <div className="flex items-center">
//                                 <div className="mr-4">
//                                     <div className="h-10 w-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-800 font-bold">
//                                         LT
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <h4 className="font-semibold text-gray-900">Lisa Thompson</h4>
//                                     <p className="text-sm text-gray-500">Patient since 2022</p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Testimonial 3 */}
//                         <div className="bg-white p-6 rounded-lg shadow">
//                             <div className="flex items-center mb-4">
//                                 <Star className="h-5 w-5 text-yellow-400" />
//                                 <Star className="h-5 w-5 text-yellow-400" />
//                                 <Star className="h-5 w-5 text-yellow-400" />
//                                 <Star className="h-5 w-5 text-yellow-400" />
//                                 <Star className="h-5 w-5 text-yellow-400" />
//                             </div>
//                             <p className="text-gray-600 italic mb-4">
//                                 "Having all my medical records in one secure place has been a game-changer.
//                                 The doctors are excellent, and the staff is always helpful and friendly."
//                             </p>
//                             <div className="flex items-center">
//                                 <div className="mr-4">
//                                     <div className="h-10 w-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-800 font-bold">
//                                         MK
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <h4 className="font-semibold text-gray-900">Mark Kim</h4>
//                                     <p className="text-sm text-gray-500">Patient since 2021</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Call to Action */}
//             <div className="py-16 bg-pink-800 text-white">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//                     <h2 className="text-3xl font-bold mb-4">Ready to prioritize your health?</h2>
//                     <p className="text-lg mb-8 max-w-3xl mx-auto">
//                         Join thousands of satisfied patients who have transformed their healthcare experience with MediCare.
//                     </p>
//                     <div className="flex flex-col sm:flex-row justify-center gap-4">
//                         {/* <Link to="/signup">
//                             <Button className="bg-white text-pink-800 hover:bg-gray-100 px-6 py-3 text-lg">
//                                 Create Account
//                             </Button>
//                         </Link> */}
//                         <Link to="/learn-more">
//                             <Button variant="outline" className="border-white bg-pink-700 text-white hover:text-white hover:bg-pink-800 px-6 py-3 text-lg">
//                                 Learn More
//                             </Button>
//                         </Link>
//                     </div>
//                 </div>
//             </div>

//             {/* Contact Section */}
//             <div id="contact" className="py-16 bg-white">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-12">
//                         <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
//                         <p className="mt-4 text-lg text-gray-600">
//                             Have questions? Our team is here to help
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                         {/* Contact Info */}
//                         <div className="lg:col-span-1">
//                             <div className="space-y-8">
//                                 <div className="flex items-start">
//                                     <div className="flex-shrink-0">
//                                         <PhoneCall className="h-6 w-6 text-pink-800" />
//                                     </div>
//                                     <div className="ml-3">
//                                         <h3 className="text-lg font-medium text-gray-900">Phone</h3>
//                                         <p className="mt-1 text-gray-600">+0112782133</p>
//                                         <p className="text-gray-600">Monday to Friday, 8am to 6pm</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-start">
//                                     <div className="flex-shrink-0">
//                                         <Mail className="h-6 w-6 text-pink-800" />
//                                     </div>
//                                     <div className="ml-3">
//                                         <h3 className="text-lg font-medium text-gray-900">Email</h3>
//                                         <p className="mt-1 text-gray-600">triple-ts-mediclinic@gmail.com</p>
//                                         <p className="text-gray-600">We'll respond within 24 hours</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-start">
//                                     <div className="flex-shrink-0">
//                                         <Clock className="h-6 w-6 text-pink-800" />
//                                     </div>
//                                     <div className="ml-3">
//                                         <h3 className="text-lg font-medium text-gray-900">Hours</h3>
//                                         <p className="mt-1 text-gray-600">Monday - Friday: 8:00 AM - 8:00 PM</p>
//                                         <p className="text-gray-600">Saturday: 9:00 AM - 5:00 PM</p>
//                                         <p className="text-gray-600">Sunday: Closed</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-start">
//                                     <div className="flex-shrink-0">
//                                         <MapPin className="h-6 w-6 text-pink-800" />
//                                     </div>
//                                     <div className="ml-3">
//                                         <h3 className="text-lg font-medium text-gray-900">Location</h3>
//                                         <p className="mt-1 text-gray-600">P.O Box 302-60400. CHUKA PLOT 834</p>
//                                         <p className="text-gray-600">Mitheru, Tharaka Nithi County</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Contact Form */}
//                         <div className="lg:col-span-2 bg-pink-50 p-6 rounded-lg shadow-sm">
//                             <form className="space-y-6">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div>
//                                         <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                                             Full Name
//                                         </label>
//                                         <input
//                                             type="text"
//                                             id="name"
//                                             name="name"
//                                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-800 focus:ring focus:ring-pink-200 focus:ring-opacity-50 p-2"
//                                             placeholder="John Doe"
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                                             Email Address
//                                         </label>
//                                         <input
//                                             type="email"
//                                             id="email"
//                                             name="email"
//                                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-800 focus:ring focus:ring-pink-200 focus:ring-opacity-50 p-2"
//                                             placeholder="john@example.com"
//                                         />
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
//                                         Subject
//                                     </label>
//                                     <input
//                                         type="text"
//                                         id="subject"
//                                         name="subject"
//                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-800 focus:ring focus:ring-pink-200 focus:ring-opacity-50 p-2"
//                                         placeholder="How can we help?"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="message" className="block text-sm font-medium text-gray-700">
//                                         Message
//                                     </label>
//                                     <textarea
//                                         id="message"
//                                         name="message"
//                                         rows={4}
//                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-800 focus:ring focus:ring-pink-200 focus:ring-opacity-50 p-2"
//                                         placeholder="Tell us more about your inquiry..."
//                                     />
//                                 </div>
//                                 <div>
//                                     <Button type="submit" className="w-full bg-pink-800 hover:bg-pink-700 text-white py-2">
//                                         Send Message
//                                     </Button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//            <Footer/>
//         </div>
//     )
// }


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
    Search,
    Menu,
    Info,
    FileText,
    HelpCircle,
    LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Staff } from "@/types"
import { useAppContext } from "@/context";

export default function LandingPage() {
    const {doctors}=useAppContext()
    return (
        <div className="font-sans bg-white min-h-screen">
            {/* Header with top navigation */}
            <header>
                {/* Top Navigation - Dark pink */}
                <div className="bg-pink-900 py-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between text-white">
                            <div className="flex items-center space-x-4 text-sm">
                                <a href="#" className="hover:text-pink-200 flex items-center">
                                    <Info className="h-4 w-4 mr-1" />
                                    <span>About</span>
                                </a>
                                <a href="#" className="hover:text-pink-200 flex items-center">
                                    <HelpCircle className="h-4 w-4 mr-1" />
                                    <span>Help</span>
                                </a>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                                <Link to={"/signin"} className="hover:text-pink-200 flex items-center gap-2">
                                    <LogIn width={16} height={16}/>
                                    <p>Sign In</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Main Header - White */}
                <div className="bg-white shadow">
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
                                                <h1 className="text-xl font-bold text-pink-800">Triple-TS</h1>
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
                                <Link to="/appointment" className="bg-pink-800 text-white px-4 py-2 rounded hover:bg-pink-700 transition">
                                    Book Appointment
                                </Link>
                            </div>
                            <div className="md:hidden">
                                <button className="text-gray-600 hover:text-pink-800">
                                    <Menu className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-pink-900 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="md:w-1/2 text-white">
                            <h1 className="text-4xl font-bold mb-4">Welcome to Triple-TS MediClinic</h1>
                            <p className="text-xl mb-8 text-pink-100">
                                Your trusted partner for quality healthcare services in Tharaka Nithi County
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link to="/appointment">
                                    <Button className="bg-white text-pink-800 hover:bg-pink-50 px-6 py-3 text-base font-medium rounded">
                                        Book Appointment
                                    </Button>
                                </Link>
                                <a href="#services">
                                    <Button variant="outline" className="border-white text-white hover:text-white hover:bg-pink-800 px-6 py-3 text-base font-medium rounded">
                                        Our Services
                                    </Button>
                                </a>
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
                                <div className="grid grid-cols-2 gap-4">
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

            {/* Quick Stats Section */}
            <div className="bg-pink-800 py-8 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-3xl font-bold">1000+</div>
                            <div className="text-pink-200">Patients Served</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">15+</div>
                            <div className="text-pink-200">Specialist Doctors</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">10+</div>
                            <div className="text-pink-200">Years Experience</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">24/7</div>
                            <div className="text-pink-200">Emergency Care</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div id="services" className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-pink-800">Our Services</h2>
                        <div className="h-1 w-24 bg-pink-800 mx-auto my-4"></div>
                        <p className="mt-4 text-lg text-gray-600">
                            We offer a wide range of healthcare services tailored to meet your needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-pink-800">
                            <Calendar className="h-12 w-12 text-pink-800 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Online Appointments</h3>
                            <p className="text-gray-600">
                                Schedule appointments with ease through our intuitive online booking system.
                                Choose your preferred doctor and time slot.
                            </p>
                            <Link to="/services/appointments" className="flex items-center mt-4 text-pink-800 hover:text-pink-600">
                                <span className="font-medium">Learn more</span>
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-pink-800">
                            <Users className="h-12 w-12 text-pink-800 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Specialists</h3>
                            <p className="text-gray-600">
                                Access to a diverse team of specialist doctors across various medical disciplines
                                to provide the care you need.
                            </p>
                            <Link to="/services/specialists" className="flex items-center mt-4 text-pink-800 hover:text-pink-600">
                                <span className="font-medium">Learn more</span>
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-t-4 border-pink-800">
                            <Shield className="h-12 w-12 text-pink-800 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Digital Records</h3>
                            <p className="text-gray-600">
                                Secure access to your medical history, test results, and
                                prescriptions anytime, anywhere through our patient portal.
                            </p>
                            <Link to="/services/records" className="flex items-center mt-4 text-pink-800 hover:text-pink-600">
                                <span className="font-medium">Learn more</span>
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Link to="/services">
                            <Button className="bg-pink-800 hover:bg-pink-700 text-white px-6 py-3 rounded">
                                View All Services
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-pink-800">How It Works</h2>
                        <div className="h-1 w-24 bg-pink-800 mx-auto my-4"></div>
                        <p className="mt-4 text-lg text-gray-600">
                            Your journey to better health in three simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-pink-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Account</h3>
                            <p className="text-gray-600">
                                Sign up and complete your profile with your medical history and insurance information.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-pink-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Book Appointment</h3>
                            <p className="text-gray-600">
                                Browse through our specialists and book an appointment at your convenience.
                            </p>
                        </div>

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
                            <Button className="bg-pink-800 hover:bg-pink-700 text-white px-6 py-3 rounded">
                                Start Your Health Journey
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Doctors Section */}
            <div id="doctors" className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-pink-800">Our Doctors</h2>
                        <div className="h-1 w-24 bg-pink-800 mx-auto my-4"></div>
                        <p className="mt-4 text-lg text-gray-600">
                            Meet our team of experienced healthcare professionals
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {doctors && doctors.slice(0, 5).map((doctor: Staff) => (
                            <div key={doctor.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                                <img src={doctor.photo} alt={doctor.firstName} className="w-full h-64 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-pink-800">{`${doctor.firstName} ${doctor.lastName}`}</h3>
                                    <p className="text-pink-600 font-medium">{doctor.specialty}</p>
                                    <p className="text-gray-600 mt-2">{doctor.biography}</p>
                                    <Link to={`/doctors/${doctor.id}`} className="flex items-center mt-4 text-pink-800 hover:text-pink-600">
                                        <span className="font-medium">View Profile</span>
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link to="/doctors">
                            <Button variant="outline" className="border-pink-800 text-pink-800 hover:bg-pink-50 px-6 py-3 rounded">
                                View All Specialists
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div id="testimonials" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-pink-800">Patient Testimonials</h2>
                        <div className="h-1 w-24 bg-pink-800 mx-auto my-4"></div>
                        <p className="mt-4 text-lg text-gray-600">
                            Hear what our patients say about their experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-800">
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

                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-800">
                            <div className="flex items-center mb-4">
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                                <Star className="h-5 w-5 text-yellow-400" />
                            </div>
                            <p className="text-gray-600 italic mb-4">
                                "The medical team at Triple-TS truly listens. They took the time to understand my concerns
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

                        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-800">
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
                        Join thousands of satisfied patients who have transformed their healthcare experience with Triple-TS MediClinic.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/signup">
                            <Button className="bg-white text-pink-800 hover:bg-gray-100 px-6 py-3 text-lg font-medium rounded">
                                Create Account
                            </Button>
                        </Link>
                        <Link to="/learn-more">
                            <Button variant="outline" className="border-white bg-pink-700 text-white hover:text-white hover:bg-pink-600 px-6 py-3 text-lg font-medium rounded">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div id="contact" className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-pink-800">Contact Us</h2>
                        <div className="h-1 w-24 bg-pink-800 mx-auto my-4"></div>
                        <p className="mt-4 text-lg text-gray-600">
                            Have questions? Our team is here to help
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-bold text-pink-800 mb-6">Get in Touch</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <PhoneCall className="h-6 w-6 text-pink-800" />
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-lg font-medium text-gray-900">Phone</h4>
                                            <p className="mt-1 text-gray-600">+0112782133</p>
                                            <p className="text-gray-600">Monday to Friday, 8am to 6pm</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <Mail className="h-6 w-6 text-pink-800" />
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-lg font-medium text-gray-900">Email</h4>
                                            <p className="mt-1 text-gray-600">triple-ts-mediclinic@gmail.com</p>
                                            <p className="text-gray-600">We'll respond within 24 hours</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <Clock className="h-6 w-6 text-pink-800" />
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="text-lg font-medium text-gray-900">Hours</h4>
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
                                            <h4 className="text-lg font-medium text-gray-900">Location</h4>
                                            <p className="mt-1 text-gray-600">P.O Box 302-60400. CHUKA PLOT 834</p>
                                            <p className="text-gray-600">Mitheru, Tharaka Nithi County</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-pink-800 mb-6">Send us a Message</h3>
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
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-800 focus:ring focus:ring-pink-200 focus:ring-opacity-50 p-2"
                                        placeholder="Your message here..."
                                    ></textarea>
                                </div>
                                <div className="flex items-center justify-end">
                                    <Button type="submit" className="bg-pink-800 hover:bg-pink-700 text-white px-6 py-3 rounded">
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
    );
};
