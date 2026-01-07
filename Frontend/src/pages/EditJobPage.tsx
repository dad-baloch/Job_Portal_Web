import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Skeleton } from '../components/common/Skeleton'
import { JobForm } from '../components/jobs/JobForm'
import { useAuth } from '../hooks/useAuth'
import { useJob } from '../hooks/useJob'
import { useUpdateJob } from '../hooks/useEmployerJobs'
import { getApiErrorMessage } from '../utils/apiErrors'

export function EditJobPage() {
    const params = useParams()
    const jobId = Number(params.id)

    const { user } = useAuth()
    const { data: job, isLoading, isError } = useJob(jobId)

    const updateMutation = useUpdateJob(jobId)

    if (isLoading) {
        return (
            <div className="mx-auto max-w-3xl">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="mt-4 h-[360px]" />
            </div>
        )
    }

    if (isError || !job) {
        return (
            <div className="mx-auto max-w-3xl">
                <Card>
                    <p className="text-sm text-red-700">Failed to load job.</p>
                    <Link to="/dashboard/jobs/my-jobs">
                        <Button variant="secondary">Back</Button>
                    </Link>
                </Card>
            </div>
        )
    }

    if (user && job.created_by !== user.id) {
        return (
            <div className="mx-auto max-w-3xl">
                <Card>
                    <p className="text-sm text-red-700">Forbidden: you do not own this job.</p>
                    <Link to="/dashboard/jobs/my-jobs">
                        <Button variant="secondary">Back</Button>
                    </Link>
                </Card>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-3xl">
            <Breadcrumbs />
            <Card>
                <h1 className="text-2xl font-semibold">Edit Job</h1>
                <p className="mt-1 text-sm text-gray-600">Update your listing</p>

                <div className="mt-6">
                    <JobForm
                        mode="edit"
                        initialJob={job}
                        submitting={updateMutation.isPending}
                        onSubmit={async (payload) => {
                            try {
                                await updateMutation.mutateAsync(payload)
                                toast.success('Job updated')
                            } catch (err) {
                                toast.error(getApiErrorMessage(err))
                                throw err
                            }
                        }}
                    />
                </div>
            </Card>
        </div>
    )
}
