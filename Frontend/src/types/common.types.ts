export interface ApiValidationError {
    message: 'Validation error'
    errors: Record<string, string[]>
}

export interface ApiMessageError {
    message: string
}
