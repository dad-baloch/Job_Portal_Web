import { Navigate } from 'react-router-dom'

import { LoginForm } from '../components/auth/LoginForm'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
    const { isAuthenticated, isDemo } = useAuth()

    if (isAuthenticated && !isDemo) {
        return <Navigate to="/jobs" replace />
    }

    return <LoginForm />
}
