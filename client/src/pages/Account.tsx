import { useState } from "react";
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  LogOut, 
  Trash2, 
  ChevronRight, 
  Mail, 
  Lock, 
  Save, 
  Eye, 
  EyeOff
} from "lucide-react";

export default function Account() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    password: "••••••••••",
    notifications: {
      email: true,
      push: false,
      sms: true,
      marketing: false
    },
    avatar: "/api/placeholder/150/150"
  });

  const handleLogout = () => {
    alert("Logging out...");
    // In a real app, you would handle logout logic here
  };
  
  const handleSaveChanges = () => {
    alert("Changes saved successfully!");
    // In a real app, you would save the changes to the backend
  };
  
  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false);
    alert("Account deleted successfully!");
    // In a real app, you would handle account deletion logic here
  };
  
  const updateNotification = (type) => {
    setUserData({
      ...userData,
      notifications: {
        ...userData.notifications,
        [type]: !userData.notifications[type]
      }
    });
  };
  
  return (
    <div className="font-[family-name:var(--font-geist-sans)] text-gray-800 flex flex-col min-h-screen">
      {/* Header */}
      <div className="py-4 px-6 border-b">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences</p>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow flex flex-col max-w-6xl mx-auto w-full p-4 gap-6">
        
        {/* Top Navigation Bar */}
        <div className="w-full bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-col sm:flex-row">
            {/* User Profile Summary */}
            <div className="flex items-center mb-6 sm:mb-0 p-2">
              <img 
                src={userData.avatar} 
                alt="Profile" 
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <h2 className="font-semibold">{userData.name}</h2>
                <p className="text-sm text-gray-500">{userData.email}</p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 sm:ml-auto items-center">
              <button 
                onClick={() => setActiveTab("profile")}
                className={`flex items-center p-2 rounded-md ${
                  activeTab === "profile" 
                    ? "bg-blue-50 text-blue-600" 
                    : "hover:bg-gray-100"
                }`}
              >
                <User size={18} className="mr-1" />
                <span>Profile</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("security")}
                className={`flex items-center p-2 rounded-md ${
                  activeTab === "security" 
                    ? "bg-blue-50 text-blue-600" 
                    : "hover:bg-gray-100"
                }`}
              >
                <Shield size={18} className="mr-1" />
                <span>Security</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center p-2 rounded-md ${
                  activeTab === "notifications" 
                    ? "bg-blue-50 text-blue-600" 
                    : "hover:bg-gray-100"
                }`}
              >
                <Bell size={18} className="mr-1" />
                <span>Notifications</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("billing")}
                className={`flex items-center p-2 rounded-md ${
                  activeTab === "billing" 
                    ? "bg-blue-50 text-blue-600" 
                    : "hover:bg-gray-100"
                }`}
              >
                <CreditCard size={18} className="mr-1" />
                <span>Billing</span>
              </button>
              
              <div className="h-6 border-r mx-2 hidden sm:block"></div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center p-2 rounded-md text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} className="mr-1" />
                <span>Logout</span>
              </button>
              
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center p-2 rounded-md text-red-600 hover:bg-red-50"
              >
                <Trash2 size={18} className="mr-1" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-grow">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
              
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <img 
                    src={userData.avatar} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border-4 border-gray-100"
                  />
                  <div className="ml-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Upload New Photo
                    </button>
                    <p className="text-sm text-gray-500 mt-1">JPG or PNG. Max size 1MB</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex">
                    <input 
                      type="email" 
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    />
                    <button className="ml-2 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                      Verify
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea 
                    className="w-full p-2 border rounded-md h-24"
                    placeholder="Tell us about yourself"
                  ></textarea>
                </div>
                
                <div className="pt-4">
                  <button 
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="pb-6 border-b">
                  <h3 className="font-medium mb-4 flex items-center">
                    <Mail size={16} className="mr-2" />
                    Change Email
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Email
                      </label>
                      <input 
                        type="email" 
                        value={userData.email} 
                        disabled
                        className="w-full p-2 border rounded-md bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Email
                      </label>
                      <input 
                        type="email" 
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Update Email
                    </button>
                  </div>
                </div>
                
                <div className="pb-6 border-b">
                  <h3 className="font-medium mb-4 flex items-center">
                    <Lock size={16} className="mr-2" />
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"}
                          className="w-full p-2 border rounded-md pr-10"
                        />
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input 
                        type="password" 
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input 
                        type="password" 
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Update Password
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <p className="font-medium">Protect your account with 2FA</p>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div className="pb-4 border-b">
                  <h3 className="font-medium mb-4">Email Notifications</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Account updates</p>
                        <p className="text-sm text-gray-500">
                          Receive emails about your account activity
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={userData.notifications.email}
                          onChange={() => updateNotification("email")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing emails</p>
                        <p className="text-sm text-gray-500">
                          Receive emails about new features and offers
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={userData.notifications.marketing}
                          onChange={() => updateNotification("marketing")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pb-4 border-b">
                  <h3 className="font-medium mb-4">Push Notifications</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Push notifications</p>
                        <p className="text-sm text-gray-500">
                          Receive push notifications on your device
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={userData.notifications.push}
                          onChange={() => updateNotification("push")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">SMS Notifications</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS alerts</p>
                        <p className="text-sm text-gray-500">
                          Receive text messages for important updates
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={userData.notifications.sms}
                          onChange={() => updateNotification("sms")}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button 
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-6">Billing Information</h2>
              
              <div className="mb-8 p-4 border rounded-md bg-blue-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Current Plan: Premium</h3>
                    <p className="text-sm text-gray-600">Your next billing date is June 1, 2025</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-md hover:bg-gray-50">
                    Upgrade Plan
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="pb-6 border-b">
                  <h3 className="font-medium mb-4">Payment Methods</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-md">
                      <div className="flex items-center">
                        <div className="bg-gray-100 p-2 rounded-md mr-3">
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/2026</p>
                        </div>
                      </div>
                      <div className="flex">
                        <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                        <button className="text-red-600 hover:text-red-800">Remove</button>
                      </div>
                    </div>
                    
                    <button className="w-full p-3 border border-dashed rounded-md text-center text-gray-600 hover:bg-gray-50">
                      + Add Payment Method
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Billing History</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Description</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Amount</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Invoice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-3 px-4 text-sm text-gray-800">May 1, 2025</td>
                          <td className="py-3 px-4 text-sm text-gray-800">Premium Plan - Monthly</td>
                          <td className="py-3 px-4 text-sm text-gray-800">$19.99</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Paid
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              Download
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-sm text-gray-800">Apr 1, 2025</td>
                          <td className="py-3 px-4 text-sm text-gray-800">Premium Plan - Monthly</td>
                          <td className="py-3 px-4 text-sm text-gray-800">$19.99</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Paid
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              Download
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-sm text-gray-800">Mar 1, 2025</td>
                          <td className="py-3 px-4 text-sm text-gray-800">Premium Plan - Monthly</td>
                          <td className="py-3 px-4 text-sm text-gray-800">$19.99</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Paid
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              Download
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Account</h3>
            <p className="mb-4">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}