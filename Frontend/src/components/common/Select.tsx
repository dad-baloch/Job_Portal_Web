import type { SelectHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, children, ...props }: Props) {
    return (
        <select
            className={clsx(
                'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20',
                className,
            )}
            {...props}
        >
            {children}
        </select>
    )
}
