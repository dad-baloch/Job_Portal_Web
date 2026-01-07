import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Modal } from '../components/common/Modal'
import { Skeleton } from '../components/common/Skeleton'
import { ApplicationForm } from '../components/applications/ApplicationForm'
import { useAuth } from '../hooks/useAuth'
import { useJob } from '../hooks/useJob'
import { useApplyToJob, useMyApplications } from '../hooks/useApplications'
import { useSavedJobs, useSaveJob, useUnsaveJob } from '../hooks/useSavedJobs'
import { formatRelativeDate } from '../utils/formatDate'
import { formatSalaryRange } from '../utils/formatSalary'
import { sanitizeHtml } from '../utils/sanitizeHtml'

export function JobDetailPage() {
    const params = useParams()
    const jobId = Number(params.id)
    const { role, isAuthenticated } = useAuth()

    const { data: job, isLoading, isError } = useJob(jobId)

    const seekerEnabled = isAuthenticated && role === 'job_seeker'
    const { data: saved } = useSavedJobs(seekerEnabled)
    const { data: applications } = useMyApplications(seekerEnabled)

    const isSaved = useMemo(() => saved?.some((s) => s.job_id === jobId) ?? false, [saved, jobId])
    const hasApplied = useMemo(
        () => applications?.some((a) => a.job_id === jobId) ?? false,
        [applications, jobId],
    )

    const saveMutation = useSaveJob()
    const unsaveMutation = useUnsaveJob()
    const applyMutation = useApplyToJob()

    const [applyOpen, setApplyOpen] = useState(false)

    if (isLoading) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-6">
                <Skeleton className="h-8 w-1/3" />
                <div className="mt-4 grid gap-4">
                    <Skeleton className="h-[220px]" />
                    <Skeleton className="h-[220px]" />
                </div>
            </div>
        )
    }

    if (isError || !job) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-10">
                <p className="text-sm text-red-700">Job not found.</p>
                <Link className="text-sm underline" to="/jobs">
                    Back to jobs
                </Link>
            </div>
        )
    }

    const safeDescription = sanitizeHtml(job.description)

    return (
        <div className="mx-auto max-w-6xl px-4 py-6">
            <Breadcrumbs />

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">{job.title}</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        {job.company?.name ?? 'Company'}
                        {job.location ? ` • ${job.location}` : ''}
                        {job.is_remote ? ' • Remote' : ''}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                        {formatSalaryRange(job.salary_min, job.salary_max)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        Posted {formatRelativeDate(job.created_at)}
                    </p>
                </div>

                {role === 'job_seeker' ? (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            disabled={!seekerEnabled || saveMutation.isPending || unsaveMutation.isPending}
                            onClick={() => {
                                if (!seekerEnabled) {
                                    toast.error('Login as a job seeker to save jobs')
                                    return
                                }
                                if (isSaved) {
                                    unsaveMutation.mutate(jobId, {
                                        onSuccess: () => toast.success('Removed from saved jobs'),
                                        onError: () => toast.error('Failed to unsave job'),
                                    })
                                } else {
                                    saveMutation.mutate({ jobId, job }, {
                                        onSuccess: () => toast.success('Saved job'),
                                        onError: () => toast.error('Failed to save job'),
                                    })
                                }
                            }}
                        >
                            {isSaved ? 'Unsave' : 'Save'}
                        </Button>

                        <Button
                            disabled={!seekerEnabled || hasApplied || applyMutation.isPending}
                            onClick={() => {
                                if (!seekerEnabled) {
                                    toast.error('Login as a job seeker to apply')
                                    return
                                }
                                setApplyOpen(true)
                            }}
                        >
                            {hasApplied ? 'Applied' : 'Apply'}
                        </Button>
                    </div>
                ) : null}
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[2fr_1fr]">
                <Card>
                    <h2 className="font-semibold">Description</h2>
                    <div
                        className="prose prose-sm mt-3 max-w-none"
                        dangerouslySetInnerHTML={{ __html: safeDescription }}
                    />
                </Card>

                <Card>
                    <h2 className="font-semibold">Company</h2>
                    {job.company ? (
                        <div className="mt-3 space-y-2 text-sm text-gray-700">
                            <div>
                                <span className="font-medium">Name:</span> {job.company.name}
                            </div>
                            {job.company.location ? (
                                <div>
                                    <span className="font-medium">Location:</span> {job.company.location}
                                </div>
                            ) : null}
                            {job.company.website ? (
                                <div>
                                    <span className="font-medium">Website:</span> {job.company.website}
                                </div>
                            ) : null}
                            {job.company.description ? (
                                <p className="text-gray-600">{job.company.description}</p>
                            ) : null}
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-gray-600">No company details</p>
                    )}
                </Card>
            </div>

            <Modal
                open={applyOpen}
                onOpenChange={setApplyOpen}
                title="Apply to job"
                description="Add an optional cover letter and submit your application."
                footer={null}
            >
                <ApplicationForm
                    isSubmitting={applyMutation.isPending}
                    onSubmit={async (values) => {
                        try {
                            await applyMutation.mutateAsync({
                                job_id: jobId,
                                cover_letter: values.cover_letter,
                            })
                            toast.success('Application submitted')
                            setApplyOpen(false)
                        } catch {
                            toast.error('Failed to submit application')
                        }
                    }}
                />
            </Modal>
        </div>
    )
}
