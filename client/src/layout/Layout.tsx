import { useAppContext } from '@/context';
import useIsMobile from '@/hooks/useIsMobile';
import { ReactNode, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { orgName }=useAppContext()
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile()

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dashboard/appointments", label: "Appointments" },
    { path: "/dashboard/patients", label: "Patients" },
    { path: "/dashboard/doctors", label: "Doctors" },
    { path: "/dashboard/calendar", label: "Calendar" },
    { path: "/dashboard/pharmacy", label: "Pharmacy" },
    { path: "/dashboard/laboratory", label: "Laboratory" },
    { path: "/dashboard/settings", label: "Settings" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)] no-scrollbar">
      {/* Header */}
      {isMobile && (
        <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            <h1 className="text-xl md:text-2xl font-bold text-pink-600">{orgName}</h1>
            
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </header>
      )}

      <div className={`${isMobile&&"mt-[56px]"} border-[1px] flex h-screen`}>
        {/* Sidebar for mobile - overlay style when open */}
        <aside
          className={`fixed md:static inset-y-0 right-0 transform ${sidebarOpen ? "translate-x-0" : "translate-x-full"
            } md:translate-x-0 transition duration-200 ease-in-out z-20 bg-white w-64 shadow-lg md:shadow-md overflow-y-auto`}
        >
          <nav className="p-4 space-y-1">
            <h2 className="text-lg font-semibold text-pink-600 mb-3">{orgName}</h2>
            {/* Logo for desktop */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path
                    ? "bg-pink-50 text-pink-600"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
                onClick={() => {
                  if (sidebarOpen) setSidebarOpen(false);
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-200 bg-opacity-50 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar ${location.pathname === "/dashboard" ? "bg-gradient-to-b from-blue-50 to-white" : ""}`}>
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}