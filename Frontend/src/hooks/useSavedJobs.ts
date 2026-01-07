import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchSavedJobs, saveJob, unsaveJob, type SavedJob } from '../api/savedJobs'
import type { Job } from '../types/job.types'

export function useSavedJobs(enabled: boolean) {
    return useQuery<SavedJob[]>({
        queryKey: ['saved-jobs'],
        queryFn: fetchSavedJobs,
        enabled,
        staleTime: 30 * 1000,
    })
}

export function useSaveJob() {
    const qc = useQueryClient()

    return useMutation<SavedJob, unknown, { jobId: number; job?: Job }>({
        mutationFn: ({ jobId }) => saveJob(jobId),
        onMutate: async ({ jobId, job }) => {
            await qc.cancelQueries({ queryKey: ['saved-jobs'] })
            const previous = qc.getQueryData<SavedJob[]>(['saved-jobs'])

            if (job) {
                const optimistic: SavedJob = {
                    id: -Date.now(),
                    user_id: 0,
                    job_id: jobId,
                    created_at: new Date().toISOString(),
                    job,
                }
                qc.setQueryData<SavedJob[]>(['saved-jobs'], (old) => {
                    const existing = old ?? []
                    if (existing.some((s) => s.job_id === jobId)) return existing
                    return [optimistic, ...existing]
                })
            }

            return { previous }
        },
        onError: (_err, _vars, ctx) => {
            if (ctx?.previous) qc.setQueryData(['saved-jobs'], ctx.previous)
        },
        onSettled: () => {
            void qc.invalidateQueries({ queryKey: ['saved-jobs'] })
        },
    })
}

export function useUnsaveJob() {
    const qc = useQueryClient()

    return useMutation<void, unknown, number>({
        mutationFn: (jobId) => unsaveJob(jobId),
        onMutate: async (jobId) => {
            await qc.cancelQueries({ queryKey: ['saved-jobs'] })
            const previous = qc.getQueryData<SavedJob[]>(['saved-jobs'])
            qc.setQueryData<SavedJob[]>(['saved-jobs'], (old) =>
                (old ?? []).filter((s) => s.job_id !== jobId),
            )
            return { previous }
        },
        onError: (_err, _vars, ctx) => {
            if (ctx?.previous) qc.setQueryData(['saved-jobs'], ctx.previous)
        },
        onSettled: () => {
            void qc.invalidateQueries({ queryKey: ['saved-jobs'] })
        },
    })
}
