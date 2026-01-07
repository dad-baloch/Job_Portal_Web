import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { register as registerApi } from '../../api/auth'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { Input } from '../common/Input'
import { Select } from '../common/Select'
import { getApiErrorMessage } from '../../utils/apiErrors'
import { useAuthStore } from '../../store/authStore'

const schema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        role: z.union([z.literal('job_seeker'), z.literal('employer')]),
        full_name: z.string().optional(),
        location: z.string().optional(),
        rememberMe: z.boolean().default(true),
    })
    .superRefine((val, ctx) => {
        if (val.role === 'job_seeker') {
            if (!val.full_name || val.full_name.trim().length === 0) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['full_name'], message: 'Full name is required' })
            }
        }
    })

type FormValues = z.infer<typeof schema>

export function RegisterForm() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((s) => s.setAuth)
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { role: 'job_seeker', rememberMe: true },
    })

    const role = watch('role')
    const showSeekerFields = useMemo(() => role === 'job_seeker', [role])

    const onSubmit = async (values: FormValues) => {
        setServerError(null)
        try {
            const payload = {
                email: values.email,
                password: values.password,
                role: values.role,
                full_name: values.role === 'job_seeker' ? values.full_name : undefined,
                location: values.role === 'job_seeker' ? values.location : undefined,
            }

            const data = await registerApi(payload)
            setAuth({ token: data.token, user: data.user, rememberMe: values.rememberMe })
            toast.success('Account created')
            navigate('/jobs')
        } catch (err) {
            setServerError(getApiErrorMessage(err))
        }
    }

    return (
        <Card className="p-6">
            <h1 className="text-xl font-semibold">Register</h1>
            <p className="mt-1 text-sm text-gray-600">Create a new account</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                {serverError ? (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {serverError}
                    </div>
                ) : null}

                <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" autoComplete="email" {...register('email')} />
                    {errors.email ? (
                        <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                    ) : null}
                </div>

                <div>
                    <label className="text-sm font-medium">Password</label>
                    <Input type="password" autoComplete="new-password" {...register('password')} />
                    {errors.password ? (
                        <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                    ) : null}
                </div>

                <div>
                    <label className="text-sm font-medium">Role</label>
                    <Select {...register('role')}>
                        <option value="job_seeker">Job Seeker</option>
                        <option value="employer">Employer</option>
                    </Select>
                </div>

                {showSeekerFields ? (
                    <>
                        <div>
                            <label className="text-sm font-medium">Full name</label>
                            <Input {...register('full_name')} />
                            {errors.full_name ? (
                                <p className="mt-1 text-xs text-red-600">{errors.full_name.message}</p>
                            ) : null}
                        </div>

                        <div>
                            <label className="text-sm font-medium">Location</label>
                            <Input {...register('location')} />
                        </div>
                    </>
                ) : null}

                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="h-4 w-4" {...register('rememberMe')} />
                    Remember me
                </label>

                <Button className="w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating…' : 'Create account'}
                </Button>
            </form>
        </Card>
    )
}
