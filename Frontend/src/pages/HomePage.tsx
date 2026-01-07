import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'

import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Skeleton } from '../components/common/Skeleton'
import { JobCard } from '../components/jobs/JobCard'
import { login } from '../api/auth'
import { fetchJobs } from '../api/jobs'
import { useAuthStore } from '../store/authStore'
import { getApiErrorMessage } from '../utils/apiErrors'
import type { UserRole } from '../types/auth.types'

const DEMO = {
    job_seeker: { email: 'seeker@example.com', password: 'Password123!' },
    employer: { email: 'employer@example.com', password: 'Password123!' },
    admin: { email: 'admin@example.com', password: 'Password123!' },
} as const

export function HomePage() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((s) => s.setAuth)
    const logout = useAuthStore((s) => s.logout)
    const user = useAuthStore((s) => s.user)
    const isDemo = useAuthStore((s) => s.isDemo)
    const [demoLoading, setDemoLoading] = useState<UserRole | null>(null)

    const latestJobs = useQuery({
        queryKey: ['jobs', 'home-latest'],
        queryFn: () => fetchJobs({ filters: {}, page: 1, perPage: 6 }),
        staleTime: 60 * 1000,
    })

    async function handleDemoLogin(role: Exclude<UserRole, 'job_seeker'> | 'job_seeker') {
        try {
            setDemoLoading(role)
            toast.loading('Signing in…', { id: 'demo-login' })
            const creds = DEMO[role]
            const res = await login({ email: creds.email, password: creds.password })
            setAuth({ token: res.token, user: res.user, rememberMe: false, isDemo: true })
            toast.success('Signed in', { id: 'demo-login' })

            if (res.user.role === 'admin') navigate('/dashboard/admin/jobs/pending')
            else if (res.user.role === 'employer') navigate('/dashboard/jobs/my-jobs')
            else navigate('/jobs')
        } catch (err) {
            toast.error(getApiErrorMessage(err), { id: 'demo-login' })
        } finally {
            setDemoLoading(null)
        }
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid gap-8 md:grid-cols-2 md:items-start">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Find your next role</h1>
                    <p className="mt-2 text-gray-600">
                        Browse open positions, save listings, and track your applications.
                    </p>

                    <div className="mt-6 space-y-4">
                        {user && !isDemo ? (
                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        logout()
                                        toast.success('Logged out')
                                    }}
                                >
                                    Logout
                                </Button>
                                <div className="text-sm text-gray-600">Signed in as {user.email}</div>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Link to="/jobs">
                                        <Button>Browse Jobs</Button>
                                    </Link>
                                    <Link to="/auth/login">
                                        <Button variant="secondary">Login</Button>
                                    </Link>
                                    <Link to="/auth/register">
                                        <Button variant="secondary">Create Account</Button>
                                    </Link>
                                </div>

                                <Card className="p-4">
                                    <div className="text-sm font-medium text-gray-800">Try demo roles</div>
                                    <div className="mt-1 text-xs text-gray-600">
                                        Quick role-based tour of the app.
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-3">
                                        <Button
                                            variant="secondary"
                                            onClick={() => void handleDemoLogin('job_seeker')}
                                            disabled={demoLoading !== null}
                                        >
                                            Visit as Job Seeker
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => void handleDemoLogin('employer')}
                                            disabled={demoLoading !== null}
                                        >
                                            Visit as Employer
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => void handleDemoLogin('admin')}
                                            disabled={demoLoading !== null}
                                        >
                                            Visit as Admin
                                        </Button>
                                    </div>

                                    {user ? (
                                        <div className="mt-3 flex flex-wrap items-center gap-3">
                                            <Button
                                                onClick={() => {
                                                    if (user.role === 'admin') navigate('/dashboard/admin/jobs/pending')
                                                    else if (user.role === 'employer') navigate('/dashboard/jobs/my-jobs')
                                                    else navigate('/dashboard/applications')
                                                }}
                                            >
                                                Go to Dashboard
                                            </Button>
                                            <div className="text-sm text-gray-600">Signed in as {user.email}</div>
                                            <Button
                                                variant="danger"
                                                onClick={() => {
                                                    logout()
                                                    toast.success('Logged out')
                                                }}
                                            >
                                                Logout
                                            </Button>
                                        </div>
                                    ) : null}
                                </Card>
                            </>
                        )}
                    </div>
                </div>

                <Card className="p-5">
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-gray-800">Get started</p>
                            <p className="mt-1 text-sm text-gray-600">
                                Explore jobs now, then log in when you're ready.
                            </p>
                        </div>

                        <div className="grid gap-2 text-sm text-gray-700">
                            <div className="flex items-start gap-2">
                                <span className="mt-0.5">•</span>
                                <span>Use filters to quickly narrow results</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="mt-0.5">•</span>
                                <span>Save jobs and track application status</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="mt-0.5">•</span>
                                <span>Employers can review applicants per job</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Link to="/jobs">
                                <Button className="w-full">Explore Jobs</Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mt-10">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-semibold">Latest Jobs</h2>
                        <p className="mt-1 text-sm text-gray-600">A few recent listings to get you started.</p>
                    </div>
                </div>

                <div className="mt-4">
                    {latestJobs.isLoading ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-[140px]" />
                            ))}
                        </div>
                    ) : latestJobs.isError ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            Failed to load jobs.
                        </div>
                    ) : latestJobs.data?.items?.length ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {latestJobs.data.items.map((job) => (
                                <JobCard key={job.id} job={job} view="grid" />
                            ))}
                        </div>
                    ) : (
                        <Card className="p-6">
                            <div className="text-sm text-gray-700">No jobs available right now.</div>
                            <div className="mt-3">
                                <Link to="/jobs">
                                    <Button variant="secondary">Browse Jobs</Button>
                                </Link>
                            </div>
                        </Card>
                    )}
                </div>
                <div className="flex flex-wrap items-end justify-end gap-3">
                    <Link to="/jobs">
                        <Button variant="secondary">Show more jobs</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
