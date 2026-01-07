import { Link } from 'react-router-dom'

import type { Application } from '../../types/application.types'
import { formatRelativeDate } from '../../utils/formatDate'
import { Card } from '../common/Card'
import { StatusBadge } from './StatusBadge'

export function ApplicationCard({ application }: { application: Application }) {
    return (
        <Card>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <Link
                        to={`/jobs/${application.job_id}`}
                        className="font-semibold hover:underline"
                    >
                        {application.job.title}
                    </Link>
                    <div className="mt-1 text-sm text-gray-600">
                        {application.job.company?.name ?? 'Company'}
                        {application.job.location ? ` • ${application.job.location}` : ''}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                        Applied {formatRelativeDate(application.created_at)}
                    </div>
                </div>
                <StatusBadge status={application.status} />
            </div>
        </Card>
    )
}
