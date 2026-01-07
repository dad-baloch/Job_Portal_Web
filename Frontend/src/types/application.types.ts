import type { Job } from './job.types'
import type { User } from './auth.types'

export interface ApplicantProfile {
    id: number
    user_id: number
    full_name: string
    location: string
    skills: Record<string, unknown>
    experience_years: number | null
    resume_url: string | null
    created_at: string
    updated_at: string
}

export type ApplicationStatus =
    | 'pending'
    | 'reviewing'
    | 'shortlisted'
    | 'rejected'
    | 'hired'

export interface Application {
    id: number
    user_id: number
    job_id: number
    cover_letter: string | null
    status: ApplicationStatus
    created_at: string
    updated_at: string
    job: Job
    applicant?: User
    applicant_profile?: ApplicantProfile | null
}

export interface ApplyPayload {
    job_id: number
    cover_letter?: string
}
