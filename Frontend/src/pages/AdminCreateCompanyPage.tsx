import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

import { createCompany } from '../api/companies'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Textarea } from '../components/common/Textarea'

const schema = z.object({
    name: z.string().min(1, 'Company name is required'),
    description: z.string().optional(),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    location: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function AdminCreateCompanyPage() {
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (values: FormValues) => {
        try {
            setSubmitting(true)
            await createCompany({
                ...values,
                website: values.website || undefined,
                description: values.description || undefined,
                location: values.location || undefined,
            })
            toast.success('Company created successfully')
            navigate('/dashboard') // Or wherever appropriate
        } catch (err: any) {
            console.error(err)
            toast.error(err.response?.data?.message || 'Failed to create company')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">
                    Create New Company
                </h1>
                <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/50 md:p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-900">
                                Company Name
                            </label>
                            <Input
                                {...register('name')}
                                placeholder="e.g. Acme Corp"
                                error={errors.name?.message}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-900">
                                Location
                            </label>
                            <Input
                                {...register('location')}
                                placeholder="e.g. San Francisco, CA"
                                error={errors.location?.message}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-900">
                                Website
                            </label>
                            <Input
                                {...register('website')}
                                placeholder="https://example.com"
                                error={errors.website?.message}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-900">
                                Description
                            </label>
                            <Textarea
                                {...register('description')}
                                placeholder="Tell us about the company..."
                                rows={4}
                                error={errors.description?.message}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(-1)}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create Company'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
