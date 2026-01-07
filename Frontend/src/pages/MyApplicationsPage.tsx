import { useMemo, useState } from 'react'

import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { Card } from '../components/common/Card'
import { Select } from '../components/common/Select'
import { Spinner } from '../components/common/Spinner'
import { ApplicationCard } from '../components/applications/ApplicationCard'
import type { ApplicationStatus } from '../types/application.types'
import { useAuth } from '../hooks/useAuth'
import { useMyApplications } from '../hooks/useApplications'

const ALL = 'all' as const

export function MyApplicationsPage() {
    const { role, isAuthenticated } = useAuth()
    const enabled = isAuthenticated && role === 'job_seeker'

    const { data, isLoading, isError } = useMyApplications(enabled)
    const [status, setStatus] = useState<ApplicationStatus | typeof ALL>(ALL)

    const items = useMemo(() => {
        const list = data ?? []
        const filtered = status === ALL ? list : list.filter((a) => a.status === status)
        return filtered.slice().sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    }, [data, status])

    return (
        <div className="mx-auto max-w-6xl">
            <Breadcrumbs />
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">My Applications</h1>
                    <p className="text-sm text-gray-600">Track your application status</p>
                </div>

                <div className="w-56">
                    <Select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value as ApplicationStatus | typeof ALL)
                        }
                    >
                        <option value={ALL}>All</option>
                        <option value="pending">Pending</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                    </Select>
                </div>
            </div>

            <div className="mt-6">
                {isLoading ? <Spinner label="Loading applications…" /> : null}
                {isError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        Failed to load applications.
                    </div>
                ) : null}

                {!isLoading && items.length === 0 ? (
                    <Card>
                        <p className="text-sm text-gray-700">No applications found.</p>
                        <p className="mt-1 text-xs text-gray-500">Apply to a job to see it here.</p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {items.map((app) => (
                            <ApplicationCard key={app.id} application={app} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
