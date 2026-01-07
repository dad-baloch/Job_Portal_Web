import { Outlet } from 'react-router-dom'

import { Navbar } from '../common/Navbar'

export function DashboardLayout() {
    return (
        <div className="min-h-screen flex flex-col relative">
            <Navbar />
            <main className="flex-1 p-4 pt-20 max-w-7xl mx-auto w-full">
                <Outlet />
            </main>
        </div>
    )
}
