import { formatDistanceToNow, parseISO } from 'date-fns'

export function formatRelativeDate(isoDate: string): string {
    const date = parseISO(isoDate)
    return formatDistanceToNow(date, { addSuffix: true })
}
