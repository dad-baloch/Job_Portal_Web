import { Navigate } from 'react-router-dom'

import { RegisterForm } from '../components/auth/RegisterForm'
import { useAuth } from '../hooks/useAuth'

export function RegisterPage() {
    const { isAuthenticated, isDemo } = useAuth()

    if (isAuthenticated && !isDemo) {
        return <Navigate to="/jobs" replace />
    }

    return <RegisterForm />
}
