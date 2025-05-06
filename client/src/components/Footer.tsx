import { Heart, ArrowUp, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    
    const handleSubscribe = (e:any) => {
        e.preventDefault();
        if (email) {
            // In a real app, you would send this to your API
            console.log("Subscribing email:", email);
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 3000);
        }
    };
    
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: About */}
                    <div>
                        <div className="flex items-center mb-4">
                            <Heart className="h-6 w-6 text-pink-500" />
                            <span className="ml-2 text-xl font-bold">Triple TS Medclinic</span>
                        </div>
                        <p className="text-gray-400">
                            Providing quality healthcare services for you and your family since 1995.
                        </p>
                        <div className="flex space-x-4 mt-4">
                            {/* Social Media Icons */}
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.147-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    
                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Our Services</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Doctors</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Appointments</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Column 3: Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                <span className="text-gray-400">CHUKA PLOT 834, Mitheru , Tharaka Nithi County, P.O Box 302-60400</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                <a href="tel:+254112782133" className="text-gray-400 hover:text-white transition-colors">+254112782133</a>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 text-pink-500 mr-2 flex-shrink-0" />
                                <a href="mailto:info@tripletsmedclinic.com" className="text-gray-400 hover:text-white transition-colors">info@tripletsmedclinic.com</a>
                            </li>
                            <li className="flex items-start">
                                <Clock className="h-5 w-5 text-pink-500 mr-2 mt-1 flex-shrink-0" />
                                <div className="text-gray-400">
                                    <p>Mon-Fri: 8:00 AM - 8:00 PM</p>
                                    <p>Saturday: 9:00 AM - 5:00 PM</p>
                                    <p>Sunday: 10:00 AM - 2:00 PM</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Column 4: Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                        <p className="text-gray-400 mb-4">Subscribe to our newsletter for health tips and clinic updates.</p>
                        <div className="space-y-3">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address"
                                    className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                            </div>
                            <button
                                onClick={handleSubscribe}
                                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded transition-colors"
                            >
                                Subscribe
                            </button>
                        </div>
                        {subscribed && (
                            <p className="text-pink-500 mt-2 text-sm">Thank you for subscribing!</p>
                        )}
                    </div>
                </div>
                
                {/* Divider */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            &copy; {currentYear} Triple TS Medclinic. All rights reserved.
                        </p>
                        <button
                            onClick={scrollToTop}
                            className="mt-4 md:mt-0 flex items-center text-gray-400 hover:text-white transition-colors"
                            aria-label="Scroll to top"
                        >
                            <span className="mr-2">Back to top</span>
                            <ArrowUp className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}