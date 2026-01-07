import type { InputHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

type Props = InputHTMLAttributes<HTMLInputElement> & {
    startIcon?: ReactNode
    endIcon?: ReactNode
    error?: string
}

export function Input({ className, startIcon, endIcon, error, ...props }: Props) {
    return (
        <div className="w-full">
            <div className="relative">
                {startIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {startIcon}
                    </div>
                )}
                <input
                    className={clsx(
                        'w-full rounded-lg border bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-gray-400',
                        'focus:border-brand focus:ring-2 focus:ring-brand/20',
                        'disabled:bg-gray-50 disabled:text-gray-500',
                        error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 hover:border-gray-300',
                        startIcon && 'pl-10',
                        endIcon && 'pr-10',
                        className,
                    )}
                    {...props}
                />
                {endIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {endIcon}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-500 animate-slide-up">{error}</p>}
        </div>
    )
}
