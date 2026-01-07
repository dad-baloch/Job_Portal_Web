import type { ReactNode } from 'react'
import clsx from 'clsx'

export function Card({
    children,
    className,
    noPadding = false,
}: {
    children: ReactNode
    className?: string
    noPadding?: boolean
}) {
    return (
        <div className={clsx('rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200', !noPadding && 'p-6', className)}>
            {children}
        </div>
    )
}
