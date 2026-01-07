import type { TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className, ...props }: Props) {
    return (
        <textarea
            className={clsx(
                'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20',
                className,
            )}
            {...props}
        />
    )
}
