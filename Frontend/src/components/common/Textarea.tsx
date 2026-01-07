import type { TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    error?: string
}

export function Textarea({ className, error, ...props }: Props) {
    return (
        <div className="w-full">
            <textarea
                className={clsx(
                    'w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-gray-400',
                    'focus:border-brand focus:ring-2 focus:ring-brand/20',
                    'disabled:bg-gray-50 disabled:text-gray-500',
                    error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 hover:border-gray-300',
                    className,
                )}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500 animate-slide-up">{error}</p>}
        </div>
    )
}
