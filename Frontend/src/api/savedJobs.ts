import { apiClient } from './client'
import type { Job } from '../types/job.types'

export interface SavedJob {
    id: number
    user_id: number
    job_id: number
    created_at: string
    job: Job
}

export async function fetchSavedJobs(): Promise<SavedJob[]> {
    const res = await apiClient.get<SavedJob[]>('/saved-jobs/')
    return res.data
}

export async function saveJob(jobId: number): Promise<SavedJob> {
    const res = await apiClient.post<SavedJob>(`/saved-jobs/${jobId}`)
    return res.data
}

export async function unsaveJob(jobId: number): Promise<void> {
    await apiClient.delete(`/saved-jobs/${jobId}`)
}
