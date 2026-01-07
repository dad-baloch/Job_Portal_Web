import { Button } from './Button'

export function Pagination({
    page,
    perPage,
    total,
    onPageChange,
}: {
    page: number
    perPage: number
    total: number
    onPageChange: (nextPage: number) => void
}) {
    const totalPages = Math.max(1, Math.ceil(total / perPage))
    const canPrev = page > 1
    const canNext = page < totalPages

    return (
        <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
                Page <span className="font-medium">{page}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="secondary"
                    onClick={() => onPageChange(1)}
                    disabled={!canPrev}
                >
                    First
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => onPageChange(page - 1)}
                    disabled={!canPrev}
                >
                    Previous
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => onPageChange(page + 1)}
                    disabled={!canNext}
                >
                    Next
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => onPageChange(totalPages)}
                    disabled={!canNext}
                >
                    Last
                </Button>
            </div>
        </div>
    )
}
