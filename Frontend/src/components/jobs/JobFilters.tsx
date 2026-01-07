import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Select } from '../common/Select'

import type { JobFilters as Filters } from '../../types/job.types'

export function JobFilters({
    value,
    onChange,
    onClear,
}: {
    value: Filters
    onChange: (next: Filters) => void
    onClear: () => void
}) {
    const activeCount =
        Number(Boolean(value.title)) +
        Number(Boolean(value.location)) +
        Number(Boolean(value.job_type)) +
        Number(value.company_id != null) +
        Number(value.is_remote != null)

    return (
        <div className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <div className="text-sm font-semibold">Filters</div>
                    <div className="text-xs text-gray-500">Active: {activeCount}</div>
                </div>
                <Button variant="secondary" type="button" onClick={onClear}>
                    Clear
                </Button>
            </div>

            <div className="mt-4 grid gap-3">
                <div>
                    <label className="text-xs font-medium text-gray-700">Title</label>
                    <Input
                        value={value.title ?? ''}
                        onChange={(e) => onChange({ ...value, title: e.target.value || undefined })}
                        placeholder="e.g. Backend"
                    />
                </div>

                <div>
                    <label className="text-xs font-medium text-gray-700">Location</label>
                    <Input
                        value={value.location ?? ''}
                        onChange={(e) =>
                            onChange({ ...value, location: e.target.value || undefined })
                        }
                        placeholder="e.g. Karachi"
                    />
                </div>

                <div>
                    <label className="text-xs font-medium text-gray-700">Job type</label>
                    <Select
                        value={value.job_type ?? ''}
                        onChange={(e) =>
                            onChange({ ...value, job_type: e.target.value || undefined })
                        }
                    >
                        <option value="">Any</option>
                        <option value="full_time">Full time</option>
                        <option value="part_time">Part time</option>
                        <option value="contract">Contract</option>
                    </Select>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={value.is_remote ?? false}
                        onChange={(e) => onChange({ ...value, is_remote: e.target.checked })}
                    />
                    Remote only
                </label>

                <div>
                    <label className="text-xs font-medium text-gray-700">Company ID</label>
                    <Input
                        type="number"
                        value={value.company_id ?? ''}
                        onChange={(e) =>
                            onChange({
                                ...value,
                                company_id: e.target.value ? Number(e.target.value) : undefined,
                            })
                        }
                        placeholder="Optional"
                    />
                </div>
            </div>
        </div>
    )
}
