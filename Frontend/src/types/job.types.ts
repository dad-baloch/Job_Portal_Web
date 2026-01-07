export interface Company {
    id: number
    name: string
    description: string | null
    website: string | null
    location: string | null
}

export interface Job {
    id: number
    title: string
    description: string
    location: string
    job_type: string
    is_remote: boolean
    salary_min: number | null
    salary_max: number | null
    skills: Record<string, unknown>
    company_id: number | null
    created_by: number
    is_approved?: boolean
    approved_by?: number | null
    approved_at?: string | null
    applications_count?: number
    status: string
    created_at: string
    updated_at: string
    company: Company | null
}

export interface JobsResponse {
    items: Job[]
    page: number
    per_page: number
    total: number
}

export interface JobFilters {
    title?: string
    location?: string
    job_type?: string
    company_id?: number
    is_remote?: boolean
}

export interface CreateJobPayload {
    title: string
    description: string
    location?: string
    job_type?: string
    is_remote?: boolean
    salary_min?: number | null
    salary_max?: number | null
    skills?: Record<string, unknown>
    company_id?: number | null
    status?: string
}

export type UpdateJobPayload = Partial<CreateJobPayload>
