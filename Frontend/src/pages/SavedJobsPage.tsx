import { useMemo } from 'react'
import toast from 'react-hot-toast'

import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Spinner } from '../components/common/Spinner'
import { JobCard } from '../components/jobs/JobCard'
import { useAuth } from '../hooks/useAuth'
import { useApplyToJob } from '../hooks/useApplications'
import { useSavedJobs, useUnsaveJob } from '../hooks/useSavedJobs'

export function SavedJobsPage() {
    const { role, isAuthenticated } = useAuth()
    const enabled = isAuthenticated && role === 'job_seeker'

    const { data, isLoading, isError } = useSavedJobs(enabled)
    const unsaveMutation = useUnsaveJob()
    const applyMutation = useApplyToJob()

    const items = useMemo(() => data ?? [], [data])

    return (
        <div className="mx-auto max-w-6xl">
            <Breadcrumbs />
            <div>
                <h1 className="text-2xl font-semibold">Saved Jobs</h1>
                <p className="text-sm text-gray-600">Jobs you bookmarked</p>
            </div>

            <div className="mt-6">
                {isLoading ? <Spinner label="Loading saved jobs…" /> : null}
                {isError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        Failed to load saved jobs.
                    </div>
                ) : null}

                {!isLoading && items.length === 0 ? (
                    <Card>
                        <p className="text-sm text-gray-700">No saved jobs yet.</p>
                        <p className="mt-1 text-xs text-gray-500">Save a job to see it here.</p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {items.map((saved) => (
                            <JobCard
                                key={saved.id}
                                job={saved.job}
                                view="list"
                                rightAction={
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="secondary"
                                            disabled={unsaveMutation.isPending}
                                            onClick={() => {
                                                unsaveMutation.mutate(saved.job_id, {
                                                    onSuccess: () => toast.success('Removed from saved jobs'),
                                                    onError: () => toast.error('Failed to unsave job'),
                                                })
                                            }}
                                        >
                                            Unsave
                                        </Button>
                                        <Button
                                            disabled={applyMutation.isPending}
                                            onClick={() => {
                                                applyMutation.mutate(
                                                    { job_id: saved.job_id },
                                                    {
                                                        onSuccess: () => toast.success('Application submitted'),
                                                        onError: () => toast.error('Failed to apply'),
                                                    },
                                                )
                                            }}
                                        >
                                            Quick apply
                                        </Button>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
