import type { AxiosError } from 'axios'

import type { ApiMessageError, ApiValidationError } from '../types/common.types'

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

export function getApiErrorMessage(error: unknown): string {
    const axiosError = error as AxiosError
    const data = axiosError?.response?.data

    if (isObject(data)) {
        const msg = data.message
        if (typeof msg === 'string') return msg
        const alt = (data as { msg?: unknown }).msg
        if (typeof alt === 'string') return alt
    }

    if (axiosError?.message) return axiosError.message
    return 'Something went wrong'
}

export function getValidationErrors(error: unknown): Record<string, string[]> | null {
    const axiosError = error as AxiosError
    const data = axiosError?.response?.data
    if (!isObject(data)) return null

    const msg = (data as ApiValidationError | ApiMessageError).message
    if (msg !== 'Validation error') return null

    const errors = (data as ApiValidationError).errors
    if (!errors || typeof errors !== 'object') return null

    return errors
}
