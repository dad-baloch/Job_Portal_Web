import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Modal } from '../components/common/Modal'
import { Pagination } from '../components/common/Pagination'
import { Select } from '../components/common/Select'
import { JobCard } from '../components/jobs/JobCard'
import { useDeleteJob, useMyJobs } from '../hooks/useEmployerJobs'
import { getApiErrorMessage } from '../utils/apiErrors'

export function MyJobsPage() {
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(50)

    const { data, isLoading, isError } = useMyJobs({ page, perPage })
    const items = data?.items ?? []

    const deleteMutation = useDeleteJob()
    const [deleteId, setDeleteId] = useState<number | null>(null)

    return (
        <div className="mx-auto max-w-6xl">
            <Breadcrumbs />
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">My Jobs</h1>
                    <p className="text-sm text-gray-600">Jobs you created</p>
                </div>

                <div className="flex items-center gap-2">
                    <Link to="/dashboard/jobs/create">
                        <Button>Create</Button>
                    </Link>
                    <Select
                        value={String(perPage)}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value))
                            setPage(1)
                        }}
                    >
                        <option value="20">20 / page</option>
                        <option value="50">50 / page</option>
                        <option value="100">100 / page</option>
                    </Select>
                </div>
            </div>

            <div className="mt-6">
                {isError ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        Failed to load jobs.
                    </div>
                ) : null}

                {isLoading ? (
                    <Card>
                        <p className="text-sm text-gray-600">Loading…</p>
                    </Card>
                ) : items.length === 0 ? (
                    <Card>
                        <p className="text-sm text-gray-700">No jobs found on this page.</p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {items.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                view="list"
                                showApprovalStatus
                                rightAction={
                                    <div className="flex items-center gap-2">
                                        <Link to={`/dashboard/jobs/${job.id}/applicants`}>
                                            <Button variant="secondary">Applicant
                                                {typeof job.applications_count === 'number'
                                                    ? ` (${job.applications_count})`
                                                    : ''}
                                            </Button>
                                        </Link>
                                        <Link to={`/dashboard/jobs/${job.id}/edit`}>
                                            <Button variant="secondary">Edit</Button>
                                        </Link>
                                        <Button variant="danger" onClick={() => setDeleteId(job.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                )}

                {data ? (
                    <div className="mt-6">
                        <Pagination
                            page={data.page}
                            perPage={data.per_page}
                            total={data.total}
                            onPageChange={setPage}
                        />
                    </div>
                ) : null}
            </div>

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
