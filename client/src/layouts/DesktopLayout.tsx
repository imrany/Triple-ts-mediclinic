import { ReactNode } from 'react';
import { Outlet, Link } from 'react-router-dom';

interface MobileLayoutProps {
    children?: ReactNode;
}

export default function DesktopLayout({ children }: MobileLayoutProps) {
    return (
        <div className="layout">
            <header className="layout-header">
                <h1>Medical System</h1>
            </header>
            <div className="layout-body">
                <aside className="layout-sidebar">
                    <nav>
                        <ul>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to="/appointments">Appointments</Link></li>
                            <li><Link to="/patients">Patients</Link></li>
                            <li><Link to="/doctors">Doctors</Link></li>
                            <li><Link to="/settings">Settings</Link></li>
                        </ul>
                    </nav>
                </aside>
                <main className="layout-content">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    )
};