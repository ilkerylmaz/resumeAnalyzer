'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface FilterPanelProps {
    onFilterChange: (filters: any) => void
    onReset: () => void
}

export function FilterPanel({ onFilterChange, onReset }: FilterPanelProps) {
    const t = useTranslations('jobs.filters')
    const [search, setSearch] = useState('')
    const [locationSearch, setLocationSearch] = useState('')
    const [selectedLocations, setSelectedLocations] = useState<string[]>([])
    const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([])

    const cities = [
        'Istanbul',
        'Ankara',
        'Izmir',
        'Bursa',
        'Antalya',
        'Adana',
        'Konya',
        'Gaziantep',
    ]

    const workTypes = [
        { key: 'full-time', label: t('workType.fullTime') },
        { key: 'part-time', label: t('workType.partTime') },
        { key: 'contract', label: t('workType.contract') },
        { key: 'internship', label: t('workType.internship') },
    ]

    const filteredCities = cities.filter((city) =>
        city.toLowerCase().includes(locationSearch.toLowerCase())
    )

    const handleLocationToggle = (city: string) => {
        const newLocations = selectedLocations.includes(city)
            ? selectedLocations.filter((c) => c !== city)
            : [...selectedLocations, city]
        setSelectedLocations(newLocations)
        onFilterChange({ locations: newLocations })
    }

    const handleWorkTypeToggle = (type: string) => {
        const newTypes = selectedWorkTypes.includes(type)
            ? selectedWorkTypes.filter((t) => t !== type)
            : [...selectedWorkTypes, type]
        setSelectedWorkTypes(newTypes)
        onFilterChange({ employmentTypes: newTypes })
    }

    const handleSearchChange = (value: string) => {
        setSearch(value)
        onFilterChange({ search: value })
    }

    const handleReset = () => {
        setSearch('')
        setLocationSearch('')
        setSelectedLocations([])
        setSelectedWorkTypes([])
        onReset()
    }

    return (
        <aside className="w-80 flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-background-dark p-6 hidden lg:flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{t('title')}</h3>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                    <span className="material-symbols-outlined text-lg">close</span>
                    <span>{t('reset')}</span>
                </button>
            </div>

            {/* Global Search */}
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600">
                    search
                </span>
                <input
                    className="form-input w-full rounded-full border-neutral-200 dark:border-neutral-600 bg-neutral-100 dark:bg-white/5 py-2 pl-10 pr-4 text-sm placeholder:text-neutral-600 focus:border-primary focus:ring-primary"
                    placeholder={t('searchPlaceholder')}
                    type="text"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
            </div>

            {/* Scrollable Filters */}
            <div className="flex flex-col flex-1 overflow-y-auto -mr-3 pr-3">
                {/* Location Filter */}
                <details className="flex flex-col border-t border-t-neutral-200 dark:border-t-neutral-800 py-2 group" open>
                    <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                        <p className="text-sm font-medium">{t('location.title')}</p>
                        <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                            expand_more
                        </span>
                    </summary>
                    <div className="flex flex-col gap-3 pt-2">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-600 text-base">
                                search
                            </span>
                            <input
                                className="form-input w-full rounded-md border-neutral-200 dark:border-neutral-600 bg-neutral-100 dark:bg-white/5 py-1.5 pl-8 pr-3 text-xs placeholder:text-neutral-600 focus:border-primary focus:ring-primary"
                                placeholder={t('location.searchPlaceholder')}
                                type="text"
                                value={locationSearch}
                                onChange={(e) => setLocationSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2 h-40 overflow-y-auto">
                            {filteredCities.map((city) => (
                                <label
                                    key={city}
                                    className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-200 cursor-pointer"
                                >
                                    <input
                                        className="form-checkbox rounded text-primary focus:ring-primary"
                                        type="checkbox"
                                        checked={selectedLocations.includes(city)}
                                        onChange={() => handleLocationToggle(city)}
                                    />
                                    {city}
                                </label>
                            ))}
                        </div>
                    </div>
                </details>

                {/* Work Type Filter */}
                <details className="flex flex-col border-t border-t-neutral-200 dark:border-t-neutral-800 py-2 group">
                    <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                        <p className="text-sm font-medium">{t('workType.title')}</p>
                        <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                            expand_more
                        </span>
                    </summary>
                    <div className="flex flex-col gap-2 pt-2">
                        {workTypes.map((type) => (
                            <label
                                key={type.key}
                                className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-200 cursor-pointer"
                            >
                                <input
                                    className="form-checkbox rounded text-primary focus:ring-primary"
                                    type="checkbox"
                                    checked={selectedWorkTypes.includes(type.key)}
                                    onChange={() => handleWorkTypeToggle(type.key)}
                                />
                                {type.label}
                            </label>
                        ))}
                    </div>
                </details>

                {/* Industry Filter */}
                <details className="flex flex-col border-t border-t-neutral-200 dark:border-t-neutral-800 py-2 group">
                    <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                        <p className="text-sm font-medium">{t('industry.title')}</p>
                        <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                            expand_more
                        </span>
                    </summary>
                    <p className="text-neutral-600 text-sm font-normal leading-normal pb-2 pt-2">
                        Industry selection options here.
                    </p>
                </details>

                {/* Position Level Filter */}
                <details className="flex flex-col border-t border-t-neutral-200 dark:border-t-neutral-800 py-2 group">
                    <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                        <p className="text-sm font-medium">{t('positionLevel.title')}</p>
                        <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                            expand_more
                        </span>
                    </summary>
                    <p className="text-neutral-600 text-sm font-normal leading-normal pb-2 pt-2">
                        Position level options here.
                    </p>
                </details>

                {/* Salary Range Filter */}
                <details className="flex flex-col border-t border-t-neutral-200 dark:border-t-neutral-800 py-2 group">
                    <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                        <p className="text-sm font-medium">{t('salaryRange.title')}</p>
                        <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                            expand_more
                        </span>
                    </summary>
                    <div className="pt-4 px-1">
                        <input
                            className="w-full h-2 bg-neutral-200 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:bg-primary"
                            type="range"
                        />
                        <div className="flex justify-between text-xs text-neutral-600 mt-2">
                            <span>{t('salaryRange.min')}</span>
                            <span>{t('salaryRange.max')}</span>
                        </div>
                    </div>
                </details>
            </div>

            {/* Apply Button */}
            <div className="pt-4 mt-auto">
                <button className="w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-11 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                    <span className="truncate">{t('apply')}</span>
                </button>
            </div>
        </aside>
    )
}
