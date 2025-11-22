'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

interface FilterPanelProps {
    locations: string[]
    employmentTypes: string[]
    experienceLevels: string[]
    salaryRange: { min: number; max: number }
    onApplyFilters: (filters: any) => void
    onReset: () => void
}

export function FilterPanel({
    locations,
    employmentTypes,
    experienceLevels,
    salaryRange,
    onApplyFilters,
    onReset,
}: FilterPanelProps) {
    const t = useTranslations('jobs.filters')
    const [search, setSearch] = useState('')
    const [locationSearch, setLocationSearch] = useState('')
    const [selectedLocations, setSelectedLocations] = useState<string[]>([])
    const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([])
    const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([])
    const [salaryMin, setSalaryMin] = useState(salaryRange.min)
    const [salaryMax, setSalaryMax] = useState(salaryRange.max)
    const [selectedSalary, setSelectedSalary] = useState(salaryRange.max)
    const [hasChanges, setHasChanges] = useState(false)

    // Update salary range when prop changes
    useEffect(() => {
        setSalaryMin(salaryRange.min)
        setSalaryMax(salaryRange.max)
        setSelectedSalary(salaryRange.max)
    }, [salaryRange])

    // Track if there are any filter changes
    useEffect(() => {
        const hasAnyChanges =
            search !== '' ||
            selectedLocations.length > 0 ||
            selectedWorkTypes.length > 0 ||
            selectedExperienceLevels.length > 0 ||
            selectedSalary !== salaryRange.max

        setHasChanges(hasAnyChanges)
    }, [search, selectedLocations, selectedWorkTypes, selectedExperienceLevels, selectedSalary, salaryRange.max])

    // Popular cities to show first
    const popularCities = [
        'İstanbul, Avrupa',
        'İstanbul, Asya',
        'Ankara',
        'İzmir',
        'Bursa',
        'Antalya',
        'Adana',
        'Konya',
        'Gaziantep',
        'Kocaeli',
        'Mersin',
        'Eskişehir',
    ]

    // All 81 cities in Turkey (for fallback if database doesn't have them)
    const allTurkishCities = [
        'Adana',
        'Adıyaman',
        'Afyonkarahisar',
        'Ağrı',
        'Aksaray',
        'Amasya',
        'Ankara',
        'Antalya',
        'Ardahan',
        'Artvin',
        'Aydın',
        'Balıkesir',
        'Bartın',
        'Batman',
        'Bayburt',
        'Bilecik',
        'Bingöl',
        'Bitlis',
        'Bolu',
        'Burdur',
        'Bursa',
        'Çanakkale',
        'Çankırı',
        'Çorum',
        'Denizli',
        'Diyarbakır',
        'Düzce',
        'Edirne',
        'Elazığ',
        'Erzincan',
        'Erzurum',
        'Eskişehir',
        'Gaziantep',
        'Giresun',
        'Gümüşhane',
        'Hakkari',
        'Hatay',
        'Iğdır',
        'Isparta',
        'İstanbul, Avrupa',
        'İstanbul, Asya',
        'İzmir',
        'Kahramanmaraş',
        'Karabük',
        'Karaman',
        'Kars',
        'Kastamonu',
        'Kayseri',
        'Kilis',
        'Kırıkkale',
        'Kırklareli',
        'Kırşehir',
        'Kocaeli',
        'Konya',
        'Kütahya',
        'Malatya',
        'Manisa',
        'Mardin',
        'Mersin',
        'Muğla',
        'Muş',
        'Nevşehir',
        'Niğde',
        'Ordu',
        'Osmaniye',
        'Rize',
        'Sakarya',
        'Samsun',
        'Şanlıurfa',
        'Siirt',
        'Sinop',
        'Şırnak',
        'Sivas',
        'Tekirdağ',
        'Tokat',
        'Trabzon',
        'Tunceli',
        'Uşak',
        'Van',
        'Yalova',
        'Yozgat',
        'Zonguldak',
    ]

    // Merge database locations with all Turkish cities (remove duplicates)
    const allLocations = Array.from(new Set([...locations, ...allTurkishCities]))

    // Sort locations: popular cities first, then alphabetically
    const sortedLocations = [...allLocations].sort((a, b) => {
        const aIsPopular = popularCities.includes(a)
        const bIsPopular = popularCities.includes(b)

        if (aIsPopular && !bIsPopular) return -1
        if (!aIsPopular && bIsPopular) return 1

        // If both are popular, maintain the order from popularCities array
        if (aIsPopular && bIsPopular) {
            return popularCities.indexOf(a) - popularCities.indexOf(b)
        }

        // Both are not popular, sort alphabetically
        return a.localeCompare(b, 'tr')
    })

    // Filter based on search
    const filteredLocations = sortedLocations.filter((location) =>
        location.toLowerCase().includes(locationSearch.toLowerCase())
    )

    const handleLocationToggle = (location: string) => {
        setSelectedLocations((prev) =>
            prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
        )
    }

    const handleWorkTypeToggle = (type: string) => {
        setSelectedWorkTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        )
    }

    const handleExperienceLevelToggle = (level: string) => {
        setSelectedExperienceLevels((prev) =>
            prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
        )
    }

    const handleApplyFilters = () => {
        onApplyFilters({
            search: search || undefined,
            locations: selectedLocations.length > 0 ? selectedLocations : undefined,
            employmentTypes: selectedWorkTypes.length > 0 ? selectedWorkTypes : undefined,
            experienceLevels: selectedExperienceLevels.length > 0 ? selectedExperienceLevels : undefined,
            maxSalary: selectedSalary !== salaryRange.max ? selectedSalary : undefined,
        })
    }

    const handleReset = () => {
        setSearch('')
        setLocationSearch('')
        setSelectedLocations([])
        setSelectedWorkTypes([])
        setSelectedExperienceLevels([])
        setSelectedSalary(salaryRange.max)
        onReset()
    }

    const formatSalary = (amount: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <aside className="w-80 h-full flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-background-dark p-6 hidden lg:flex flex-col gap-6 overflow-hidden">
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
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Scrollable Filters */}
            <div className="flex flex-col flex-1 overflow-y-auto -mr-3 pr-3">
                {/* Location Filter */}
                <details className="flex flex-col border-t border-t-neutral-200 dark:border-t-neutral-800 py-2 group" open>
                    <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                        <p className="text-sm font-medium">
                            {t('location.title')}
                            {selectedLocations.length > 0 && (
                                <span className="ml-2 text-xs text-primary">({selectedLocations.length})</span>
                            )}
                        </p>
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
                            {filteredLocations.length > 0 ? (
                                filteredLocations.map((location) => (
                                    <label
                                        key={location}
                                        className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-200 cursor-pointer"
                                    >
                                        <input
                                            className="form-checkbox rounded text-primary focus:ring-primary"
                                            type="checkbox"
                                            checked={selectedLocations.includes(location)}
                                            onChange={() => handleLocationToggle(location)}
                                        />
                                        {location}
                                    </label>
                                ))
                            ) : (
                                <p className="text-sm text-neutral-500">{t('location.noResults')}</p>
                            )}
                        </div>
                    </div>
                </details>

                {/* Work Type Filter */}
                {employmentTypes.length > 0 && (
                    <details className="flex flex-col border-t border-t-neutral-200 dark:border-t-neutral-800 py-2 group">
                        <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                            <p className="text-sm font-medium">
                                {t('workType.title')}
                                {selectedWorkTypes.length > 0 && (
                                    <span className="ml-2 text-xs text-primary">({selectedWorkTypes.length})</span>
                                )}
                            </p>
                            <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                                expand_more
                            </span>
                        </summary>
                        <div className="flex flex-col gap-2 pt-2">
                            {employmentTypes.map((type) => (
                                <label
                                    key={type}
                                    className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-200 cursor-pointer"
                                >
                                    <input
                                        className="form-checkbox rounded text-primary focus:ring-primary"
                                        type="checkbox"
                                        checked={selectedWorkTypes.includes(type)}
                                        onChange={() => handleWorkTypeToggle(type)}
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </details>
                )}

                {/* Experience Level Filter */}
                {experienceLevels.length > 0 && (
                    <details className="flex flex-col border-t border-t-neutral-200 dark:border-t-neutral-800 py-2 group">
                        <summary className="flex cursor-pointer items-center justify-between gap-6 py-2">
                            <p className="text-sm font-medium">
                                {t('positionLevel.title')}
                                {selectedExperienceLevels.length > 0 && (
                                    <span className="ml-2 text-xs text-primary">({selectedExperienceLevels.length})</span>
                                )}
                            </p>
                            <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                                expand_more
                            </span>
                        </summary>
                        <div className="flex flex-col gap-2 pt-2">
                            {experienceLevels.map((level) => (
                                <label
                                    key={level}
                                    className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-200 cursor-pointer"
                                >
                                    <input
                                        className="form-checkbox rounded text-primary focus:ring-primary"
                                        type="checkbox"
                                        checked={selectedExperienceLevels.includes(level)}
                                        onChange={() => handleExperienceLevelToggle(level)}
                                    />
                                    {level}
                                </label>
                            ))}
                        </div>
                    </details>
                )}

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
                            className="w-full h-2 bg-neutral-200 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
                            type="range"
                            min={salaryMin}
                            max={salaryMax}
                            value={selectedSalary}
                            onChange={(e) => setSelectedSalary(Number(e.target.value))}
                            step={1000}
                        />
                        <div className="flex justify-between text-xs text-neutral-600 mt-2">
                            <span>{formatSalary(salaryMin)}</span>
                            <span className="font-medium text-primary">{formatSalary(selectedSalary)}</span>
                        </div>
                    </div>
                </details>
            </div>

            {/* Apply Button */}
            <div className="pt-4 mt-auto border-t border-neutral-200 dark:border-neutral-800">
                <button
                    onClick={handleApplyFilters}
                    disabled={!hasChanges}
                    className="w-full flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-11 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="truncate">{t('apply')}</span>
                </button>
                {hasChanges && (
                    <p className="text-xs text-neutral-500 text-center mt-2">{t('hasChanges')}</p>
                )}
            </div>
        </aside>
    )
}
