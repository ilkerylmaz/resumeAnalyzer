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
  job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_title VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  posted_date DATE NOT NULL DEFAULT CURRENT_DATE,
  application_deadline DATE,
  job_description TEXT NOT NULL,
  min_salary NUMERIC(10, 2),
  max_salary NUMERIC(10, 2),
  salary_currency VARCHAR(10),  -- USD, TRY, EUR
  salary_frequency VARCHAR(20),  -- monthly, yearly, hourly
  employment_type VARCHAR(50) NOT NULL,  -- full-time, part-time, contract
  experience_level VARCHAR(50),  -- junior, mid, senior, lead
  required_skills TEXT,  -- Comma-separated or JSON array
  is_active BOOLEAN DEFAULT true,
  embedding vector(1024),  -- Gemini embedding for semantic search
  language VARCHAR(10) NOT NULL,  -- tr, en
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Max salary must be >= min salary (if both provided)
  CHECK (max_salary IS NULL OR max_salary >= min_salary)
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

-- Vector similarity search for resumes (pgvector IVFFLAT index)
CREATE INDEX idx_resumes_embedding ON resumes 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Vector similarity search for jobs (pgvector IVFFLAT index)
CREATE INDEX idx_jobs_embedding ON jobs 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Filter active jobs by language
CREATE INDEX idx_jobs_active_language ON jobs(is_active, language) 
WHERE is_active = true;

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

-- Function: Match jobs to user's CV using vector similarity
CREATE OR REPLACE FUNCTION match_jobs(
  query_embedding vector(1024),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 20
)
RETURNS TABLE (
  job_id uuid,
  job_title text,
  company_name text,
  location text,
  employment_type text,
  experience_level text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT 
    jobs.job_id,
    jobs.job_title,
    jobs.company_name,
    jobs.location,
    jobs.employment_type,
    jobs.experience_level,
    1 - (jobs.embedding <=> query_embedding) AS similarity
  FROM jobs
  WHERE 
    jobs.is_active = true
    AND 1 - (jobs.embedding <=> query_embedding) > match_threshold
  ORDER BY jobs.embedding <=> query_embedding
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
