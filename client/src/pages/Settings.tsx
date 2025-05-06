import { useState } from 'react';
// import { useAppContext } from '@/context';

export default function Settings() {
    // const { user } = useAppContext();

    // State for different settings categories
    const [activeTab, setActiveTab] = useState('display');
    const [displaySettings, setDisplaySettings] = useState({
        darkMode: false,
        highContrast: false,
        fontSize: 'medium',
        language: 'english',
    });
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        sessionTimeout: '30',
    });

    // Handle display settings changes
    const handleDisplayChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setDisplaySettings({
            ...displaySettings,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Handle security settings changes
    const handleSecurityChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setSecuritySettings({
            ...securitySettings,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Tab navigation component
    const SettingsTabs = () => (
        <div className="mb-6 border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px">
                {['display', 'security', 'integrations'].map((tab) => (
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
            </ul>
        </div>
    );

    // Display settings content
    const DisplaySettings = () => (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-medium mb-4">Display Settings</h2>
            <div className="space-y-6">
                <div>
                    <h3 className="text-md font-medium mb-3">Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center p-4 border border-gray-200 rounded-md">
                            <input
                                id="light-mode"
                                type="radio"
                                name="darkMode"
                                value="false"
                                checked={!displaySettings.darkMode}
                                onChange={() => setDisplaySettings({ ...displaySettings, darkMode: false })}
                                className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 focus:ring-pink-500"
                            />
                            <label htmlFor="light-mode" className="ms-2 text-sm font-medium text-gray-900">
                                Light Mode
                            </label>
                        </div>
                        <div className="flex items-center p-4 border border-gray-200 rounded-md">
                            <input
                                id="dark-mode"
                                type="radio"
                                name="darkMode"
                                value="true"
                                checked={displaySettings.darkMode}
                                onChange={() => setDisplaySettings({ ...displaySettings, darkMode: true })}
                                className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 focus:ring-pink-500"
                            />
                            <label htmlFor="dark-mode" className="ms-2 text-sm font-medium text-gray-900">
                                Dark Mode
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-md font-medium mb-3">Accessibility</h3>
                    <div className="flex items-center mb-4">
                        <input
                            id="high-contrast"
                            type="checkbox"
                            name="highContrast"
                            checked={displaySettings.highContrast}
                            onChange={handleDisplayChange}
                            className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                        />
                        <label htmlFor="high-contrast" className="ms-2 text-sm font-medium text-gray-900">
                            High Contrast Mode
                        </label>
                    </div>
                </div>

                <div>
                    <h3 className="text-md font-medium mb-3">Font Size</h3>
                    <select
                        name="fontSize"
                        value={displaySettings.fontSize}
                        onChange={handleDisplayChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5"
                    >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="x-large">Extra Large</option>
                    </select>
                </div>

                <div>
                    <h3 className="text-md font-medium mb-3">Language</h3>
                    <select
                        name="language"
                        value={displaySettings.language}
                        onChange={handleDisplayChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5"
                    >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="chinese">Chinese</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <button className="px-4 py-2 bg-pink-600 text-white rounded-md text-sm hover:bg-pink-700">
                    Apply Settings
                </button>
            </div>
        </div>
    );

    // Security settings content
    const SecuritySettings = () => (
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
    );

    // Integrations settings content
    const IntegrationsSettings = () => (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-medium mb-4">Integrations & API</h2>
            <div className="space-y-6">
                <div>
                    <h3 className="text-md font-medium mb-3">Connected Services</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-pink-100 rounded-md flex items-center justify-center mr-3">
                                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-medium">Calendar</h4>
                                    <p className="text-sm text-gray-500">Google Calendar</p>
                                </div>
                            </div>
                            <div>
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Connected</span>
                                <button className="ml-2 text-sm text-red-600 hover:text-red-800">Disconnect</button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center mr-3">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-medium">Email Integration</h4>
                                    <p className="text-sm text-gray-500">Microsoft Outlook</p>
                                </div>
                            </div>
                            <div>
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Connected</span>
                                <button className="ml-2 text-sm text-red-600 hover:text-red-800">Disconnect</button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-yellow-100 rounded-md flex items-center justify-center mr-3">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-medium">Document Storage</h4>
                                    <p className="text-sm text-gray-500">Dropbox</p>
                                </div>
                            </div>
                            <div>
                                <button className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800">Connect</button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center mr-3">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-medium">API Access</h4>
                                    <p className="text-sm text-gray-500">Generate API Key</p>
                                </div>
                            </div>
                            <div>
                                <button className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800">Generate</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button className="px-4 py-2 bg-pink-600 text-white rounded-md text-sm hover:bg-pink-700">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );

    // Main render return statement that was missing
    return (
        <div className="container mx-auto px-4 pb-6 max-w-6xl">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-gray-500">Manage your general settings and preferences</p>
            </div>

            <SettingsTabs />
            
            {activeTab === 'display' && <DisplaySettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'integrations' && <IntegrationsSettings />}
        </div>
    );
}