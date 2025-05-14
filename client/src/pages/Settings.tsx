import { useState } from "react";
import {
  CreditCard,
  LogOut,
  Trash2,
} from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";
import { useAppContext } from "@/context";
import { Staff } from "@/types";

export default function Settings() {
  const { staff } = useAppContext() as {
    staff: Staff
  }
  const [activeTab, setActiveTab] = useState("profile");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isMobile = useIsMobile()

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
    avatar: `https://imageplaceholder.net/150x150?text=JD`
  });

  const handleLogout = () => {
    localStorage.removeItem("authData")
    window.location.reload()
  };

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
  });


  // Handle security settings changes
  const handleSecurityChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === 'checkbox' ? checked : value,
    });
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

  return (
    <div className={`font-[family-name:var(--font-geist-sans)] ${isMobile ? "py-6" : "pb-6"}`}>
      {/* Header */}
      <div className="">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences</p>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col max-w-6xl mx-auto w-full pb-4 gap-6">
        <div className="border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px">
            {['profile', 'security', 'billing'].map((tab) => (
              <li className="mr-2" key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`inline-block py-4 px-4 text-sm font-medium border-b-2 ${activeTab === tab
                    ? 'text-pink-600 border-pink-600'
                    : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>

              </li>
            ))}
            {!isMobile && (<div className="ml-auto flex items-center space-x-1">
              <button
                onClick={handleLogout}
                className="flex items-center text-sm px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
              >
                <LogOut size={15} className="mr-1" />
                <span>Logout</span>
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex text-sm items-center px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
              >
                <Trash2 size={15} className="mr-1" />
                <span>Delete</span>
              </button>
            </div>)}
          </ul>
        </div>

        {/* Content Area */}
        <div className="flex-grow">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <img
                    src={staff.photo?.length !== 0 && staff.photo !== "no image" ? staff.photo : `https://imageplaceholder.net/150x150`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-gray-100"
                  />
                  <div className="ml-4">
                    <button className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">
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
                    value={`${staff.firstName} ${staff.lastName}`}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
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
                      value={staff.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
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
                    value={staff.biography}
                    className="w-full p-2 border rounded-md h-24"
                    placeholder="Tell us about yourself"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
              {isMobile && (
                <div className="mt-[13px] flex items-center space-x-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-sm px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={15} className="mr-1" />
                    <span>Logout</span>
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex text-sm items-center px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={15} className="mr-1" />
                    <span>Delete Account</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "security" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-medium mb-4">Security Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-3">Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div></div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                  <button className="mt-3 px-4 py-2 bg-pink-600 text-white rounded-md text-sm hover:bg-pink-700">
                    Change Password
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-md font-medium mb-3">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="twoFactorAuth"
                        checked={securitySettings.twoFactorAuth}
                        onChange={handleSecurityChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-md font-medium mb-3">Session Timeout</h3>
                  <div>
                    <label className="block text-sm text-gray-500 mb-2">Automatically log out after inactivity</label>
                    <select
                      name="sessionTimeout"
                      value={securitySettings.sessionTimeout}
                      onChange={handleSecurityChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-md font-medium mb-3">Login History</h3>
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            IP Address
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Device
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">May 6, 2025 - 10:23 AM</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">192.168.1.1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Chrome on Windows</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Success</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">May 5, 2025 - 3:45 PM</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">192.168.1.1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Safari on macOS</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Success</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">May 4, 2025 - 9:12 AM</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">172.16.254.1</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Firefox on iOS</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Failed</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <button className="mt-3 px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm hover:bg-gray-300">
                    View Full History
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Billing Information</h2>

              <div className="mb-8 p-4 border rounded-md bg-pink-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Current Plan: Premium</h3>
                    <p className="text-sm text-gray-600">Your next billing date is June 1, 2025</p>
                  </div>
                  <button className="px-4 py-2 bg-white border border-pink-500 text-pink-600 rounded-md hover:bg-gray-50">
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
                        <button className="text-pink-600 hover:text-pink-800 mr-4">Edit</button>
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
                          <td className="py-3 px-4 text-sm text-gray-800">KES 1000</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Paid
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-pink-600 hover:text-pink-800 text-sm">
                              Download
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-sm text-gray-800">Apr 1, 2025</td>
                          <td className="py-3 px-4 text-sm text-gray-800">Premium Plan - Monthly</td>
                          <td className="py-3 px-4 text-sm text-gray-800">KES 1500</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Paid
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-pink-600 hover:text-pink-800 text-sm">
                              Download
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-sm text-gray-800">Mar 1, 2025</td>
                          <td className="py-3 px-4 text-sm text-gray-800">Premium Plan - Monthly</td>
                          <td className="py-3 px-4 text-sm text-gray-800">KES 500</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Paid
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-pink-600 hover:text-pink-800 text-sm">
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