import { useQuery } from '@tanstack/react-query'

import { fetchApplicationsForJob } from '../api/applications'
import type { Application } from '../types/application.types'

export function useApplicantsForJob(jobId: number, enabled: boolean) {
    return useQuery<Application[]>({
        queryKey: ['applications', 'job', jobId],
        queryFn: () => fetchApplicationsForJob(jobId),
        enabled: enabled && Number.isFinite(jobId),
        staleTime: 15 * 1000,
    })
}
