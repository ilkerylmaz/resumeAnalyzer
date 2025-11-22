import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import {
    fetchJobs,
    getJobLocations,
    getEmploymentTypes,
    getExperienceLevels,
    getSalaryRange,
} from '@/lib/actions/job-actions'
import { JobsClient } from '@/components/jobs/jobs-client'
import { Navbar } from '@/components/navbar'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'jobs' })

    return {
        title: t('pageTitle'),
        description: t('showingJobs', { count: 500 }),
    }
}

export default async function JobsPage({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params

    // Fetch initial jobs data (server-side for SEO)
    const [result, locations, employmentTypes, experienceLevels, salaryRange] = await Promise.all([
        fetchJobs({}, { page: 1, limit: 10 }),
        getJobLocations(),
        getEmploymentTypes(),
        getExperienceLevels(),
        getSalaryRange(),
    ])

    return (
        <div className="h-screen overflow-hidden flex flex-col">
            <Navbar />
            <JobsClient
                initialJobs={result.jobs}
                initialTotalCount={result.totalCount}
                initialTotalPages={result.totalPages}
                locations={locations}
                employmentTypes={employmentTypes}
                experienceLevels={experienceLevels}
                salaryRange={salaryRange}
            />
        </div>
    )
}
