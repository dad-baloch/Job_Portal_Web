import { useMemo, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Modal } from '../components/common/Modal'
import { Pagination } from '../components/common/Pagination'
import { Select } from '../components/common/Select'
import { useAdminDeleteJob, useAdminJobs, useApproveJob, useDisapproveJob } from '../hooks/useAdminJobs'
import { formatRelativeDate } from '../utils/formatDate'
import { getApiErrorMessage } from '../utils/apiErrors'
import type { AdminApprovalFilter } from '../api/admin'
import { resetDemoData } from '../api/admin'

export function AdminPendingJobsPage() {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const perPage = 10

    const [approval, setApproval] = useState<AdminApprovalFilter>('pending')

    const jobs = useAdminJobs({ approval, page, perPage })
    const approve = useApproveJob()
    const disapprove = useDisapproveJob()
    const deleteMutation = useAdminDeleteJob()
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [isResetting, setIsResetting] = useState(false)

    const total = jobs.data?.total ?? 0
    // No longer strict need for totalPages memo here for manual buttons, but Pagination uses it internally or we pass props.
    // However, we can keep it if we want. But the Pagination component calculates it too.
    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / perPage)), [total, perPage])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [page])

    const handleReset = async () => {
        if (!window.confirm('Are you sure you want to reset all demo data? This will clear all temporary users and jobs, restoring the clean demo state. Permanent admin remains.')) {
            return
        }
        setIsResetting(true)
        try {
            await resetDemoData()
            toast.success('Demo data reset successfully!')
            window.location.reload()
        } catch (error) {
            toast.error(getApiErrorMessage(error))
        } finally {
            setIsResetting(false)
        }
    }

    return (
        <div className="mx-auto max-w-6xl space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Job Moderation</h1>
                    <p className="text-sm text-gray-600">Approve, disapprove, or delete jobs.</p>
                </div>
                <Button
                    variant="danger"
                    onClick={handleReset}
                    isLoading={isResetting}
                >
                    Smart Reset Demo Data
                </Button>
            </div>

            <Card>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-gray-700">
                        Showing: <span className="font-medium">{approval}</span>
                    </div>
                    <Select
                        value={approval}
                        onChange={(e) => {
                            setApproval(e.target.value as AdminApprovalFilter)
                            setPage(1)
                        }}
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="all">All</option>
                    </Select>
                </div>

                <div className="mt-4">
                    {jobs.isLoading ? (
                        <div className="text-sm text-gray-600">Loading…</div>
                    ) : jobs.isError ? (
                        <div className="text-sm text-red-600">{getApiErrorMessage(jobs.error)}</div>
                    ) : jobs.data?.items?.length ? (
                        <div className="space-y-3">
                            {jobs.data.items.map((job) => (
                                <div
                                    key={job.id}
                                    className="flex cursor-pointer flex-col gap-2 rounded-md border p-3 md:flex-row md:items-center md:justify-between"
                                    onClick={() => navigate(`/dashboard/admin/jobs/${job.id}`)}
                                >
                                    <div>
                                        <div className="font-medium">{job.title}</div>
                                        <div className="text-xs text-gray-600">
                                            {job.company?.name ? `${job.company.name} • ` : ''}
                                            {job.location} • Created {formatRelativeDate(job.created_at)}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {job.is_approved ? (
                                            <Button
                                                variant="secondary"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    toast.loading('Disapproving…', { id: `disapprove-${job.id}` })
                                                    disapprove.mutate(job.id, {
                                                        onSuccess: () =>
                                                            toast.success('Disapproved', { id: `disapprove-${job.id}` }),
                                                        onError: (err) =>
                                                            toast.error(getApiErrorMessage(err), { id: `disapprove-${job.id}` }),
                                                    })
                                                }}
                                                disabled={disapprove.isPending}
                                            >
                                                Disapprove
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    toast.loading('Approving…', { id: `approve-${job.id}` })
                                                    approve.mutate(job.id, {
                                                        onSuccess: () => toast.success('Approved', { id: `approve-${job.id}` }),
                                                        onError: (err) =>
                                                            toast.error(getApiErrorMessage(err), { id: `approve-${job.id}` }),
                                                    })
                                                }}
                                                disabled={approve.isPending}
                                            >
                                                Approve
                                            </Button>
                                        )}

                                        <Button
                                            variant="danger"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setDeleteId(job.id)
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-2">
                                <Pagination
                                    page={page}
                                    perPage={perPage}
                                    total={total}
                                    onPageChange={setPage}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-600">No jobs found.</div>
                    )}
                </div>
            </Card>

            <Modal
                open={deleteId != null}
                onOpenChange={(open) => setDeleteId(open ? deleteId : null)}
                title="Delete job"
                description="This action cannot be undone."
                footer={
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            disabled={deleteMutation.isPending || deleteId == null}
                            onClick={async () => {
                                if (deleteId == null) return
                                try {
                                    await deleteMutation.mutateAsync(deleteId)
                                    toast.success('Job deleted')
                                    setDeleteId(null)
                                } catch (err) {
                                    toast.error(getApiErrorMessage(err))
                                }
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                }
            >
                <p className="text-sm text-gray-700">Delete this job?</p>
            </Modal>
        </div>
    )
}
