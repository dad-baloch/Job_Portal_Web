import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { approveJob, deleteJobAsAdmin, disapproveJob, fetchAdminJobs, fetchPendingJobs } from '../api/admin'
import type { AdminApprovalFilter } from '../api/admin'
import type { Job } from '../types/job.types'

export function useAdminJobs(args: { approval: AdminApprovalFilter; page: number; perPage: number }) {
    const { approval, page, perPage } = args
    return useQuery({
        queryKey: ['adminJobs', approval, page, perPage],
        queryFn: () => fetchAdminJobs({ approval, page, perPage }),
        staleTime: 10 * 1000,
        keepPreviousData: true,
    })
}

export function usePendingJobs(args: { page: number; perPage: number }) {
    const { page, perPage } = args
    return useQuery({
        queryKey: ['adminPendingJobs', page, perPage],
        queryFn: () => fetchPendingJobs({ page, perPage }),
        staleTime: 10 * 1000,
        keepPreviousData: true,
    })
}

export function useApproveJob() {
    const qc = useQueryClient()

    return useMutation<Job, unknown, number>({
        mutationFn: (jobId) => approveJob(jobId),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['adminJobs'] })
            void qc.invalidateQueries({ queryKey: ['adminPendingJobs'] })
            void qc.invalidateQueries({ queryKey: ['jobs'] })
        },
    })
}

export function useDisapproveJob() {
    const qc = useQueryClient()

    return useMutation<Job, unknown, number>({
        mutationFn: (jobId) => disapproveJob(jobId),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['adminJobs'] })
            void qc.invalidateQueries({ queryKey: ['adminPendingJobs'] })
            void qc.invalidateQueries({ queryKey: ['jobs'] })
        },
    })
}

export function useAdminDeleteJob() {
    const qc = useQueryClient()

    return useMutation<void, unknown, number>({
        mutationFn: (jobId) => deleteJobAsAdmin(jobId),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['adminJobs'] })
            void qc.invalidateQueries({ queryKey: ['adminPendingJobs'] })
            void qc.invalidateQueries({ queryKey: ['jobs'] })
        },
    })
}
