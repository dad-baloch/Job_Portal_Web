import { apiClient } from './client'
import type { CreateJobPayload, Job, JobFilters, JobsResponse, UpdateJobPayload } from '../types/job.types'

export async function fetchJobs(args: {
    filters?: JobFilters
    page?: number
    perPage?: number
}): Promise<JobsResponse> {
    const { filters, page = 1, perPage = 20 } = args
    const params: Record<string, string | number | boolean> = {
        page,
        per_page: perPage,
    }

    if (filters?.title) params.title = filters.title
    if (filters?.location) params.location = filters.location
    if (filters?.job_type) params.job_type = filters.job_type
    if (filters?.company_id != null) params.company_id = filters.company_id
    if (filters?.is_remote != null) params.is_remote = filters.is_remote

    const res = await apiClient.get<JobsResponse>('/jobs/', { params })
    return res.data
}

export async function fetchMyJobs(args: { page?: number; perPage?: number }): Promise<JobsResponse> {
    const { page = 1, perPage = 20 } = args
    const params: Record<string, number> = {
        page,
        per_page: perPage,
    }
    const res = await apiClient.get<JobsResponse>('/jobs/mine', { params })
    return res.data
}

export async function fetchJob(jobId: number): Promise<Job> {
    const res = await apiClient.get<Job>(`/jobs/${jobId}`)
    return res.data
}

export async function createJob(payload: CreateJobPayload): Promise<Job> {
    const res = await apiClient.post<Job>('/jobs/', payload)
    return res.data
}

export async function updateJob(jobId: number, payload: UpdateJobPayload): Promise<Job> {
    const res = await apiClient.patch<Job>(`/jobs/${jobId}`, payload)
    return res.data
}

export async function deleteJob(jobId: number): Promise<void> {
    await apiClient.delete(`/jobs/${jobId}`)
}
