export function formatSalaryRange(
    min: number | null | undefined,
    max: number | null | undefined,
    currency: string = 'USD',
): string {
    const fmt = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    })

    if (min == null && max == null) return 'Salary not disclosed'
    if (min != null && max != null) return `${fmt.format(min)} - ${fmt.format(max)}`
    if (min != null) return `From ${fmt.format(min)}`
    return `Up to ${fmt.format(max!)}`
}
