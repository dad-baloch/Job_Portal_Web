import axios, { AxiosError } from 'axios'

import { API_BASE_URL } from '../constants'
import { useAuthStore } from '../store/authStore'

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const status = error.response?.status

        const data = error.response?.data as unknown
        const msg =
            typeof data === 'object' && data !== null
                ? // Flask-JWT-Extended typically uses { msg: "..." }
                ((data as { msg?: unknown; message?: unknown }).msg ??
                    (data as { msg?: unknown; message?: unknown }).message)
                : undefined

        const isJwtTokenProblem =
            status === 401 ||
            (status === 422 &&
                typeof msg === 'string' &&
                /subject must be a string|token|signature|expired|invalid/i.test(msg))

        if (isJwtTokenProblem) {
            // Token expired/invalid: clean auth and send user to login.
            useAuthStore.getState().logout()
            if (window.location.pathname !== '/auth/login') {
                window.location.href = '/auth/login'
            }
        }

        return Promise.reject(error)
    },
)
