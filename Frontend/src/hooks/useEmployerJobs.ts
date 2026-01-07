import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createJob, deleteJob, fetchMyJobs, updateJob } from '../api/jobs'
import type { CreateJobPayload, Job, JobsResponse, UpdateJobPayload } from '../types/job.types'

export function useMyJobs(args: { page: number; perPage: number }) {
    const { page, perPage } = args
    return useQuery<JobsResponse>({
        queryKey: ['myJobs', page, perPage],
        queryFn: () => fetchMyJobs({ page, perPage }),
        staleTime: 30 * 1000,
        placeholderData: (previousData) => previousData,
    })
}

export function useCreateJob() {
    const qc = useQueryClient()

    return useMutation<Job, unknown, CreateJobPayload>({
        mutationFn: createJob,
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['jobs'] })
            void qc.invalidateQueries({ queryKey: ['myJobs'] })
        },
    })
}

export function useUpdateJob(jobId: number) {
    const qc = useQueryClient()

    return useMutation<Job, unknown, UpdateJobPayload>({
        mutationFn: (payload) => updateJob(jobId, payload),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['jobs'] })
            void qc.invalidateQueries({ queryKey: ['job', jobId] })
            void qc.invalidateQueries({ queryKey: ['myJobs'] })
        },
    })
}

export function useDeleteJob() {
    const qc = useQueryClient()

    return useMutation<void, unknown, number>({
        mutationFn: (jobId) => deleteJob(jobId),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['jobs'] })
            void qc.invalidateQueries({ queryKey: ['myJobs'] })
        },
    })
}
