import { apiClient } from './client'
import type { Application, ApplyPayload, ApplicationStatus } from '../types/application.types'

export async function applyToJob(payload: ApplyPayload): Promise<Application> {
    const res = await apiClient.post<Application>('/applications/', payload)
    return res.data
}

export async function fetchMyApplications(): Promise<Application[]> {
    const res = await apiClient.get<Application[]>('/applications/me')
    return res.data
}

export async function fetchApplicationsForJob(jobId: number): Promise<Application[]> {
    const res = await apiClient.get<Application[]>(`/applications/job/${jobId}`)
    return res.data
}

export async function updateApplicationStatus(args: {
    applicationId: number
    status: ApplicationStatus
}): Promise<Application> {
    const res = await apiClient.patch<Application>(
        `/applications/${args.applicationId}/status`,
        { status: args.status },
    )
    return res.data
}

export async function deleteApplication(applicationId: number): Promise<void> {
    await apiClient.delete(`/applications/${applicationId}`)
}
