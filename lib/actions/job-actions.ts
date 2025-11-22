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
        // Build base query - fetch more data for client-side filtering
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
            const escapedSearch = filters.search.replace(/[%_]/g, '\\$&')
            query = query.or(
                `job_title.ilike.%${escapedSearch}%,company_name.ilike.%${escapedSearch}%,job_description.ilike.%${escapedSearch}%`
            )
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

        // Fetch all matching data (we'll filter locations client-side)
        query = query.order('created_at', { ascending: false })

        const { data, error, count } = await query

        if (error) {
            console.error('Error fetching jobs:', error)
            throw error
        }

        let filteredData = data || []

        // Client-side location filtering
        if (filters.locations && filters.locations.length > 0) {
            const normalizedLocations = filters.locations.map((loc) =>
                loc.replace('Istanbul', 'İstanbul').replace('Izmir', 'İzmir')
            )
            filteredData = filteredData.filter((job) =>
                normalizedLocations.some((loc) => job.location.includes(loc))
            )
        }

        // Apply pagination to filtered results
        const totalCount = filteredData.length
        const totalPages = Math.ceil(totalCount / limit)
        const paginatedData = filteredData.slice(offset, offset + limit)

        return {
            jobs: paginatedData,
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

// Get unique locations from jobs table
export async function getJobLocations(): Promise<string[]> {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('location')
            .eq('is_active', true)

        if (error) throw error

        // Extract unique locations and sort
        const locations = Array.from(new Set(data.map((job) => job.location)))
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b, 'tr'))

        return locations
    } catch (error) {
        console.error('Error fetching job locations:', error)
        return []
    }
}

// Get salary range from jobs table
export async function getSalaryRange(): Promise<{
    min: number
    max: number
}> {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('min_salary, max_salary')
            .eq('is_active', true)
            .not('min_salary', 'is', null)
            .not('max_salary', 'is', null)

        if (error) throw error

        if (!data || data.length === 0) {
            return { min: 0, max: 100000 }
        }

        const minSalaries = data.map((job) => job.min_salary).filter((s) => s !== null)
        const maxSalaries = data.map((job) => job.max_salary).filter((s) => s !== null)

        return {
            min: Math.min(...minSalaries),
            max: Math.max(...maxSalaries),
        }
    } catch (error) {
        console.error('Error fetching salary range:', error)
        return { min: 0, max: 100000 }
    }
}

// Get unique employment types from jobs table
export async function getEmploymentTypes(): Promise<string[]> {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('employment_type')
            .eq('is_active', true)

        if (error) throw error

        // Extract unique employment types
        const types = Array.from(new Set(data.map((job) => job.employment_type)))
            .filter(Boolean)
            .sort()

        return types
    } catch (error) {
        console.error('Error fetching employment types:', error)
        return []
    }
}

// Get unique experience levels from jobs table
export async function getExperienceLevels(): Promise<string[]> {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('jobs')
            .select('experience_level')
            .eq('is_active', true)

        if (error) throw error

        // Extract unique experience levels
        const levels = Array.from(new Set(data.map((job) => job.experience_level)))
            .filter(Boolean)
            .sort()

        return levels
    } catch (error) {
        console.error('Error fetching experience levels:', error)
        return []
    }
}
