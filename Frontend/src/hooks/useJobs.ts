import { useQuery } from '@tanstack/react-query'

import { fetchJobs } from '../api/jobs'
import type { JobFilters, JobsResponse } from '../types/job.types'

export function useJobs(args: {
    filters: JobFilters
    page: number
    perPage: number
}) {
    const { filters, page, perPage } = args

    return useQuery<JobsResponse>({
        queryKey: ['jobs', filters, page, perPage],
        queryFn: () => fetchJobs({ filters, page, perPage }),
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
    })
}
