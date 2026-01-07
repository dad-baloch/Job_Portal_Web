import { Link, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Briefcase, Plus, FolderHeart } from 'lucide-react'
import clsx from 'clsx'

import { APP_NAME } from '../../constants'
import { useAuthStore } from '../../store/authStore'

function navLinkClass({ isActive }: { isActive: boolean }): string {
    return clsx(
        'relative px-1 py-2 text-sm font-medium transition-colors duration-200',
        isActive
            ? 'text-brand-dark'
            : 'text-gray-600 hover:text-brand'
    )
}

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const user = useAuthStore((s) => s.user)
    const role = useAuthStore((s) => s.role)
    const logout = useAuthStore((s) => s.logout)
    const location = useLocation()

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false)
    }, [location])

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={clsx(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled || mobileOpen ? 'glass shadow-sm py-2' : 'bg-transparent py-3 border-b border-transparent'
            )}
        >
            <div className="mx-auto max-w-7xl px-4 flex items-center justify-between gap-3">
                {/* Logo Area */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="md:w-10 md:h-10 w-8 h-8 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white shadow-lg shadow-brand/20 group-hover:shadow-brand/40 transition-all">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-brand-dark transition-colors">
                            {APP_NAME}
                        </span>
                        <span className="text-[0.65rem] uppercase tracking-widest font-semibold text-brand-dark/80">
                            by Daad
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <nav className="flex items-center gap-6">
                        <NavLink to="/jobs" className={navLinkClass}>
                            Find Jobs
                        </NavLink>

                        {user && role === 'job_seeker' && (
                            <>
                                <NavLink to="/dashboard/applications" className={navLinkClass}>
                                    Applications
                                </NavLink>
                                <NavLink to="/dashboard/saved-jobs" className={navLinkClass}>
                                    Saved
                                </NavLink>
                            </>
                        )}

                        {user && role === 'employer' && (
                            <>
                                <NavLink to="/dashboard/jobs/my-jobs" className={navLinkClass}>
                                    My Jobs
                                </NavLink>
                            </>
                        )}

                        {user && role === 'admin' && (
                            <>
                                <NavLink to="/dashboard/admin/jobs/pending" className={navLinkClass}>
                                    Pending Jobs
                                </NavLink>
                                <NavLink to="/dashboard/admin/companies/create" className={navLinkClass}>
                                    Create Company
                                </NavLink>
                            </>
                        )}
                    </nav>

                    <div className="h-6 w-px bg-gray-200" />

                    {/* Auth Actions */}
                    {!user ? (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/auth/login"
                                className="text-sm font-medium text-gray-700 hover:text-brand transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/auth/register"
                                className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-brand-dark transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Sign up
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            {user && role === 'employer' && (
                                <Link
                                    to="/dashboard/jobs/create"
                                    className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand-dark text-sm font-medium hover:bg-brand/20 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Post a Job
                                </Link>
                            )}

                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild>
                                    <button
                                        type="button"
                                        className="group flex items-center gap-2 text-sm text-gray-700 hover:text-black focus:outline-none"
                                    >
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center group-hover:border-brand/50 transition-colors">
                                            <User className="w-5 h-5 text-gray-600 group-hover:text-brand transition-colors" />
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-brand transition-colors" />
                                    </button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Portal>
                                    <DropdownMenu.Content
                                        sideOffset={8}
                                        align="end"
                                        className="min-w-56 rounded-xl border border-gray-100 bg-white/95 backdrop-blur-xl p-2 shadow-xl animate-fade-in z-50 text-left"
                                    >
                                        <div className="px-2 py-2 mb-2 border-b border-gray-100">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Signed in as</p>
                                            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                                        </div>

                                        <DropdownMenu.Item asChild>
                                            <Link
                                                to="/jobs"
                                                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand outline-none cursor-pointer transition-colors"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenu.Item>

                                        {role === 'job_seeker' && (
                                            <DropdownMenu.Item asChild>
                                                <Link
                                                    to="/dashboard/saved-jobs"
                                                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand outline-none cursor-pointer transition-colors"
                                                >
                                                    <FolderHeart className="w-4 h-4" />
                                                    Saved Jobs
                                                </Link>
                                            </DropdownMenu.Item>
                                        )}

                                        <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />

                                        <DropdownMenu.Item
                                            onSelect={() => logout()}
                                            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-red-600 hover:bg-red-50 outline-none cursor-pointer transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    className="md:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setMobileOpen((v) => !v)}
                    aria-label="Toggle navigation"
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-2 animate-slide-up h-[calc(100vh-60px)] overflow-y-auto w-full z-40">
                    <NavLink to="/jobs" className={navLinkClass}>
                        Find Jobs
                    </NavLink>

                    {user && role === 'job_seeker' && (
                        <>
                            <NavLink to="/dashboard/applications" className={navLinkClass}>
                                My Applications
                            </NavLink>
                            <NavLink to="/dashboard/saved-jobs" className={navLinkClass}>
                                Saved Jobs
                            </NavLink>
                        </>
                    )}

                    {user && role === 'employer' && (
                        <>
                            <NavLink to="/dashboard/jobs/create" className={navLinkClass}>
                                Post a Job
                            </NavLink>
                            <NavLink to="/dashboard/jobs/my-jobs" className={navLinkClass}>
                                My Jobs
                            </NavLink>
                        </>
                    )}

                    {user && role === 'admin' && (
                        <>
                            <NavLink to="/dashboard/admin/jobs/pending" className={navLinkClass}>
                                Pending Jobs
                            </NavLink>
                            <NavLink to="/dashboard/admin/companies/create" className={navLinkClass}>
                                Create Company
                            </NavLink>
                        </>
                    )}

                    <div className="h-px bg-gray-100 my-2" />

                    {!user ? (
                        <div className="flex flex-col gap-3 mt-2">
                            <Link to="/auth/login" className="flex items-center justify-center w-full px-4 py-3 rounded-xl border border-gray-200 font-medium text-gray-700 bg-gray-50">
                                Log in
                            </Link>
                            <Link to="/auth/register" className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-brand text-white font-medium shadow-lg shadow-brand/20">
                                Sign up
                            </Link>
                        </div>
                    ) : (
                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-red-600 mt-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Log out
                        </button>
                    )}
                </div>
            )}
        </header>
    )
}