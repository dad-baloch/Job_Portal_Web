import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

import type { Job } from '../../types/job.types'
import { formatRelativeDate } from '../../utils/formatDate'
import { formatSalaryRange } from '../../utils/formatSalary'
import { Badge } from '../common/Badge'
import { Card } from '../common/Card'

export function JobCard({
    job,
    view,
    rightAction,
    showApprovalStatus,
}: {
    job: Job
    view: 'grid' | 'list'
    rightAction?: ReactNode
    showApprovalStatus?: boolean
}) {
    const cardClassName =
        'transition-transform duration-200 hover:-translate-y-0.5' +
        (view === 'list' ? ' flex items-start justify-between gap-4' : '')

    return (
        <Card className={cardClassName}>
            <Link
                to={`/jobs/${job.id}`}
                className="group text-base font-semibold no-underline hover:no-underline"
            >
                <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                        <span className="group-hover:underline">{job.title}</span>
                        <div className="shrink-0">{rightAction}</div>
                    </div>

                    <div className="mt-1 text-sm text-gray-600">
                        {job.company?.name ? <span>{job.company.name}</span> : <span>Company</span>}
                        {job.location ? <span> • {job.location}</span> : null}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {job.is_remote ? <Badge variant="info">Remote</Badge> : null}
                        {job.job_type ? <Badge>{job.job_type}</Badge> : null}
                        {showApprovalStatus ? (
                            job.is_approved ? (
                                <Badge variant="success">approved</Badge>
                            ) : (
                                <Badge variant="warning">pending approval</Badge>
                            )
                        ) : null}
                        <Badge variant={job.status === 'open' ? 'success' : 'warning'}>
                            {job.status}
                        </Badge>
                    </div>

                    <div className="mt-3 text-sm text-gray-700">
                        {formatSalaryRange(job.salary_min, job.salary_max)}
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                        Posted {formatRelativeDate(job.created_at)}
                    </div>
                </div>
            </Link>
        </Card>
    )
}
