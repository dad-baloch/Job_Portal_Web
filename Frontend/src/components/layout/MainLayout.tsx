import { Outlet } from 'react-router-dom'

import { Navbar } from '../common/Navbar'
import { Footer } from '../common/Footer'

export function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col relative">
            <Navbar />
            <main className="flex-1 pt-16">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
