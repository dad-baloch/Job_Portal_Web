import { Outlet } from 'react-router-dom'

import { Navbar } from '../common/Navbar'
import { Footer } from '../common/Footer'

export function AuthLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    )
}
