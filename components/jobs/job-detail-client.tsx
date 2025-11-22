'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

interface JobDetailClientProps {
    job: any
}

export function JobDetailClient({ job }: JobDetailClientProps) {
    const t = useTranslations('jobs.detail')
    const router = useRouter()

    const getCurrencySymbol = (currency: string | null) => {
        switch (currency) {
            case 'TRY':
                return '₺'
            case 'USD':
                return '$'
            case 'EUR':
                return '€'
            default:
                return '$'
        }
    }

    const getPostedTimeText = (createdAt: string) => {
        const now = new Date()
        const posted = new Date(createdAt)
        const diffTime = Math.abs(now.getTime() - posted.getTime())
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return t('postedToday')
        if (diffDays === 1) return t('postedYesterday')
        return t('postedDaysAgo', { days: diffDays })
    }

    return (
        <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-primary mb-6 transition-colors"
            >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                {t('backToJobs')}
            </button>

            {/* Job Header */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 mb-6">
                <div className="flex items-start gap-6">
                    {/* Company Logo */}
                    <div className="size-20 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-4xl text-neutral-600">
                            business
                        </span>
                    </div>

                    {/* Job Title & Company */}
                    <div className="flex-1">
                        <h1 className="text-3xl font-black mb-2">{job.job_title}</h1>
                        <p className="text-lg text-neutral-600 mb-4">{job.company_name}</p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-x-6 gap-y-2 flex-wrap">
                            <span className="flex items-center gap-2 text-sm text-neutral-600">
                                <span className="material-symbols-outlined text-base">location_on</span>
                                {job.location}
                            </span>
                            <span className="flex items-center gap-2 text-sm text-neutral-600">
                                <span className="material-symbols-outlined text-base">work</span>
                                {job.employment_type}
                            </span>
                            <span className="flex items-center gap-2 text-sm text-neutral-600">
                                <span className="material-symbols-outlined text-base">schedule</span>
                                {getPostedTimeText(job.created_at)}
                            </span>
                            {job.min_salary && job.max_salary && (
                                <span className="flex items-center gap-2 text-sm font-medium text-primary">
                                    <span className="material-symbols-outlined text-base">payments</span>
                                    {getCurrencySymbol(job.salary_currency)}{job.min_salary.toLocaleString()} - {getCurrencySymbol(job.salary_currency)}{job.max_salary.toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Apply Button */}
                    <button className="px-6 h-11 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">send</span>
                        {t('applyNow')}
                    </button>
                </div>
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Job Description */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">description</span>
                            {t('jobDescription')}
                        </h2>
                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                            <p className="whitespace-pre-line text-neutral-600 dark:text-neutral-300">
                                {job.job_description}
                            </p>
                        </div>
                    </div>

                    {/* Required Skills */}
                    {job.required_skills && (
                        <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">psychology</span>
                                {t('requiredSkills')}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {job.required_skills.split(',').map((skill: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                    >
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Job Overview */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">{t('overview')}</h2>
                        <div className="space-y-4">
                            {job.experience_level && (
                                <div>
                                    <p className="text-sm text-neutral-600 mb-1">{t('experienceLevel')}</p>
                                    <p className="font-medium">{job.experience_level}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">{t('employmentType')}</p>
                                <p className="font-medium">{job.employment_type}</p>
                            </div>
                            <div>
                                <p className="text-sm text-neutral-600 mb-1">{t('location')}</p>
                                <p className="font-medium">{job.location}</p>
                            </div>
                            {job.salary_frequency && (
                                <div>
                                    <p className="text-sm text-neutral-600 mb-1">{t('salaryFrequency')}</p>
                                    <p className="font-medium">{job.salary_frequency}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Company Info */}
                    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">{t('aboutCompany')}</h2>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-12 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl text-neutral-600">
                                    business
                                </span>
                            </div>
                            <div>
                                <p className="font-bold">{job.company_name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Apply Card */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                        <h3 className="font-bold mb-2">{t('interestedTitle')}</h3>
                        <p className="text-sm text-neutral-600 mb-4">{t('interestedText')}</p>
                        <button className="w-full h-11 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">send</span>
                            {t('applyNow')}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
