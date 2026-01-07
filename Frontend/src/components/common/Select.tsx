import type { SelectHTMLAttributes } from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
    error?: string
    inputClassName?: string
}

export function Select({ className, children, error, inputClassName, ...props }: Props) {
    return (
        <div className={clsx("relative w-full", className)}>
            <div className="relative">
                <select
                    className={clsx(
                        'w-full appearance-none rounded-lg border bg-white px-4 py-2.5 text-sm outline-none transition-all duration-200',
                        'focus:border-brand focus:ring-2 focus:ring-brand/20',
                        'disabled:bg-gray-50 disabled:text-gray-500',
                        error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 hover:border-gray-300',
                        inputClassName,
                    )}
                    {...props}
                >
                    {children}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>
            {error && <p className="mt-1 text-xs text-red-500 animate-slide-up">{error}</p>}
        </div>
    )
}
