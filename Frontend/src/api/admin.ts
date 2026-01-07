import { apiClient } from './client'
import type { Job, JobsResponse } from '../types/job.types'

export type AdminApprovalFilter = 'pending' | 'approved' | 'all'

export async function fetchAdminJobs(args: {
    approval?: AdminApprovalFilter
    page?: number
    perPage?: number
}): Promise<JobsResponse> {
    const { approval = 'pending', page = 1, perPage = 20 } = args
    const params: Record<string, string | number> = {
        approval,
        page,
        per_page: perPage,
    }
    const res = await apiClient.get<JobsResponse>('/admin/jobs', { params })
    return res.data
}

export async function fetchPendingJobs(args: {
    page?: number
    perPage?: number
}): Promise<JobsResponse> {
    const { page = 1, perPage = 20 } = args
    const params: Record<string, number> = {
        page,
        per_page: perPage,
    }

    const res = await apiClient.get<JobsResponse>('/admin/jobs/pending', { params })
    return res.data
}

export async function approveJob(jobId: number): Promise<Job> {
    const res = await apiClient.patch<Job>(`/admin/jobs/${jobId}/approve`)
    return res.data
}

export async function disapproveJob(jobId: number): Promise<Job> {
    const res = await apiClient.patch<Job>(`/admin/jobs/${jobId}/disapprove`)
    return res.data
}

export async function deleteJobAsAdmin(jobId: number): Promise<void> {
    await apiClient.delete(`/admin/jobs/${jobId}`)
}
