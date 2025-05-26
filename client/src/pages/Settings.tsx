import { useState } from "react";
import {
  LogOut,
  Trash2,
} from "lucide-react";
import useIsMobile from "@/hooks/useIsMobile";
import { useAppContext } from "@/context";
import { Staff } from "@/types";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

export default function Settings() {
  const { staff } = useAppContext() as {
    staff: Staff
  }
  const { api_url, authData } = useAppContext()
  const [activeTab, setActiveTab] = useState("profile");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isMobile = useIsMobile()

  // Mock user data
  const [userData, setUserData] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    password: "••••••••••",
    biography: "",
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


  const handleSaveChanges = () => {
    alert("Changes saved successfully!");
    // In a real app, you would save the changes to the backend
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${api_url}/api/staff/${staff.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authData?.token}`
        }
      })
      const parseRes = await response.json()
      if (parseRes.error) {
        toast.error(parseRes.error, {
          description: parseRes.details ? parseRes.details : "Failed to delete account, try again",
          action: {
            label: "Retry",
            onClick: () => handleDeleteAccount()
          },
        });
      } else {
        toast.success(parseRes.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error("Something went wrong!", {
        description: errorMessage,
        action: {
          label: "Retry",
          onClick: () => handleDeleteAccount()
        },
      });
    } finally {
      setShowDeleteConfirm(false);
    }
  }

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
            {['profile', 'security'].map((tab) => (
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
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

              <div className="w-24 mb-4 sm:text-3xl h-24 max-sm:w-16 max-sm:h-16 rounded-full border-4 border-pink-100 bg-pink-500 text-white flex items-center justify-center mr-2">
                {(staff ? getInitials(`${staff.firstName} ${staff.lastName}`) : 'JD')}
              </div>

              <div className="space-y-4">
                <div className="text-gray-700 text-sm">
                  <label className="block font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={`${staff.firstName} ${staff.lastName}`}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="text-gray-700 text-sm">
                  <label className="block font-medium mb-1">
                    Email Address
                  </label>
                  <div className="flex">
                    <input
                      type="email"
                      defaultValue={staff.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>

                <div className="text-gray-700 text-sm">
                  <label className="block font-medium mb-1">
                    Biography
                  </label>
                  <textarea
                    defaultValue={staff.biography}
                    onChange={(e) => setUserData({ ...userData, biography: e.target.value })}
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
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div onDoubleClick={() => setShowDeleteConfirm(false)} className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-md border-[1px]">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Account</h3>
            <p className="mb-4 text-gray-800">
              Are you sure you want to delete your account? <br /> This action cannot be undone and all your data will be permanently lost.
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