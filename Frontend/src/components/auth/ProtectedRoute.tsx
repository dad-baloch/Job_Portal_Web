import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuthStore } from '../../store/authStore'
import type { UserRole } from '../../types/auth.types'

export function ProtectedRoute({
    children,
    roles,
}: {
    children: ReactNode
    roles?: UserRole[]
}) {
    const token = useAuthStore((s) => s.token)
    const role = useAuthStore((s) => s.role)
    const location = useLocation()

    if (!token) {
        return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />
    }

    if (roles && role && !roles.includes(role)) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}
