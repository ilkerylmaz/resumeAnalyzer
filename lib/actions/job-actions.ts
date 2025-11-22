'use server'

import { createClient } from '@/lib/supabase/server'

export interface JobFilters {
    search?: string
    locations?: string[]
    employmentTypes?: string[]
    experienceLevels?: string[]
    minSalary?: number
    maxSalary?: number
    language?: string
}

export interface PaginationParams {
    page?: number
    limit?: number
}

export interface JobResult {
    job_id: string
    job_title: string
    company_name: string
    location: string
    job_description: string
    employment_type: string
    experience_level: string
    required_skills: string | null
    min_salary: number | null
    max_salary: number | null
    created_at: string
    language: string
}

export interface FetchJobsResponse {
    jobs: JobResult[]
    totalCount: number
    page: number
    totalPages: number
}

export async function fetchJobs(
    filters: JobFilters = {},
    pagination: PaginationParams = {}
): Promise<FetchJobsResponse> {
    const supabase = await createClient()
    const page = pagination.page || 1
    const limit = pagination.limit || 10
    const offset = (page - 1) * limit

    try {
        // Build base query
        let query = supabase
            .from('jobs')
            .select('*', { count: 'exact' })
            .eq('is_active', true)

        // Apply language filter (default to current locale or all)
        if (filters.language) {
            query = query.eq('language', filters.language)
        }

        // Apply search filter
        if (filters.search && filters.search.trim()) {
            query = query.or(
                `job_title.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%,job_description.ilike.%${filters.search}%`
            )
        }

        // Apply location filter
        if (filters.locations && filters.locations.length > 0) {
            const locationConditions = filters.locations
                .map((loc) => `location.ilike.%${loc}%`)
                .join(',')
            query = query.or(locationConditions)
        }

        // Apply employment type filter
        if (filters.employmentTypes && filters.employmentTypes.length > 0) {
            query = query.in('employment_type', filters.employmentTypes)
        }

        // Apply experience level filter
        if (filters.experienceLevels && filters.experienceLevels.length > 0) {
            query = query.in('experience_level', filters.experienceLevels)
        }

        // Apply salary range filter
        if (filters.minSalary !== undefined) {
            query = query.gte('min_salary', filters.minSalary)
        }
        if (filters.maxSalary !== undefined) {
            query = query.lte('max_salary', filters.maxSalary)
        }

        // Apply pagination and sorting
        query = query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        const { data, error, count } = await query

        if (error) {
            console.error('Error fetching jobs:', error)
            throw error
        }

        const totalCount = count || 0
        const totalPages = Math.ceil(totalCount / limit)

        return {
            jobs: data || [],
            totalCount,
            page,
            totalPages,
        }
    } catch (error) {
        console.error('Error in fetchJobs:', error)
        return {
            jobs: [],
            totalCount: 0,
            page: 1,
            totalPages: 0,
        }
    }
}
