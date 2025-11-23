-- ========================================
-- CareerPop Database Schema
-- Migration: 001_initial_schema
-- Created: November 16, 2025
-- Description: Initial database setup with all tables, indexes, RLS policies
-- ========================================

-- ========================================
-- EXTENSIONS
-- ========================================

-- Enable pgvector for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ========================================
-- CORE TABLES
-- ========================================

-- Main resumes table
CREATE TABLE resumes (
  resume_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  template_id TEXT DEFAULT 'template-a',  -- CV template: template-a, template-b, template-c
  is_primary BOOLEAN DEFAULT false,
  embedding vector(1024),  -- Gemini text-embedding-004 (1024 dimensions)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure only one primary CV per user
  CONSTRAINT unique_primary_per_user 
    EXCLUDE (user_id WITH =) WHERE (is_primary = true)
);

-- Personal details section (1-to-1 with resume)
CREATE TABLE resume_personal_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL UNIQUE REFERENCES resumes(resume_id) ON DELETE CASCADE,
  fullname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  age INTEGER,
  location VARCHAR(255),
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work experience section (1-to-many)
CREATE TABLE resume_experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  location VARCHAR(255),
  is_current BOOLEAN DEFAULT false,
  employment_type VARCHAR(50),  -- full-time, part-time, contract, etc.
  job_description TEXT,
  achievements TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- End date must be after start date (if provided)
  CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Education section (1-to-many)
CREATE TABLE resume_education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE,
  degree VARCHAR(255) NOT NULL,
  school_name VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  field_of_study VARCHAR(255),
  is_current BOOLEAN DEFAULT false,
  location VARCHAR(255),
  gpa NUMERIC(3, 2),  -- e.g., 3.85 out of 4.00
  honors TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects section (1-to-many)
CREATE TABLE resume_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE,
  project_name VARCHAR(255) NOT NULL,
  description TEXT,
  technologies_used TEXT,  -- Comma-separated or JSON array
  project_link VARCHAR(500),
  demo_url VARCHAR(500),
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates section (1-to-many)
CREATE TABLE resume_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE,
  certificate_name VARCHAR(255) NOT NULL,
  issuing_organization VARCHAR(255) NOT NULL,
  issue_date DATE NOT NULL,
  expiration_date DATE,
  does_not_expire BOOLEAN DEFAULT false,
  credential_id VARCHAR(255),
  credential_url VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Expiration date must be after issue date (if provided)
  CHECK (expiration_date IS NULL OR expiration_date >= issue_date)
);

-- Skills section (1-to-many)
CREATE TABLE resume_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),  -- Frontend, Backend, Database, DevOps, etc.
  proficiency_level VARCHAR(50),  -- beginner, intermediate, advanced, expert
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Languages section (1-to-many)
CREATE TABLE resume_languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE,
  language_name VARCHAR(100) NOT NULL,
  proficiency VARCHAR(50) NOT NULL,  -- native, fluent, intermediate, basic
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social media links section (1-to-many)
CREATE TABLE resume_social_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE,
  platform_name VARCHAR(100) NOT NULL,  -- LinkedIn, GitHub, Portfolio, etc.
  url VARCHAR(500) NOT NULL,
  username VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interests section (1-to-many)
CREATE TABLE resume_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE,
  interest_name VARCHAR(255) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job listings table
CREATE TABLE jobs (
  -- ============================================
  -- PRIMARY KEY & METADATA
  -- ============================================
  job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- ============================================
  -- BASIC JOB INFORMATION
  -- ============================================
  job_title VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  language VARCHAR(10) NOT NULL, -- 'tr' or 'en'
  is_active BOOLEAN DEFAULT true NOT NULL,
  
  -- ============================================
  -- JOB CONTENT (Structured for Semantic Matching)
  -- ============================================
  job_summary TEXT, -- 2-3 sentence overview (high priority for embedding)
  job_description TEXT NOT NULL, -- Full description (fallback)
  responsibilities JSONB, -- ["Develop features", "Code review"]
  
  -- ============================================
  -- SKILLS (Must-Have vs Nice-to-Have Separation)
  -- ============================================
  must_have_skills JSONB, -- ["React", "TypeScript", "5+ years"]
  nice_to_have_skills JSONB, -- ["GraphQL", "Docker", "AWS"]
  
  -- ============================================
  -- REQUIREMENTS & QUALIFICATIONS
  -- ============================================
  qualifications JSONB, -- ["BS in CS", "Strong communication"]
  required_education_level VARCHAR(50), -- none/high-school/bachelor/master/phd
  years_of_experience_min INTEGER,
  years_of_experience_max INTEGER,
  experience_level VARCHAR(50), -- junior/mid/senior/lead/principal
  
  -- ============================================
  -- SALARY INFORMATION
  -- ============================================
  min_salary NUMERIC(12, 2),
  max_salary NUMERIC(12, 2),
  salary_currency VARCHAR(10), -- TRY/USD/EUR/GBP
  salary_frequency VARCHAR(20), -- monthly/yearly/hourly/daily
  
  -- ============================================
  -- EMPLOYMENT DETAILS
  -- ============================================
  employment_type VARCHAR(50) NOT NULL, -- full-time/part-time/contract/freelance/internship
  remote_type VARCHAR(50), -- remote/hybrid/on-site
  
  -- ============================================
  -- COMPANY CONTEXT (Culture Fit)
  -- ============================================
  company_size VARCHAR(50), -- startup/small/medium/large/enterprise
  industry VARCHAR(100), -- tech/finance/healthcare/education/e-commerce
  benefits JSONB, -- ["Health insurance", "Remote work"]
  
  -- ============================================
  -- APPLICATION INFO
  -- ============================================
  application_url VARCHAR(500),
  application_deadline DATE,
  posted_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- ============================================
  -- LEGACY FIELD (Backward Compatibility)
  -- ============================================
  required_skills TEXT, -- Comma-separated (for old integration)
  
  -- ============================================
  -- EMBEDDINGS (Multi-Vector Strategy)
  -- ============================================
  embedding vector(1024), -- Main embedding (MVP - Phase 11)
  title_embedding vector(384), -- Job title + company (Phase 12)
  skills_embedding vector(1024), -- Must-have + nice-to-have (Phase 12)
  responsibilities_embedding vector(1024), -- Key duties (Phase 12)
  context_embedding vector(384), -- Company, industry, benefits (Phase 12)
  
  -- ============================================
  -- CONSTRAINTS
  -- ============================================
  CONSTRAINT check_salary_range 
    CHECK (max_salary IS NULL OR max_salary >= min_salary),
  
  CONSTRAINT check_experience_years 
    CHECK (years_of_experience_max IS NULL OR years_of_experience_max >= years_of_experience_min),
  
  CONSTRAINT check_language_valid 
    CHECK (language IN ('tr', 'en')),
  
  CONSTRAINT check_remote_type_valid 
    CHECK (remote_type IS NULL OR remote_type IN ('remote', 'hybrid', 'on-site')),
  
  CONSTRAINT check_company_size_valid 
    CHECK (company_size IS NULL OR company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
  
  CONSTRAINT check_education_level_valid 
    CHECK (required_education_level IS NULL OR required_education_level IN ('none', 'high-school', 'bachelor', 'master', 'phd')),
  
  CONSTRAINT check_employment_type_valid 
    CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'freelance', 'internship')),
  
  CONSTRAINT check_experience_level_valid 
    CHECK (experience_level IS NULL OR experience_level IN ('junior', 'mid', 'senior', 'lead', 'principal'))
);

-- Custom user data (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ========================================
-- INDEXES (Performance Optimization)
-- ========================================

-- Fast lookup for user's resumes
CREATE INDEX idx_resumes_user_id ON resumes(user_id);

-- Fast lookup for primary CV
CREATE INDEX idx_resumes_primary ON resumes(user_id, is_primary) 
WHERE is_primary = true;

-- Vector similarity search for resumes (HNSW - faster than IVFFlat)
CREATE INDEX idx_resumes_embedding ON resumes 
USING hnsw (embedding vector_cosine_ops);

-- ============================================
-- JOBS TABLE INDEXES (Multi-Vector + Filters)
-- ============================================

-- Filter active jobs by language (composite index)
CREATE INDEX idx_jobs_active_language ON jobs(is_active, language) 
WHERE is_active = true;

-- Sort by posted date
CREATE INDEX idx_jobs_posted_date ON jobs(posted_date DESC) 
WHERE is_active = true;

-- Filter by work preferences
CREATE INDEX idx_jobs_remote_type ON jobs(remote_type) 
WHERE is_active = true;

CREATE INDEX idx_jobs_company_size ON jobs(company_size) 
WHERE is_active = true;

CREATE INDEX idx_jobs_industry ON jobs(industry) 
WHERE is_active = true;

-- Filter by experience
CREATE INDEX idx_jobs_experience_level ON jobs(experience_level) 
WHERE is_active = true;

CREATE INDEX idx_jobs_experience_years ON jobs(years_of_experience_min, years_of_experience_max) 
WHERE is_active = true;

-- Filter by employment type
CREATE INDEX idx_jobs_employment_type ON jobs(employment_type) 
WHERE is_active = true;

-- Filter by salary range
CREATE INDEX idx_jobs_salary_range ON jobs(min_salary, max_salary) 
WHERE is_active = true;

-- GIN indexes for JSONB array queries (e.g., WHERE must_have_skills @> '["React"]')
CREATE INDEX idx_jobs_must_have_skills ON jobs USING GIN (must_have_skills);
CREATE INDEX idx_jobs_nice_to_have_skills ON jobs USING GIN (nice_to_have_skills);
CREATE INDEX idx_jobs_responsibilities ON jobs USING GIN (responsibilities);
CREATE INDEX idx_jobs_qualifications ON jobs USING GIN (qualifications);
CREATE INDEX idx_jobs_benefits ON jobs USING GIN (benefits);

-- HNSW vector indexes (faster approximate nearest neighbor than IVFFlat)
-- Single-vector (MVP)
CREATE INDEX idx_jobs_embedding ON jobs 
USING hnsw (embedding vector_cosine_ops);

-- Multi-vector (Phase 12)
CREATE INDEX idx_jobs_title_embedding ON jobs 
USING hnsw (title_embedding vector_cosine_ops);

CREATE INDEX idx_jobs_skills_embedding ON jobs 
USING hnsw (skills_embedding vector_cosine_ops);

CREATE INDEX idx_jobs_responsibilities_embedding ON jobs 
USING hnsw (responsibilities_embedding vector_cosine_ops);

CREATE INDEX idx_jobs_context_embedding ON jobs 
USING hnsw (context_embedding vector_cosine_ops);

-- Speed up resume section queries
CREATE INDEX idx_experience_resume ON resume_experience(resume_id);
CREATE INDEX idx_education_resume ON resume_education(resume_id);
CREATE INDEX idx_projects_resume ON resume_projects(resume_id);
CREATE INDEX idx_certificates_resume ON resume_certificates(resume_id);
CREATE INDEX idx_skills_resume ON resume_skills(resume_id);
CREATE INDEX idx_languages_resume ON resume_languages(resume_id);
CREATE INDEX idx_social_media_resume ON resume_social_media(resume_id);
CREATE INDEX idx_interests_resume ON resume_interests(resume_id);


-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_personal_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RESUMES TABLE POLICIES
-- ========================================

-- Users can view their own resumes
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own resumes
CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own resumes
CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own resumes
CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- RESUME SECTIONS POLICIES (All sections follow same pattern)
-- ========================================

-- Helper function: Check if resume belongs to current user
CREATE OR REPLACE FUNCTION user_owns_resume(resume_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM resumes 
    WHERE resume_id = resume_uuid 
    AND user_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Personal Details Policies
CREATE POLICY "Users can manage own resume personal details"
  ON resume_personal_details FOR ALL
  USING (user_owns_resume(resume_id));

-- Experience Policies
CREATE POLICY "Users can manage own resume experience"
  ON resume_experience FOR ALL
  USING (user_owns_resume(resume_id));

-- Education Policies
CREATE POLICY "Users can manage own resume education"
  ON resume_education FOR ALL
  USING (user_owns_resume(resume_id));

-- Projects Policies
CREATE POLICY "Users can manage own resume projects"
  ON resume_projects FOR ALL
  USING (user_owns_resume(resume_id));

-- Certificates Policies
CREATE POLICY "Users can manage own resume certificates"
  ON resume_certificates FOR ALL
  USING (user_owns_resume(resume_id));

-- Skills Policies
CREATE POLICY "Users can manage own resume skills"
  ON resume_skills FOR ALL
  USING (user_owns_resume(resume_id));

-- Languages Policies
CREATE POLICY "Users can manage own resume languages"
  ON resume_languages FOR ALL
  USING (user_owns_resume(resume_id));

-- Social Media Policies
CREATE POLICY "Users can manage own resume social media"
  ON resume_social_media FOR ALL
  USING (user_owns_resume(resume_id));

-- Interests Policies
CREATE POLICY "Users can manage own resume interests"
  ON resume_interests FOR ALL
  USING (user_owns_resume(resume_id));

-- ========================================
-- JOBS TABLE POLICIES (Public Read Access)
-- ========================================

-- Anyone (including anonymous users) can view active jobs
CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT
  USING (is_active = true);

-- Only authenticated users with service role can insert/update/delete jobs
-- (This will be handled via API routes with service role key)

-- ========================================
-- USERS TABLE POLICIES
-- ========================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (signup)
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);


-- ========================================
-- HELPER FUNCTIONS
-- ========================================

-- ============================================
-- FUNCTION: Single-Vector Job Matching (MVP - Phase 11)
-- ============================================
CREATE OR REPLACE FUNCTION match_jobs(
  query_embedding vector(1024),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 20,
  user_language text DEFAULT 'en'
)
RETURNS TABLE (
  job_id uuid,
  job_title text,
  company_name text,
  location text,
  employment_type text,
  remote_type text,
  experience_level text,
  years_of_experience_min int,
  years_of_experience_max int,
  min_salary numeric,
  max_salary numeric,
  salary_currency text,
  must_have_skills jsonb,
  nice_to_have_skills jsonb,
  job_summary text,
  posted_date date,
  application_url text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT 
    j.job_id,
    j.job_title,
    j.company_name,
    j.location,
    j.employment_type,
    j.remote_type,
    j.experience_level,
    j.years_of_experience_min,
    j.years_of_experience_max,
    j.min_salary,
    j.max_salary,
    j.salary_currency,
    j.must_have_skills,
    j.nice_to_have_skills,
    j.job_summary,
    j.posted_date,
    j.application_url,
    1 - (j.embedding <=> query_embedding) AS similarity
  FROM jobs j
  WHERE 
    j.is_active = true
    AND j.language = user_language
    AND 1 - (j.embedding <=> query_embedding) > match_threshold
  ORDER BY j.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- ============================================
-- FUNCTION: Multi-Vector Job Matching (Advanced - Phase 12)
-- Hybrid scoring: 0.20*title + 0.35*skills + 0.30*responsibilities + 0.15*context
-- ============================================
CREATE OR REPLACE FUNCTION match_jobs_multi_vector(
  cv_title_emb vector(384),
  cv_skills_emb vector(1024),
  cv_responsibilities_emb vector(1024),
  cv_context_emb vector(384),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 20,
  user_language text DEFAULT 'en'
)
RETURNS TABLE (
  job_id uuid,
  job_title text,
  company_name text,
  location text,
  employment_type text,
  remote_type text,
  experience_level text,
  years_of_experience_min int,
  years_of_experience_max int,
  min_salary numeric,
  max_salary numeric,
  salary_currency text,
  must_have_skills jsonb,
  nice_to_have_skills jsonb,
  job_summary text,
  posted_date date,
  application_url text,
  title_similarity float,
  skills_similarity float,
  responsibilities_similarity float,
  context_similarity float,
  weighted_score float
)
LANGUAGE sql STABLE
AS $$
  WITH scores AS (
    SELECT 
      j.job_id,
      j.job_title,
      j.company_name,
      j.location,
      j.employment_type,
      j.remote_type,
      j.experience_level,
      j.years_of_experience_min,
      j.years_of_experience_max,
      j.min_salary,
      j.max_salary,
      j.salary_currency,
      j.must_have_skills,
      j.nice_to_have_skills,
      j.job_summary,
      j.posted_date,
      j.application_url,
      1 - (j.title_embedding <=> cv_title_emb) AS title_sim,
      1 - (j.skills_embedding <=> cv_skills_emb) AS skills_sim,
      1 - (j.responsibilities_embedding <=> cv_responsibilities_emb) AS resp_sim,
      1 - (j.context_embedding <=> cv_context_emb) AS context_sim
    FROM jobs j
    WHERE 
      j.is_active = true
      AND j.language = user_language
  )
  SELECT 
    job_id,
    job_title,
    company_name,
    location,
    employment_type,
    remote_type,
    experience_level,
    years_of_experience_min,
    years_of_experience_max,
    min_salary,
    max_salary,
    salary_currency,
    must_have_skills,
    nice_to_have_skills,
    job_summary,
    posted_date,
    application_url,
    title_sim AS title_similarity,
    skills_sim AS skills_similarity,
    resp_sim AS responsibilities_similarity,
    context_sim AS context_similarity,
    (0.20 * title_sim + 0.35 * skills_sim + 0.30 * resp_sim + 0.15 * context_sim) AS weighted_score
  FROM scores
  WHERE (0.20 * title_sim + 0.35 * skills_sim + 0.30 * resp_sim + 0.15 * context_sim) > match_threshold
  ORDER BY weighted_score DESC
  LIMIT match_count;
$$;

-- Function: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on resumes table
CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at on users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Auto-update updated_at on jobs table
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ========================================
-- STORAGE BUCKETS (for CV uploads)
-- ========================================

-- Note: This must be run separately in Supabase Dashboard → Storage
-- or via Supabase CLI, not in SQL editor

-- Create bucket for CV uploads (PDF files)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('cv-uploads', 'cv-uploads', false);

-- RLS policy for cv-uploads bucket
-- CREATE POLICY "Users can upload own CVs"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'cv-uploads' 
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- CREATE POLICY "Users can view own CV uploads"
--   ON storage.objects FOR SELECT
--   USING (
--     bucket_id = 'cv-uploads'
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- CREATE POLICY "Users can delete own CV uploads"
--   ON storage.objects FOR DELETE
--   USING (
--     bucket_id = 'cv-uploads'
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );


-- ========================================
-- INITIAL DATA (Optional Sample Jobs)
-- ========================================

-- Uncomment to insert sample job data for testing

-- INSERT INTO jobs (
--   job_title, company_name, location, job_description, 
--   employment_type, experience_level, required_skills, language
-- ) VALUES
-- (
--   'Senior Full Stack Developer',
--   'TechCorp Inc.',
--   'Istanbul, Turkey (Remote)',
--   'We are looking for an experienced Full Stack Developer to join our team...',
--   'full-time',
--   'senior',
--   'React, Node.js, TypeScript, PostgreSQL, Docker',
--   'en'
-- ),
-- (
--   'Frontend Developer',
--   'StartupXYZ',
--   'Ankara, Turkey',
--   'Join our innovative team building next-gen web applications...',
--   'full-time',
--   'mid',
--   'React, Next.js, Tailwind CSS, JavaScript',
--   'tr'
-- );


-- ========================================
-- MIGRATION COMPLETE
-- ========================================

-- Database schema v1.0 initialized successfully
-- Next steps:
-- 1. Create storage bucket 'cv-uploads' in Supabase Dashboard
-- 2. Configure Supabase Auth settings (email verification, etc.)
-- 3. Generate embeddings for sample jobs (via API route)
-- 4. Test RLS policies with actual user accounts
