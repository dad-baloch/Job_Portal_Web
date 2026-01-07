import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

import { Button } from './Button'

export function Modal({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description?: string
    children: ReactNode
    footer?: ReactNode
}) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <Dialog.Title className="text-base font-semibold">
                                {title}
                            </Dialog.Title>
                            {description ? (
                                <Dialog.Description className="mt-1 text-sm text-gray-600">
                                    {description}
                                </Dialog.Description>
                            ) : null}
                        </div>
                        <Dialog.Close asChild>
                            <Button variant="secondary">Close</Button>
                        </Dialog.Close>
                    </div>

                    <div className="mt-4">{children}</div>

                    {footer ? <div className="mt-4">{footer}</div> : null}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
