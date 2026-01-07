import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import { APP_NAME } from '../../constants'
import { useAuthStore } from '../../store/authStore'

function navLinkClass({ isActive }: { isActive: boolean }): string {
    return isActive
        ? 'text-sm font-medium text-black'
        : 'text-sm text-gray-600 hover:text-black'
}

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const user = useAuthStore((s) => s.user)
    const role = useAuthStore((s) => s.role)
    const logout = useAuthStore((s) => s.logout)

    return (
        <header className="border-b bg-white">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
                <Link to="/" className="font-semibold text-lg">
                    {APP_NAME}
                </Link>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="md:hidden rounded-md border px-3 py-2 text-sm"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label="Toggle navigation"
                    >
                        Menu
                    </button>

                    <nav className="hidden md:flex items-center gap-4">
                        <NavLink to="/jobs" className={navLinkClass}>
                            Jobs
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
                                    Create Job
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
                            </>
                        )}

                        {!user ? (
                            <>
                                <NavLink to="/auth/login" className={navLinkClass}>
                                    Login
                                </NavLink>
                                <NavLink to="/auth/register" className={navLinkClass}>
                                    Register
                                </NavLink>
                            </>
                        ) : (
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild>
                                    <button
                                        type="button"
                                        className="text-sm text-gray-700 hover:text-black rounded-md border px-3 py-2"
                                    >
                                        {user.email}
                                    </button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Portal>
                                    <DropdownMenu.Content
                                        sideOffset={8}
                                        className="min-w-48 rounded-md border bg-white p-1 shadow"
                                    >
                                        <DropdownMenu.Item asChild>
                                            <Link
                                                to="/jobs"
                                                className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Browse jobs
                                            </Link>
                                        </DropdownMenu.Item>

                                        {role === 'job_seeker' ? (
                                            <>
                                                <DropdownMenu.Item asChild>
                                                    <Link
                                                        to="/dashboard/applications"
                                                        className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        My applications
                                                    </Link>
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item asChild>
                                                    <Link
                                                        to="/dashboard/saved-jobs"
                                                        className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Saved jobs
                                                    </Link>
                                                </DropdownMenu.Item>
                                            </>
                                        ) : null}

                                        {role === 'employer' ? (
                                            <>
                                                <DropdownMenu.Item asChild>
                                                    <Link
                                                        to="/dashboard/jobs/create"
                                                        className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Create job
                                                    </Link>
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item asChild>
                                                    <Link
                                                        to="/dashboard/jobs/my-jobs"
                                                        className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        My jobs
                                                    </Link>
                                                </DropdownMenu.Item>
                                            </>
                                        ) : null}

                                        {role === 'admin' ? (
                                            <>
                                                <DropdownMenu.Item asChild>
                                                    <Link
                                                        to="/dashboard/admin/jobs/pending"
                                                        className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Pending jobs
                                                    </Link>
                                                </DropdownMenu.Item>
                                            </>
                                        ) : null}

                                        <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
                                        <DropdownMenu.Item
                                            className="cursor-pointer rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onSelect={(e) => {
                                                e.preventDefault()
                                                logout()
                                            }}
                                        >
                                            Logout
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Portal>
                            </DropdownMenu.Root>
                        )}
                    </nav>
                </div>
            </div>

            {mobileOpen ? (
                <div className="md:hidden border-t bg-white">
                    <nav className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3">
                        <NavLink to="/jobs" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                            Jobs
                        </NavLink>

                        {user && role === 'job_seeker' ? (
                            <>
                                <NavLink
                                    to="/dashboard/applications"
                                    className={navLinkClass}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    My Applications
                                </NavLink>
                                <NavLink
                                    to="/dashboard/saved-jobs"
                                    className={navLinkClass}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Saved Jobs
                                </NavLink>
                            </>
                        ) : null}

                        {user && role === 'employer' ? (
                            <>
                                <NavLink
                                    to="/dashboard/jobs/create"
                                    className={navLinkClass}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Create Job
                                </NavLink>
                                <NavLink
                                    to="/dashboard/jobs/my-jobs"
                                    className={navLinkClass}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    My Jobs
                                </NavLink>
                            </>
                        ) : null}

                        {user && role === 'admin' ? (
                            <NavLink
                                to="/dashboard/admin/jobs/pending"
                                className={navLinkClass}
                                onClick={() => setMobileOpen(false)}
                            >
                                Pending Jobs
                            </NavLink>
                        ) : null}

                        {!user ? (
                            <>
                                <NavLink
                                    to="/auth/login"
                                    className={navLinkClass}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/auth/register"
                                    className={navLinkClass}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Register
                                </NavLink>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="text-left text-sm text-gray-600 hover:text-black"
                                onClick={() => {
                                    logout()
                                    setMobileOpen(false)
                                }}
                            >
                                Logout
                            </button>
                        )}
                    </nav>
                </div>
            ) : null}
        </header>
    )
}
