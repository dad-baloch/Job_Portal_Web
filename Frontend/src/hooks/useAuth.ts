import { useAuthStore } from '../store/authStore'

export function useAuth() {
    const token = useAuthStore((s) => s.token)
    const user = useAuthStore((s) => s.user)
    const role = useAuthStore((s) => s.role)
    const isDemo = useAuthStore((s) => s.isDemo)
    const logout = useAuthStore((s) => s.logout)

    return {
        token,
        user,
        role,
        isDemo,
        isAuthenticated: Boolean(token),
        logout,
    }
}
