import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Select } from '../common/Select'
import { TagInput } from '../common/TagInput'
import { RichTextEditor } from '../common/RichTextEditor'

import type { CreateJobPayload, Job, UpdateJobPayload } from '../../types/job.types'

const schema = z
    .object({
        title: z.string().min(1, 'Title is required'),
        location: z.string().optional(),
        job_type: z.string().optional(),
        is_remote: z.boolean().default(false),
        salary_min: z.preprocess(
            (v) => (v === '' || v == null ? null : Number(v)),
            z.number().nullable(),
        ),
        salary_max: z.preprocess(
            (v) => (v === '' || v == null ? null : Number(v)),
            z.number().nullable(),
        ),
        company_id: z.preprocess(
            (v) => (v === '' || v == null ? null : Number(v)),
            z.number().int().nullable(),
        ),
        status: z.string().default('open'),
        description: z.string().min(1, 'Description is required'),
        skills: z.array(z.string()).default([]),
    })
    .superRefine((val, ctx) => {
        if (val.salary_min != null && val.salary_max != null && val.salary_min > val.salary_max) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['salary_max'],
                message: 'Max salary must be greater than min salary',
            })
        }

        const loc = (val.location ?? '').trim()
        if (!val.is_remote && loc.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['location'],
                message: 'Location is required when job is not remote',
            })
        }
    })

type Values = z.infer<typeof schema>

function jobToDefaults(job: Job): Values {
    const skills = job.skills as Record<string, unknown>
    const tagsCandidate = skills?.['tags']
    const skillsTags = Array.isArray(tagsCandidate)
        ? tagsCandidate.filter((t): t is string => typeof t === 'string')
        : []

    return {
        title: job.title,
        location: job.location ?? '',
        job_type: job.job_type ?? '',
        is_remote: job.is_remote ?? false,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        company_id: job.company_id,
        status: job.status ?? 'open',
        description: job.description ?? '',
        skills: skillsTags,
    }
}

export function JobForm({
    mode,
    initialJob,
    onSubmit,
    submitting,
}: {
    mode: 'create' | 'edit'
    initialJob?: Job
    onSubmit: (payload: CreateJobPayload | UpdateJobPayload) => void | Promise<void>
    submitting: boolean
}) {
    const defaults = useMemo<Values>(() => {
        if (initialJob) return jobToDefaults(initialJob)
        return {
            title: '',
            location: '',
            job_type: '',
            is_remote: false,
            salary_min: null,
            salary_max: null,
            company_id: null,
            status: 'open',
            description: '',
            skills: [],
        }
    }, [initialJob])

    const {
        register,
        watch,
        setValue,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: defaults,
    })

    const [skills, setSkills] = useState<string[]>(defaults.skills)

    const description = watch('description')

    return (
        <form
            className="space-y-4"
            onSubmit={handleSubmit(async (values) => {
                const skillsObject: Record<string, unknown> = skills.length > 0 ? { tags: skills } : {}

                const resolvedLocation = values.is_remote
                    ? (values.location?.trim() ? values.location.trim() : 'Remote')
                    : (values.location?.trim() ? values.location.trim() : undefined)

                const payload: CreateJobPayload = {
                    title: values.title,
                    description: values.description,
                    location: resolvedLocation,
                    job_type: values.job_type || undefined,
                    is_remote: values.is_remote,
                    salary_min: values.salary_min,
                    salary_max: values.salary_max,
                    company_id: values.company_id,
                    status: values.status,
                    skills: skillsObject,
                }

                await onSubmit(mode === 'create' ? payload : (payload as UpdateJobPayload))

                // If create succeeded, clear the form so repeated clicks cannot create duplicates.
                if (mode === 'create') {
                    reset(defaults)
                    setSkills(defaults.skills)
                }
            })}
        >
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input {...register('title')} />
                    {errors.title ? <p className="mt-1 text-xs text-red-600">{errors.title.message}</p> : null}
                </div>

                <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select {...register('status')}>
                        <option value="open">open</option>
                        <option value="closed">closed</option>
                    </Select>
                </div>

                <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input {...register('location')} placeholder="e.g. Lahore" />
                </div>

                <div>
                    <label className="text-sm font-medium">Job type</label>
                    <Select {...register('job_type')}>
                        <option value="">(optional)</option>
                        <option value="full-time">full-time</option>
                        <option value="part-time">part-time</option>
                        <option value="contract">contract</option>
                    </Select>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="h-4 w-4" {...register('is_remote')} />
                    Remote
                </label>

                <div>
                    <label className="text-sm font-medium">Company ID (optional)</label>
                    <Input type="number" {...register('company_id')} />
                    {errors.company_id ? (
                        <p className="mt-1 text-xs text-red-600">{errors.company_id.message}</p>
                    ) : null}
                </div>

                <div>
                    <label className="text-sm font-medium">Salary min</label>
                    <Input type="number" {...register('salary_min')} />
                    {errors.salary_min ? (
                        <p className="mt-1 text-xs text-red-600">{errors.salary_min.message}</p>
                    ) : null}
                </div>

                <div>
                    <label className="text-sm font-medium">Salary max</label>
                    <Input type="number" {...register('salary_max')} />
                    {errors.salary_max ? (
                        <p className="mt-1 text-xs text-red-600">{errors.salary_max.message}</p>
                    ) : null}
                </div>
            </div>

            <div>
                <label className="text-sm font-medium">Skills</label>
                <TagInput
                    value={skills}
                    onChange={(next) => {
                        setSkills(next)
                        setValue('skills', next, { shouldDirty: true })
                    }}
                    placeholder="Type a skill and press Enter"
                />
            </div>

            <div>
                <label className="text-sm font-medium">Description</label>
                <RichTextEditor
                    value={description}
                    onChange={(html) => setValue('description', html, { shouldDirty: true })}
                />
                {errors.description ? (
                    <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
                ) : null}
            </div>

            <Button type="submit" disabled={submitting || isSubmitting}>
                {submitting || isSubmitting ? 'Saving…' : mode === 'create' ? 'Create job' : 'Save changes'}
            </Button>
        </form>
    )
}
