import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { JobDetailClient } from '@/components/jobs/job-detail-client'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
    const { locale, id } = await params
    const supabase = await createClient()

    const { data: job } = await supabase
        .from('jobs')
        .select('job_title, company_name')
        .eq('job_id', id)
        .single()

    if (!job) {
        return {
            title: 'Job Not Found',
        }
    }

    return {
        title: `${job.job_title} - ${job.company_name}`,
        description: `Apply for ${job.job_title} position at ${job.company_name}`,
    }
}

export default async function JobDetailPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>
}) {
    const { locale, id } = await params
    const supabase = await createClient()

    const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('job_id', id)
        .eq('is_active', true)
        .single()

    if (error || !job) {
        notFound()
    }

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
            <Navbar />
            <JobDetailClient job={job} />
        </div>
    )
}
