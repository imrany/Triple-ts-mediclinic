import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderX, Home, ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate=useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-[family-name:var(--font-geist-sans)] flex flex-col items-center justify-center p-6">
      {/* Main Content Container */}
      <div className="w-full max-w-2xl text-center">
        {/* Icon */}
        <div className="mb-8 relative">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
            <FolderX className="w-12 h-12 text-green-800" />
          </div>
          <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center animate-pulse">
            <span className="text-green-800 font-bold text-xs">?</span>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-bold text-green-800 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you're looking for. It might have been removed, 
          renamed, or never existed in the first place.
        </p>
        
        {/* Suggestions Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 text-left">
          <h2 className="font-semibold text-green-800 mb-4">What you can try:</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-green-800 font-bold text-xs">1</span>
              </div>
              <span className="text-gray-700">Check the URL for any typos or errors</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-green-800 font-bold text-xs">2</span>
              </div>
              <span className="text-gray-700">Use the search function to find what you're looking for</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-green-800 font-bold text-xs">3</span>
              </div>
              <span className="text-gray-700">Navigate to our homepage and browse from there</span>
            </li>
          </ul>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-green-800 text-green-800 rounded-lg hover:bg-green-50 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-800 text-white rounded-lg hover:bg-green-900 transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Button>
          
          <Button 
            onClick={() => (document.querySelector('#search-input') as HTMLInputElement)?.focus()}
            className="items-center hidden sm:flex justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <Search className="w-5 h-5" />
            Search
          </Button>
        </div>
      </div>
      
      {/* Search Input - Hidden by default on mobile */}
      <div className="mt-8 w-full max-w-md hidden sm:block">
        <div className="relative">
          <Input
            id="search-input"
            type="text"
            placeholder="Search for content..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-7 text-sm text-gray-500 text-center">
        Error code: 404 | If you believe this is a mistake, please contact support.
      </div>
    </div>
  );
}