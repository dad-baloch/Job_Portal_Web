import { useMemo, useState, useEffect } from 'react'

import { Breadcrumbs } from '../components/common/Breadcrumbs'
import { Button } from '../components/common/Button'
import { Pagination } from '../components/common/Pagination'
import { Select } from '../components/common/Select'
import { Skeleton } from '../components/common/Skeleton'
import { JobCard } from '../components/jobs/JobCard'
import { JobFilters } from '../components/jobs/JobFilters'
import { useJobs } from '../hooks/useJobs'
import type { JobFilters as Filters } from '../types/job.types'
import { useDebouncedValue } from '../utils/debounce'

export function JobsPage() {
    const [filters, setFilters] = useState<Filters>({})
    const debouncedTitle = useDebouncedValue(filters.title, 350)
    const debouncedLocation = useDebouncedValue(filters.location, 350)

    const queryFilters = useMemo<Filters>(() => {
        return {
            ...filters,
            title: debouncedTitle,
            location: debouncedLocation,
        }
    }, [filters, debouncedTitle, debouncedLocation])

    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(20)
    const [view, setView] = useState<'grid' | 'list'>('grid')
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [page])

    const { data, isLoading, isError } = useJobs({ filters: queryFilters, page, perPage })

    const onClear = () => {
        setFilters({})
        setPage(1)
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-6">
            <Breadcrumbs />
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold">Jobs</h1>
                    <p className="text-sm text-gray-600">
                        {data ? `${data.total} results` : 'Browse open positions'}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        type="button"
                        className="md:hidden"
                        onClick={() => setShowFilters((v) => !v)}
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>

                    <Select value={view} onChange={(e) => setView(e.target.value as 'grid' | 'list')}>
                        <option value="grid">Grid</option>
                        <option value="list">List</option>
                    </Select>

                    <Select
                        value={String(perPage)}
                        onChange={(e) => {
                            setPerPage(Number(e.target.value))
                            setPage(1)
                        }}
                    >
                        <option value="20">20 / page</option>
                        <option value="50">50 / page</option>
                        <option value="100">100 / page</option>
                    </Select>
                </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[280px_1fr] items-start">
                <div className={`${showFilters ? 'block' : 'hidden'} md:block sticky top-24 z-10`}>
                    <JobFilters
                        value={filters}
                        onChange={(next) => {
                            setFilters(next)
                            setPage(1)
                        }}
                        onClear={onClear}
                    />
                </div>

                <div>
                    {isError ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            Failed to load jobs. Please try again.
                        </div>
                    ) : null}

                    {isLoading ? (
                        <div className={view === 'grid' ? 'grid gap-4 md:grid-cols-2' : 'grid gap-4'}>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-[140px]" />
                            ))}
                        </div>
                    ) : data && data.items.length === 0 ? (
                        <div className="rounded-lg border bg-white p-6 text-center">
                            <p className="text-sm text-gray-700">No jobs found.</p>
                            <p className="mt-1 text-xs text-gray-500">Try clearing filters.</p>
                            <div className="mt-4">
                                <Button variant="secondary" onClick={onClear}>
                                    Clear filters
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={view === 'grid' ? 'grid gap-4 md:grid-cols-2' : 'grid gap-4'}>
                                {data?.items.map((job) => (
                                    <JobCard key={job.id} job={job} view={view} />
                                ))}
                            </div>

                            {data ? (
                                <div className="mt-6">
                                    <Pagination
                                        page={data.page}
                                        perPage={data.per_page}
                                        total={data.total}
                                        onPageChange={(p) => setPage(p)}
                                    />
                                </div>
                            ) : null}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
