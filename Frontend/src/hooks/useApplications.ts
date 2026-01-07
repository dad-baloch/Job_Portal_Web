import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { applyToJob, deleteApplication, fetchMyApplications, updateApplicationStatus } from '../api/applications'
import type { ApplyPayload, Application, ApplicationStatus } from '../types/application.types'

export function useMyApplications(enabled: boolean) {
    return useQuery<Application[]>({
        queryKey: ['applications', 'me'],
        queryFn: fetchMyApplications,
        enabled,
        staleTime: 30 * 1000,
    })
}

export function useApplyToJob() {
    const qc = useQueryClient()

    return useMutation<Application, unknown, ApplyPayload>({
        mutationFn: applyToJob,
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['applications', 'me'] })
        },
    })
}

export function useUpdateApplicationStatus() {
    const qc = useQueryClient()

    return useMutation<
        Application,
        unknown,
        {
            applicationId: number
            status: ApplicationStatus
            jobId?: number
        }
    >({
        mutationFn: (args) => updateApplicationStatus({ applicationId: args.applicationId, status: args.status }),
        onSuccess: (_data, vars) => {
            void qc.invalidateQueries({ queryKey: ['applications', 'me'] })
            if (vars.jobId) {
                void qc.invalidateQueries({ queryKey: ['applications', 'job', vars.jobId] })
            }
            void qc.invalidateQueries({ queryKey: ['myJobs'] })
        },
    })
}

export function useDeleteApplication() {
    const qc = useQueryClient()

    return useMutation<
        void,
        unknown,
        {
            applicationId: number
            jobId?: number
        }
    >({
        mutationFn: (args) => deleteApplication(args.applicationId),
        onSuccess: (_data, vars) => {
            if (vars.jobId) {
                void qc.invalidateQueries({ queryKey: ['applications', 'job', vars.jobId] })
            }
            void qc.invalidateQueries({ queryKey: ['myJobs'] })
        },
    })
}
