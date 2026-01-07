import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '../common/Button'
import { Textarea } from '../common/Textarea'

const schema = z.object({
    cover_letter: z.string().max(5000).optional(),
})

type Values = z.infer<typeof schema>

export function ApplicationForm({
    onSubmit,
    isSubmitting,
}: {
    onSubmit: (values: { cover_letter?: string }) => void | Promise<void>
    isSubmitting: boolean
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: { cover_letter: '' },
    })

    return (
        <form
            className="space-y-3"
            onSubmit={handleSubmit((v) => onSubmit(v))}
        >
            <div>
                <label className="text-sm font-medium">Cover letter (optional)</label>
                <Textarea rows={6} {...register('cover_letter')} />
                {errors.cover_letter ? (
                    <p className="mt-1 text-xs text-red-600">{errors.cover_letter.message}</p>
                ) : null}
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting…' : 'Submit application'}
            </Button>
        </form>
    )
}
