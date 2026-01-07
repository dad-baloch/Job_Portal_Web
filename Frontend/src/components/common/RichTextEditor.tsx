import { useEffect, useRef } from 'react'

import { Button } from './Button'

function exec(command: string, value?: string) {
    document.execCommand(command, false, value)
}

export function RichTextEditor({
    value,
    onChange,
}: {
    value: string
    onChange: (html: string) => void
}) {
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!ref.current) return
        // Avoid resetting cursor if content already matches.
        if (ref.current.innerHTML !== value) {
            ref.current.innerHTML = value
        }
    }, [value])

    return (
        <div className="rounded-md border border-gray-300">
            <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-2">
                <Button type="button" variant="secondary" onClick={() => exec('bold')}>
                    Bold
                </Button>
                <Button type="button" variant="secondary" onClick={() => exec('italic')}>
                    Italic
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => exec('insertUnorderedList')}
                >
                    Bullet
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => exec('insertOrderedList')}
                >
                    Numbered
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                        const url = window.prompt('Enter URL')
                        if (url) exec('createLink', url)
                    }}
                >
                    Link
                </Button>
                <Button type="button" variant="secondary" onClick={() => exec('removeFormat')}>
                    Clear
                </Button>
            </div>

            <div
                ref={ref}
                className="min-h-[160px] p-3 text-sm outline-none"
                contentEditable
                role="textbox"
                aria-multiline="true"
                onInput={() => {
                    onChange(ref.current?.innerHTML ?? '')
                }}
            />
        </div>
    )
}
