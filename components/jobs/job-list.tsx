'use client'

import { useTranslations } from 'next-intl'
import { JobResult } from '@/lib/actions/job-actions'

interface JobListProps {
    jobs: JobResult[]
    currentPage: number
    totalPages: number
    totalCount: number
    onPageChange: (page: number) => void
}

export function JobList({
    jobs,
    currentPage,
    totalPages,
    totalCount,
    onPageChange,
}: JobListProps) {
    const t = useTranslations('jobs')

    const getPostedTimeText = (createdAt: string) => {
        const now = new Date()
        const posted = new Date(createdAt)
        const diffTime = Math.abs(now.getTime() - posted.getTime())
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return t('card.postedToday')
        if (diffDays === 1) return t('card.postedYesterday')
        return t('card.postedDaysAgo', { days: diffDays })
    }

    const getWorkModeLabel = (location: string) => {
        const locationLower = location.toLowerCase()
        if (locationLower.includes('remote') || locationLower.includes('uzaktan')) {
            return t('card.remote')
        }
        if (locationLower.includes('hybrid') || locationLower.includes('hibrit')) {
            return t('card.hybrid')
        }
        return t('card.onsite')
    }

    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <span className="material-symbols-outlined text-6xl text-neutral-400 mb-4">
                    work_off
                </span>
                <h3 className="text-xl font-bold mb-2">{t('emptyState.title')}</h3>
                <p className="text-neutral-600">{t('emptyState.description')}</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {jobs.map((job) => (
                <div
                    key={job.job_id}
                    className="bg-white dark:bg-neutral-800/50 p-6 rounded-lg border border-transparent hover:border-primary transition-colors duration-300 flex flex-col sm:flex-row gap-6 cursor-pointer"
                >
                    {/* Company Logo Placeholder */}
                    <div className="size-14 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-2xl text-neutral-600">
                            business
                        </span>
                    </div>

                    {/* Job Details */}
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-lg">{job.job_title}</h4>
                                <p className="text-sm text-neutral-600">{job.company_name}</p>
                            </div>
                            <p className="text-xs text-neutral-600 whitespace-nowrap ml-4">
                                {getPostedTimeText(job.created_at)}
                            </p>
                        </div>

                        <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
                            {job.job_description}
                        </p>

                        {/* Tags */}
                        <div className="flex items-center gap-x-4 gap-y-2 mt-4 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                {job.location}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                                <span className="material-symbols-outlined text-sm">work</span>
                                {job.employment_type}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                                <span className="material-symbols-outlined text-sm">
                                    {getWorkModeLabel(job.location) === t('card.remote')
                                        ? 'laptop_mac'
                                        : 'apartment'}
                                </span>
                                {getWorkModeLabel(job.location)}
                            </span>
                            {job.min_salary && job.max_salary && (
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    <span className="material-symbols-outlined text-sm">payments</span>
                                    ${job.min_salary}k - ${job.max_salary}k
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
                <nav className="flex items-center justify-between mt-10">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 h-9 text-sm font-medium text-neutral-600 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                        {t('pagination.previous')}
                    </button>

                    <div className="hidden md:flex items-center gap-2">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNum
                            if (totalPages <= 5) {
                                pageNum = i + 1
                            } else if (currentPage <= 3) {
                                pageNum = i + 1
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i
                            } else {
                                pageNum = currentPage - 2 + i
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange(pageNum)}
                                    className={`flex items-center justify-center size-9 text-sm font-medium rounded-full transition-colors ${currentPage === pageNum
                                            ? 'text-white bg-primary'
                                            : 'text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            )
                        })}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <>
                                <span className="text-neutral-600">...</span>
                                <button
                                    onClick={() => onPageChange(totalPages)}
                                    className="flex items-center justify-center size-9 text-sm font-medium text-neutral-600 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 h-9 text-sm font-medium text-neutral-600 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {t('pagination.next')}
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                </nav>
            )}
        </div>
    )
}
