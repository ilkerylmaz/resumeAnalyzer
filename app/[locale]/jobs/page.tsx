import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { fetchJobs } from '@/lib/actions/job-actions'
import { JobsClient } from '@/components/jobs/jobs-client'

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
    const result = await fetchJobs(
        { language: locale },
        { page: 1, limit: 10 }
    )

    return (
        <JobsClient
            initialJobs={result.jobs}
            initialTotalCount={result.totalCount}
            initialTotalPages={result.totalPages}
        />
    )
}
