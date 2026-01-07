import { useState } from 'react'
import clsx from 'clsx'

import { Input } from './Input'
import { Badge } from './Badge'

export function TagInput({
    value,
    onChange,
    placeholder,
    className,
}: {
    value: string[]
    onChange: (next: string[]) => void
    placeholder?: string
    className?: string
}) {
    const [draft, setDraft] = useState('')

    const addTag = (raw: string) => {
        const tag = raw.trim()
        if (!tag) return
        if (value.includes(tag)) return
        onChange([...value, tag])
        setDraft('')
    }

    const removeTag = (tag: string) => {
        onChange(value.filter((t) => t !== tag))
    }

    return (
        <div className={clsx('space-y-2', className)}>
            <Input
                value={draft}
                placeholder={placeholder ?? 'Type and press Enter'}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault()
                        addTag(draft)
                    }
                    if (e.key === 'Backspace' && !draft && value.length > 0) {
                        removeTag(value[value.length - 1]!)
                    }
                }}
            />
            {value.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {value.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            className="group"
                            onClick={() => removeTag(tag)}
                            aria-label={`Remove ${tag}`}
                        >
                            <Badge className="group-hover:opacity-80">{tag} ✕</Badge>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-gray-500">No tags yet</p>
            )}
        </div>
    )
}
