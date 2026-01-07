import type { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: Props) {
    return (
        <input
            className={clsx(
                'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20',
                className,
            )}
            {...props}
        />
    )
}
