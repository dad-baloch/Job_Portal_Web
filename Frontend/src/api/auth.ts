import { apiClient } from './client'
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth.types'

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/register', payload)
    return res.data
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await apiClient.post<AuthResponse>('/auth/login', payload)
    return res.data
}

export async function me(): Promise<User> {
    const res = await apiClient.get<User>('/auth/me')
    return res.data
}
