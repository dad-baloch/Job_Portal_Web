import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { login } from '../../api/auth'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { Input } from '../common/Input'
import { getApiErrorMessage, getValidationErrors } from '../../utils/apiErrors'
import { useAuthStore } from '../../store/authStore'

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    rememberMe: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

export function LoginForm() {
    const navigate = useNavigate()
    const setAuth = useAuthStore((s) => s.setAuth)
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { rememberMe: true },
    })

    const onSubmit = async (values: FormValues, isDemoLogin = false) => {
        setServerError(null)
        try {
            const data = await login({ email: values.email, password: values.password })
            setAuth({ token: data.token, user: data.user, rememberMe: values.rememberMe, isDemo: isDemoLogin })
            toast.success('Logged in')
            navigate('/jobs')
        } catch (err) {
            const validation = getValidationErrors(err)
            if (validation) {
                setServerError('Please fix the highlighted fields.')
            } else {
                setServerError(getApiErrorMessage(err))
            }
        }
    }

    const demoLogin = (role: 'admin' | 'employer' | 'seeker') => {
        let email = ''
        const password = 'demo123'

        if (role === 'admin') email = 'admin@demo.com'
        if (role === 'employer') email = 'employer@demo.com'
        if (role === 'seeker') email = 'seeker@demo.com'

        onSubmit({ email, password, rememberMe: true }, true)
    }

    return (
        <Card className="p-6">
            <h1 className="text-xl font-semibold">Login</h1>
            <p className="mt-1 text-sm text-gray-600">Access your account</p>

            <div className="mt-4 grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" onClick={() => demoLogin('admin')} disabled={isSubmitting} className="text-xs px-1">
                    Demo Admin
                </Button>
                <Button variant="outline" size="sm" onClick={() => demoLogin('employer')} disabled={isSubmitting} className="text-xs px-1">
                    Demo Employer
                </Button>
                <Button variant="outline" size="sm" onClick={() => demoLogin('seeker')} disabled={isSubmitting} className="text-xs px-1">
                    Demo Seeker
                </Button>
            </div>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or login with email</span>
                </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit((d) => onSubmit(d, false))}>
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
                    <Input type="password" autoComplete="current-password" {...register('password')} />
                    {errors.password ? (
                        <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                    ) : null}
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="h-4 w-4" {...register('rememberMe')} />
                    Remember me
                </label>

                <Button className="w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in…' : 'Login'}
                </Button>
            </form>
        </Card>
    )
}
