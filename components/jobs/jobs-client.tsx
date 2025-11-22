'use client'

import { useState, useEffect, useTransition } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { FilterPanel } from '@/components/jobs/filter-panel'
import { JobList } from '@/components/jobs/job-list'
import { fetchJobs, JobFilters, JobResult } from '@/lib/actions/job-actions'

interface JobsClientProps {
    initialJobs: JobResult[]
    initialTotalCount: number
    initialTotalPages: number
}

export function JobsClient({
    initialJobs,
    initialTotalCount,
    initialTotalPages,
}: JobsClientProps) {
    const t = useTranslations('jobs')
    const locale = useLocale()
    const [isPending, startTransition] = useTransition()

    const [jobs, setJobs] = useState<JobResult[]>(initialJobs)
    const [totalCount, setTotalCount] = useState(initialTotalCount)
    const [totalPages, setTotalPages] = useState(initialTotalPages)
    const [currentPage, setCurrentPage] = useState(1)
    const [filters, setFilters] = useState<JobFilters>({ language: locale })

    const loadJobs = async (newFilters?: JobFilters, page = 1) => {
        startTransition(async () => {
            const result = await fetchJobs(
                newFilters || filters,
                { page, limit: 10 }
            )
            setJobs(result.jobs)
            setTotalCount(result.totalCount)
            setTotalPages(result.totalPages)
            setCurrentPage(result.page)
        })
    }

    const handleFilterChange = (newFilters: Partial<JobFilters>) => {
        const updatedFilters = { ...filters, ...newFilters }
        setFilters(updatedFilters)
        loadJobs(updatedFilters, 1)
    }

    const handleReset = () => {
        const resetFilters = { language: locale }
        setFilters(resetFilters)
        loadJobs(resetFilters, 1)
    }

    const handlePageChange = (page: number) => {
        loadJobs(filters, page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="flex h-[calc(100vh-57px)] w-full">
            <FilterPanel onFilterChange={handleFilterChange} onReset={handleReset} />

            <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background-light dark:bg-background-dark">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-wrap justify-between gap-3 mb-8">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em]">
                                {t('pageTitle')}
                            </h1>
                            <p className="text-neutral-600 text-base font-normal leading-normal">
                                {t('showingJobs', { count: totalCount })}
                            </p>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isPending && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Job List */}
                    {!isPending && (
                        <JobList
                            jobs={jobs}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalCount={totalCount}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </main>
        </div>
    )
}
