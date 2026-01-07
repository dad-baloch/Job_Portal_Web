import type { ApplicationStatus } from '../../types/application.types'
import { Badge } from '../common/Badge'

export function StatusBadge({ status }: { status: ApplicationStatus }) {
    const variant =
        status === 'hired'
            ? 'success'
            : status === 'rejected'
                ? 'danger'
                : status === 'shortlisted'
                    ? 'info'
                    : status === 'reviewing'
                        ? 'warning'
                        : 'default'

    return <Badge variant={variant}>{status}</Badge>
}
