import { Navigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

export function DashboardIndexRedirect() {
    const { role } = useAuth()

    if (role === 'employer') return <Navigate to="/dashboard/jobs/my-jobs" replace />
    if (role === 'job_seeker') return <Navigate to="/dashboard/applications" replace />
    if (role === 'admin') return <Navigate to="/dashboard/admin/jobs/pending" replace />

    return <Navigate to="/" replace />
}
