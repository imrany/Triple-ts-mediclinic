import { Outlet, Link } from 'react-router-dom';

import { ReactNode } from 'react';

interface MobileLayoutProps {
    children?: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
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
                    {children || <Outlet />}
                            <li><Link to="/settings">Settings</Link></li>
                        </ul>
                    </nav>
                </aside>
                <main className="layout-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}