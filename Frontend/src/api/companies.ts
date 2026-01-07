import { apiClient } from './client'
import type { Company } from '../types/job.types'

export interface CreateCompanyPayload {
    name: string
    description?: string
    website?: string
    location?: string
}

export async function fetchCompanies(): Promise<Company[]> {
    const res = await apiClient.get<Company[]>('/companies/')
    return res.data
}

export async function createCompany(payload: CreateCompanyPayload): Promise<Company> {
    const res = await apiClient.post<Company>('/companies/', payload)
    return res.data
}
