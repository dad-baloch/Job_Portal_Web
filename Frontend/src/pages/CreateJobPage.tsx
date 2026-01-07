import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { Card } from '../components/common/Card'
import { JobForm } from '../components/jobs/JobForm'
import { useCreateJob } from '../hooks/useEmployerJobs'
import { getApiErrorMessage } from '../utils/apiErrors'

export function CreateJobPage() {
    const mutation = useCreateJob()
    const navigate = useNavigate()

    return (
        <div className="mx-auto max-w-3xl">
            <Breadcrumbs />
            <Card>
                <h1 className="text-2xl font-semibold">Create Job</h1>
                <p className="mt-1 text-sm text-gray-600">Post a new job listing</p>

                <div className="mt-6">
                    <JobForm
                        mode="create"
                        submitting={mutation.isPending}
                        onSubmit={async (payload) => {
                            if (mutation.isPending) return
                            try {
                                await mutation.mutateAsync(payload)
                                toast.success('Job created', { id: 'create-job' })
                                navigate('/dashboard/jobs/my-jobs')
                            } catch (err) {
                                toast.error(getApiErrorMessage(err), { id: 'create-job' })
                                throw err
                            }
                        }}
                    />
                </div>
            </Card>
        </div>
    )
}
