import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { Card } from '../components/common/Card'
import { Spinner } from '../components/common/Spinner'
import { useAuth } from '../hooks/useAuth'
import { useApplicantsForJob } from '../hooks/useApplicants'
import { useUpdateApplicationStatus } from '../hooks/useApplications'
import type { ApplicationStatus } from '../types/application.types'
import { getApiErrorMessage } from '../utils/apiErrors'
import { formatRelativeDate } from '../utils/formatDate'

const statusOptions: Array<{ value: ApplicationStatus; label: string }> = [
    { value: 'pending', label: 'Pending' },
    { value: 'reviewing', label: 'Reviewing' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'hired', label: 'Hired' },
]

export function JobApplicantsPage() {
    const params = useParams()
    const jobId = Number(params.id)
    const updateStatus = useUpdateApplicationStatus()

    const { role, isAuthenticated } = useAuth()
    const enabled = isAuthenticated && role === 'employer'

    const { data, isLoading, isError, error } = useApplicantsForJob(jobId, enabled)

    const items = useMemo(() => {
        const list = data ?? []
        return list.slice().sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    }, [data])

    return (
        <div className="mx-auto max-w-6xl">
            <Breadcrumbs />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">Applicants</h1>
                    <p className="text-sm text-gray-600">People who applied to this job</p>
                </div>
                <Link to="/dashboard/jobs/my-jobs" className="text-sm text-gray-700 hover:underline">
                    Back to My Jobs
                </Link>
            </div>

            <div className="mt-6">
                {isLoading ? <Spinner label="Loading applicants…" /> : null}
                {isError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {getApiErrorMessage(error)}
                    </div>
                ) : null}

                {!isLoading && items.length === 0 ? (
                    <Card>
                        <p className="text-sm text-gray-700">No applications yet.</p>
                        <p className="mt-1 text-xs text-gray-500">Check back later.</p>
                    </Card>
                ) : (
                    <div className="grid gap-3">
                        {items.map((app) => (
                            <Card key={app.id} className="p-4">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <div className="font-medium">
                                            {app.applicant_profile?.full_name || app.applicant?.email || 'Applicant'}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {app.applicant?.email ? <span>{app.applicant.email}</span> : null}
                                            {app.applicant_profile?.location ? (
                                                <span> • {app.applicant_profile.location}</span>
                                            ) : null}
                                            <span> • Status</span>
                                            <select
                                                className="select select-bordered select-sm"
                                                value={app.status}
                                                disabled={updateStatus.isPending}
                                                onChange={(e) => {
                                                    const next = e.target.value as ApplicationStatus
                                                    updateStatus.mutate(
                                                        {
                                                            applicationId: app.id,
                                                            status: next,
                                                            jobId,
                                                        },
                                                        {
                                                            onSuccess: () => toast.success('Application status updated'),
                                                            onError: () => toast.error('Failed to update status'),
                                                        },
                                                    )
                                                }}
                                            >
                                                {statusOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <span> • Applied {formatRelativeDate(app.created_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                {app.cover_letter ? (
                                    <div className="mt-3 text-sm text-gray-700">
                                        <div className="text-xs font-medium text-gray-500">Cover letter</div>
                                        <div className="mt-1 whitespace-pre-wrap">{app.cover_letter}</div>
                                    </div>
                                ) : null}

                                {app.applicant_profile?.resume_url ? (
                                    <div className="mt-3 text-sm">
                                        <a
                                            href={app.applicant_profile.resume_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-gray-700 underline"
                                        >
                                            View resume
                                        </a>
                                    </div>
                                ) : null}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
