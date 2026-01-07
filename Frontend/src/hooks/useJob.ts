import { useQuery } from '@tanstack/react-query'

import { fetchJob } from '../api/jobs'
import type { Job } from '../types/job.types'

export function useJob(jobId: number) {
    return useQuery<Job>({
        queryKey: ['job', jobId],
        queryFn: () => fetchJob(jobId),
        staleTime: 60 * 1000,
        enabled: Number.isFinite(jobId),
    })
}
