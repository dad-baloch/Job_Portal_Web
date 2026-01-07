import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'danger'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
}

export function Button({
    variant = 'primary',
    className,
    disabled,
    ...props
}: Props) {
    const base =
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50 disabled:pointer-events-none'

    const styles: Record<Variant, string> = {
        primary: 'bg-black text-white hover:bg-black/90',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    }

    return (
        <button
            className={clsx(base, styles[variant], className)}
            disabled={disabled}
            {...props}
        />
    )
}
