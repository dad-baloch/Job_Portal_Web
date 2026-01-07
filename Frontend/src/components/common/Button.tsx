import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
    size?: Size
    isLoading?: boolean
    fullWidth?: boolean
}

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    className,
    disabled,
    children,
    ...props
}: Props) {
    const base =
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]'

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    }

    const styles: Record<Variant, string> = {
        primary: 'bg-black text-white hover:bg-gray-800 shadow-sm hover:shadow-md',
        secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-red-500/20',
        outline: 'bg-transparent border border-black text-black hover:bg-gray-50',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    }

    return (
        <button
            className={clsx(
                base,
                sizes[size],
                styles[variant],
                fullWidth && 'w-full',
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    )
}
