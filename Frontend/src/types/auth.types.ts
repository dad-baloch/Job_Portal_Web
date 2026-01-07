export type UserRole = 'job_seeker' | 'employer' | 'admin'
export type RegisterRole = Exclude<UserRole, 'admin'>

export interface User {
    id: number
    email: string
    role: UserRole
    created_at: string
    updated_at: string
}

export interface AuthResponse {
    token: string
    user: User
}

export interface RegisterPayload {
    email: string
    password: string
    role: RegisterRole
    full_name?: string
    location?: string
}

export interface LoginPayload {
    email: string
    password: string
}

export interface JwtIdentity {
    id: number
    role: UserRole
}
