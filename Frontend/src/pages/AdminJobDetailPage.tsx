import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Spinner } from '../components/common/Spinner'
import { fetchJob } from '../api/jobs'
import { useAdminDeleteJob, useApproveJob, useDisapproveJob } from '../hooks/useAdminJobs'
import { getApiErrorMessage } from '../utils/apiErrors'
import { formatRelativeDate } from '../utils/formatDate'

export function AdminJobDetailPage() {
    const params = useParams()
    const jobId = Number(params.id)

    const navigate = useNavigate()
    const qc = useQueryClient()

    const approve = useApproveJob()
    const disapprove = useDisapproveJob()
    const deleteJob = useAdminDeleteJob()

    const jobQuery = useQuery({
        queryKey: ['job', jobId],
        queryFn: () => fetchJob(jobId),
        enabled: Number.isFinite(jobId) && jobId > 0,
    })

    const job = jobQuery.data

    return (
        <div className="mx-auto max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">Job Details</h1>
                    <p className="text-sm text-gray-600">Review and moderate this job.</p>
                </div>
                <Link to="/dashboard/admin/jobs/pending" className="text-sm text-gray-700 hover:underline">
                    Back to Moderation
                </Link>
            </div>

            {jobQuery.isLoading ? <Spinner label="Loading job…" /> : null}

            {jobQuery.isError ? (
                <Card>
                    <div className="text-sm text-red-600">{getApiErrorMessage(jobQuery.error)}</div>
                </Card>
            ) : null}

            {job ? (
                <Card className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <div className="text-xl font-semibold">{job.title}</div>
                            <div className="mt-1 text-sm text-gray-600">
                                {job.company?.name ? <span>{job.company.name}</span> : <span>Company</span>}
                                {job.location ? <span> • {job.location}</span> : null}
                                <span> • Posted {formatRelativeDate(job.created_at)}</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-700">
                                <span className="font-medium">Approval:</span>{' '}
                                {job.is_approved ? 'approved' : 'pending approval'}
                                <span className="mx-2">•</span>
                                <span className="font-medium">Status:</span> {job.status}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {job.is_approved ? (
                                <Button
                                    variant="secondary"
                                    disabled={disapprove.isPending || deleteJob.isPending}
                                    onClick={() => {
                                        toast.loading('Disapproving…', { id: `disapprove-${job.id}` })
                                        disapprove.mutate(job.id, {
                                            onSuccess: async () => {
                                                toast.success('Disapproved', { id: `disapprove-${job.id}` })
                                                await qc.invalidateQueries({ queryKey: ['job', jobId] })
                                            },
                                            onError: (err) =>
                                                toast.error(getApiErrorMessage(err), { id: `disapprove-${job.id}` }),
                                        })
                                    }}
                                >
                                    Disapprove
                                </Button>
                            ) : (
                                <Button
                                    disabled={approve.isPending || deleteJob.isPending}
                                    onClick={() => {
                                        toast.loading('Approving…', { id: `approve-${job.id}` })
                                        approve.mutate(job.id, {
                                            onSuccess: async () => {
                                                toast.success('Approved', { id: `approve-${job.id}` })
                                                await qc.invalidateQueries({ queryKey: ['job', jobId] })
                                            },
                                            onError: (err) =>
                                                toast.error(getApiErrorMessage(err), { id: `approve-${job.id}` }),
                                        })
                                    }}
                                >
                                    Approve
                                </Button>
                            )}

                            <Button
                                variant="danger"
                                disabled={approve.isPending || disapprove.isPending || deleteJob.isPending}
                                onClick={async () => {
                                    const ok = window.confirm('Delete this job? This cannot be undone.')
                                    if (!ok) return
                                    try {
                                        await deleteJob.mutateAsync(job.id)
                                        toast.success('Job deleted')
                                        navigate('/dashboard/admin/jobs/pending')
                                    } catch (err) {
                                        toast.error(getApiErrorMessage(err))
                                    }
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="text-xs font-medium text-gray-500">Description</div>
                        <div className="mt-1 whitespace-pre-wrap text-sm text-gray-800">{job.description}</div>
                    </div>
                </Card>
            ) : null}
        </div>
    )
}
