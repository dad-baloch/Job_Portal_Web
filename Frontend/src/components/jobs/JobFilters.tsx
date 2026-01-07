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
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm h-fit">
            <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <Button variant="ghost" size="sm" onClick={onClear} className="text-gray-500 hover:text-red-600 px-2">
                    Clear
                </Button>
            </div>

            <div className="grid gap-4">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Search</label>
                    <Input
                        value={value.title ?? ''}
                        onChange={(e) => onChange({ ...value, title: e.target.value || undefined })}
                        placeholder="Job title or keyword"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Location</label>
                    <Input
                        value={value.location ?? ''}
                        onChange={(e) =>
                            onChange({ ...value, location: e.target.value || undefined })
                        }
                        placeholder="City, state, or zip"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Job Type</label>
                    <Select
                        value={value.job_type ?? ''}
                        onChange={(e) =>
                            onChange({ ...value, job_type: e.target.value || undefined })
                        }
                    >
                        <option value="">All Types</option>
                        <option value="full_time">Full Time</option>
                        <option value="part_time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="freelance">Freelance</option>
                        <option value="internship">Internship</option>
                    </Select>
                </div>

                <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black/20"
                            checked={value.is_remote ?? false}
                            onChange={(e) => onChange({ ...value, is_remote: e.target.checked })}
                        />
                        <span className="text-sm font-medium text-gray-700">Remote Only</span>
                    </label>
                </div>

                <div className="pt-2 border-t border-gray-100">
                    <label className="mb-1.5 block text-xs font-medium text-gray-500">Company ID</label>
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
                        className="py-1.5 text-xs"
                    />
                </div>
            </div>
        </div>
    )
}
