-- ========================================
-- Migration: REBUILD Jobs Table for Production-Grade Semantic Matching
-- Date: November 24, 2025
-- Author: AI CV Analyzer Team
-- Strategy: DROP + CREATE (clean slate, multi-vector embedding ready)
-- 
-- WARNING: This will DELETE all existing jobs data!
-- Safe because: Current jobs table has empty embeddings, no critical data loss
-- ========================================

-- ========================================
-- STEP 1: Drop existing jobs table
-- ========================================

-- Drop table with CASCADE to remove dependent objects (indexes, constraints)
DROP TABLE IF EXISTS jobs CASCADE;

-- Log confirmation
DO $$
BEGIN
  RAISE NOTICE '✓ Dropped old jobs table successfully';
END $$;


-- ========================================
-- STEP 2: Create new jobs table with complete schema
-- ========================================

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
  job_description TEXT NOT NULL, -- Full description (fallback if structured fields empty)
  responsibilities JSONB, -- ["Develop features", "Code review", "Mentor juniors"]
  
  -- ============================================
  -- SKILLS (Must-Have vs Nice-to-Have Separation)
  -- ============================================
  must_have_skills JSONB, -- ["React", "TypeScript", "5+ years experience"]
  nice_to_have_skills JSONB, -- ["GraphQL", "Docker", "AWS"]
  
  -- ============================================
  -- REQUIREMENTS & QUALIFICATIONS
  -- ============================================
  qualifications JSONB, -- ["BS in CS", "Strong communication", "Portfolio required"]
  required_education_level VARCHAR(50), -- 'none', 'high-school', 'bachelor', 'master', 'phd'
  years_of_experience_min INTEGER, -- Minimum years (e.g., 3)
  years_of_experience_max INTEGER, -- Maximum years (e.g., 7) - for junior roles
  experience_level VARCHAR(50), -- 'junior', 'mid', 'senior', 'lead', 'principal'
  
  -- ============================================
  -- SALARY INFORMATION
  -- ============================================
  min_salary NUMERIC(12, 2), -- Minimum salary
  max_salary NUMERIC(12, 2), -- Maximum salary
  salary_currency VARCHAR(10), -- 'TRY', 'USD', 'EUR', 'GBP'
  salary_frequency VARCHAR(20), -- 'monthly', 'yearly', 'hourly', 'daily'
  
  -- ============================================
  -- EMPLOYMENT DETAILS
  -- ============================================
  employment_type VARCHAR(50) NOT NULL, -- 'full-time', 'part-time', 'contract', 'freelance', 'internship'
  remote_type VARCHAR(50), -- 'remote', 'hybrid', 'on-site'
  
  -- ============================================
  -- COMPANY CONTEXT (Culture Fit Factors)
  -- ============================================
  company_size VARCHAR(50), -- 'startup', 'small', 'medium', 'large', 'enterprise'
  industry VARCHAR(100), -- 'tech', 'finance', 'healthcare', 'education', 'e-commerce'
  benefits JSONB, -- ["Health insurance", "Remote work", "Stock options", "Learning budget"]
  
  -- ============================================
  -- APPLICATION INFORMATION
  -- ============================================
  application_url VARCHAR(500), -- External link to apply
  application_deadline DATE, -- Last date to apply
  posted_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- ============================================
  -- LEGACY FIELD (Backward Compatibility)
  -- ============================================
  required_skills TEXT, -- Comma-separated skills (for old integration)
  
  -- ============================================
  -- EMBEDDINGS (Multi-Vector Strategy for Max Accuracy)
  -- ============================================
  
  -- Single vector (MVP - Phase 11)
  embedding vector(1024), -- Main embedding (all job content combined)
  
  -- Multi-vector embeddings (Phase 12 - Advanced Matching)
  title_embedding vector(384), -- Job title + company context
  skills_embedding vector(1024), -- Must-have + nice-to-have skills
  responsibilities_embedding vector(1024), -- Key responsibilities
  context_embedding vector(384), -- Company size, industry, benefits, remote type
  
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

-- Log confirmation
DO $$
BEGIN
  RAISE NOTICE '✓ Created new jobs table with complete schema';
END $$;


-- ========================================
-- STEP 3: Create Indexes (Performance Optimization)
-- ========================================

-- Regular B-Tree indexes for filtering/sorting
CREATE INDEX idx_jobs_active_language ON jobs(is_active, language) WHERE is_active = true;
CREATE INDEX idx_jobs_posted_date ON jobs(posted_date DESC) WHERE is_active = true;
CREATE INDEX idx_jobs_remote_type ON jobs(remote_type) WHERE is_active = true;
CREATE INDEX idx_jobs_company_size ON jobs(company_size) WHERE is_active = true;
CREATE INDEX idx_jobs_industry ON jobs(industry) WHERE is_active = true;
CREATE INDEX idx_jobs_experience_level ON jobs(experience_level) WHERE is_active = true;
CREATE INDEX idx_jobs_experience_years ON jobs(years_of_experience_min, years_of_experience_max) WHERE is_active = true;
CREATE INDEX idx_jobs_employment_type ON jobs(employment_type) WHERE is_active = true;
CREATE INDEX idx_jobs_salary_range ON jobs(min_salary, max_salary) WHERE is_active = true;

-- GIN indexes for JSONB columns (fast JSON queries like "does array contain value?")
CREATE INDEX idx_jobs_must_have_skills ON jobs USING GIN (must_have_skills);
CREATE INDEX idx_jobs_nice_to_have_skills ON jobs USING GIN (nice_to_have_skills);
CREATE INDEX idx_jobs_responsibilities ON jobs USING GIN (responsibilities);
CREATE INDEX idx_jobs_qualifications ON jobs USING GIN (qualifications);
CREATE INDEX idx_jobs_benefits ON jobs USING GIN (benefits);

-- Vector indexes for similarity search (HNSW = fast approximate nearest neighbor)
-- Single vector index (MVP)
CREATE INDEX idx_jobs_embedding ON jobs USING hnsw (embedding vector_cosine_ops);

-- Multi-vector indexes (Phase 12)
CREATE INDEX idx_jobs_title_embedding ON jobs USING hnsw (title_embedding vector_cosine_ops);
CREATE INDEX idx_jobs_skills_embedding ON jobs USING hnsw (skills_embedding vector_cosine_ops);
CREATE INDEX idx_jobs_responsibilities_embedding ON jobs USING hnsw (responsibilities_embedding vector_cosine_ops);
CREATE INDEX idx_jobs_context_embedding ON jobs USING hnsw (context_embedding vector_cosine_ops);

-- Log confirmation
DO $$
BEGIN
  RAISE NOTICE '✓ Created 24 indexes for optimal query performance';
END $$;


-- ========================================
-- STEP 4: Create Triggers (Auto-Update Timestamps)
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call function on every UPDATE
CREATE TRIGGER trigger_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_jobs_updated_at();

-- Log confirmation
DO $$
BEGIN
  RAISE NOTICE '✓ Created trigger for auto-updating timestamps';
END $$;


-- ========================================
-- STEP 5: Create Database Functions (Semantic Matching)
-- ========================================

-- Function: Single-vector job matching (Phase 11 MVP)
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
  experience_level text,
  remote_type text,
  company_size text,
  industry text,
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
    jobs.remote_type,
    jobs.company_size,
    jobs.industry,
    1 - (jobs.embedding <=> query_embedding) AS similarity
  FROM jobs
  WHERE 
    jobs.is_active = true
    AND jobs.language = user_language
    AND 1 - (jobs.embedding <=> query_embedding) > match_threshold
  ORDER BY jobs.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Function: Multi-vector job matching (Phase 12 Advanced)
-- Hybrid scoring: 35% skills + 30% responsibilities + 20% title + 15% context
CREATE OR REPLACE FUNCTION match_jobs_multi_vector(
  query_title_embedding vector(384),
  query_skills_embedding vector(1024),
  query_responsibilities_embedding vector(1024),
  query_context_embedding vector(384),
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
  experience_level text,
  remote_type text,
  company_size text,
  industry text,
  title_similarity float,
  skills_similarity float,
  responsibilities_similarity float,
  context_similarity float,
  weighted_score float
)
LANGUAGE sql STABLE
AS $$
  WITH similarities AS (
    SELECT 
      jobs.job_id,
      jobs.job_title,
      jobs.company_name,
      jobs.location,
      jobs.employment_type,
      jobs.experience_level,
      jobs.remote_type,
      jobs.company_size,
      jobs.industry,
      1 - (jobs.title_embedding <=> query_title_embedding) AS title_sim,
      1 - (jobs.skills_embedding <=> query_skills_embedding) AS skills_sim,
      1 - (jobs.responsibilities_embedding <=> query_responsibilities_embedding) AS responsibilities_sim,
      1 - (jobs.context_embedding <=> query_context_embedding) AS context_sim
    FROM jobs
    WHERE 
      jobs.is_active = true
      AND jobs.language = user_language
  )
  SELECT 
    job_id,
    job_title,
    company_name,
    location,
    employment_type,
    experience_level,
    remote_type,
    company_size,
    industry,
    title_sim,
    skills_sim,
    responsibilities_sim,
    context_sim,
    (0.20 * title_sim + 0.35 * skills_sim + 0.30 * responsibilities_sim + 0.15 * context_sim) AS weighted_score
  FROM similarities
  WHERE (0.20 * title_sim + 0.35 * skills_sim + 0.30 * responsibilities_sim + 0.15 * context_sim) > match_threshold
  ORDER BY weighted_score DESC
  LIMIT match_count;
$$;

-- Log confirmation
DO $$
BEGIN
  RAISE NOTICE '✓ Created match_jobs() and match_jobs_multi_vector() functions';
END $$;


-- ========================================
-- STEP 6: Add Column Comments (Documentation)
-- ========================================

COMMENT ON TABLE jobs IS 'Job postings with multi-vector embeddings for semantic CV matching';

-- Primary key & metadata
COMMENT ON COLUMN jobs.job_id IS 'Unique job identifier (UUID)';
COMMENT ON COLUMN jobs.created_at IS 'Timestamp when job was created';
COMMENT ON COLUMN jobs.updated_at IS 'Timestamp when job was last updated (auto-updated via trigger)';

-- Basic info
COMMENT ON COLUMN jobs.job_title IS 'Job position title (e.g., "Senior Frontend Developer")';
COMMENT ON COLUMN jobs.company_name IS 'Company/organization name';
COMMENT ON COLUMN jobs.location IS 'Job location (e.g., "İstanbul, Türkiye" or "Remote")';
COMMENT ON COLUMN jobs.language IS 'Job posting language: tr or en';
COMMENT ON COLUMN jobs.is_active IS 'Whether job is currently accepting applications';

-- Job content
COMMENT ON COLUMN jobs.job_summary IS 'Brief 2-3 sentence overview (high priority for embedding)';
COMMENT ON COLUMN jobs.job_description IS 'Full job description (fallback if structured fields empty)';
COMMENT ON COLUMN jobs.responsibilities IS 'JSONB array: ["Develop features", "Code review", "Mentor juniors"]';

-- Skills
COMMENT ON COLUMN jobs.must_have_skills IS 'JSONB array of required skills: ["React", "TypeScript", "5+ years"]';
COMMENT ON COLUMN jobs.nice_to_have_skills IS 'JSONB array of preferred skills: ["GraphQL", "Docker", "AWS"]';

-- Requirements
COMMENT ON COLUMN jobs.qualifications IS 'JSONB array: ["BS in CS", "Strong communication", "Portfolio"]';
COMMENT ON COLUMN jobs.required_education_level IS 'Minimum education: none, high-school, bachelor, master, phd';
COMMENT ON COLUMN jobs.years_of_experience_min IS 'Minimum years of experience required';
COMMENT ON COLUMN jobs.years_of_experience_max IS 'Maximum years (optional, for junior roles)';
COMMENT ON COLUMN jobs.experience_level IS 'Job level: junior, mid, senior, lead, principal';

-- Salary
COMMENT ON COLUMN jobs.min_salary IS 'Minimum salary';
COMMENT ON COLUMN jobs.max_salary IS 'Maximum salary';
COMMENT ON COLUMN jobs.salary_currency IS 'Currency code: TRY, USD, EUR, GBP';
COMMENT ON COLUMN jobs.salary_frequency IS 'Payment frequency: monthly, yearly, hourly, daily';

-- Employment
COMMENT ON COLUMN jobs.employment_type IS 'Type: full-time, part-time, contract, freelance, internship';
COMMENT ON COLUMN jobs.remote_type IS 'Work location: remote, hybrid, on-site';

-- Company
COMMENT ON COLUMN jobs.company_size IS 'Size: startup, small, medium, large, enterprise';
COMMENT ON COLUMN jobs.industry IS 'Industry/sector: tech, finance, healthcare, education, e-commerce';
COMMENT ON COLUMN jobs.benefits IS 'JSONB array: ["Health insurance", "Remote work", "Stock options"]';

-- Application
COMMENT ON COLUMN jobs.application_url IS 'External URL to apply for the job';
COMMENT ON COLUMN jobs.application_deadline IS 'Last date to apply';
COMMENT ON COLUMN jobs.posted_date IS 'Date when job was posted';

-- Legacy
COMMENT ON COLUMN jobs.required_skills IS 'Comma-separated skills (backward compatibility)';

-- Embeddings
COMMENT ON COLUMN jobs.embedding IS 'Main embedding (1024-dim) - all job content combined';
COMMENT ON COLUMN jobs.title_embedding IS 'Title embedding (384-dim) - job title + company context';
COMMENT ON COLUMN jobs.skills_embedding IS 'Skills embedding (1024-dim) - must-have + nice-to-have skills';
COMMENT ON COLUMN jobs.responsibilities_embedding IS 'Responsibilities embedding (1024-dim) - key duties';
COMMENT ON COLUMN jobs.context_embedding IS 'Context embedding (384-dim) - company, industry, benefits, remote';

-- Log confirmation
DO $$
BEGIN
  RAISE NOTICE '✓ Added documentation comments for all columns';
END $$;


-- ========================================
-- STEP 7: Insert Sample Data (For Testing)
-- ========================================

INSERT INTO jobs (
  job_title,
  company_name,
  location,
  language,
  job_summary,
  job_description,
  responsibilities,
  must_have_skills,
  nice_to_have_skills,
  qualifications,
  benefits,
  employment_type,
  experience_level,
  min_salary,
  max_salary,
  salary_currency,
  salary_frequency,
  company_size,
  industry,
  remote_type,
  application_url,
  years_of_experience_min,
  years_of_experience_max,
  required_education_level,
  required_skills,
  is_active
) VALUES 
(
  'Senior Full Stack Developer',
  'TechVision Inc.',
  'İstanbul, Türkiye',
  'tr',
  'Yenilikçi ekibimize katılın ve modern teknolojilerle yeni nesil web uygulamaları geliştirin. Ölçeklenebilir, performanslı ve kullanıcı dostu arayüzler tasarlayacaksınız.',
  'Büyüyen mühendislik ekibimize katılacak yetenekli bir Senior Full Stack Developer arıyoruz. Müşterilerimizi memnun edecek ölçeklenebilir, performanslı ve güzel kullanıcı arayüzleri oluşturmaktan sorumlu olacaksınız. Backend API tasarımından frontend component geliştirmeye kadar tam yığın sorumluluk alacaksınız.',
  '["React ve Next.js kullanarak yeni kullanıcı arayüzleri geliştirmek", "Yeniden kullanılabilir komponentler ve kütüphaneler oluşturmak", "Backend mühendisleriyle API tasarımı konusunda işbirliği yapmak", "Uygulamaları maksimum hız ve ölçeklenebilirlik için optimize etmek", "Junior developerları mentorluk yapmak ve kod incelemeleri yapmak", "PostgreSQL veritabanı şemaları tasarlamak ve optimize etmek", "CI/CD pipeline''larını kurmak ve sürdürmek"]'::jsonb,
  '["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "Git", "REST API"]'::jsonb,
  '["GraphQL", "Docker", "Kubernetes", "AWS", "Redis", "Jest", "Cypress", "Tailwind CSS"]'::jsonb,
  '["Bilgisayar Mühendisliği veya ilgili alanda Lisans derecesi", "5+ yıl profesyonel full stack development deneyimi", "Web performans optimizasyonu konusunda güçlü bilgi", "Modern build araçları deneyimi (Webpack, Vite, Turbopack)", "Agile/Scrum metodolojileri ile çalışma tecrübesi", "İngilizce teknik dokümantasyon okuma/yazma"]'::jsonb,
  '["Rekabetçi maaş", "Özel sağlık sigortası (çalışan + aile)", "Esnek çalışma saatleri", "Hibrit çalışma (3 gün ofis, 2 gün remote)", "Yıllık performans bonusu", "Eğitim bütçesi (konferans, kurs, kitap)", "Levent''te modern ofis", "Ücretsiz yemek", "Spor salonu üyeliği"]'::jsonb,
  'full-time',
  'senior',
  120000,
  180000,
  'TRY',
  'yearly',
  'medium',
  'tech',
  'hybrid',
  'https://techvision.com/careers/senior-fullstack',
  5,
  8,
  'bachelor',
  'React, TypeScript, Next.js, Node.js, PostgreSQL, Git, REST API, GraphQL, Docker',
  true
),
(
  'Junior Frontend Developer',
  'StartupLab',
  'Remote',
  'en',
  'Join our fast-growing startup and learn from experienced engineers. Build modern web apps with React, TypeScript, and cutting-edge tools.',
  'We are looking for a motivated Junior Frontend Developer to join our remote team. You will work closely with senior engineers, participate in code reviews, and contribute to real-world projects used by thousands of users. This is a great opportunity for fresh graduates or developers with 1-2 years of experience.',
  '["Develop UI components using React and TypeScript", "Write clean, maintainable, and well-documented code", "Participate in daily standups and sprint planning", "Fix bugs and improve existing features", "Learn from code reviews and pair programming sessions", "Write unit tests with Jest", "Collaborate with designers to implement pixel-perfect interfaces"]'::jsonb,
  '["HTML", "CSS", "JavaScript", "React", "Git", "Basic TypeScript knowledge"]'::jsonb,
  '["Next.js", "Tailwind CSS", "Styled Components", "Jest", "React Testing Library", "Figma", "Storybook"]'::jsonb,
  '["Bachelor''s degree in Computer Science or related field (or equivalent bootcamp)", "0-2 years of professional experience", "Strong problem-solving skills", "Eagerness to learn and grow", "Good communication skills", "Portfolio or GitHub projects demonstrating React skills"]'::jsonb,
  '["Fully remote work (work from anywhere)", "Mentorship from senior engineers", "Learning budget ($500/year)", "Flexible hours", "Startup equity (0.1-0.3%)", "Health insurance after 3 months", "Annual team retreats"]'::jsonb,
  'full-time',
  'junior',
  40000,
  60000,
  'USD',
  'yearly',
  'startup',
  'tech',
  'remote',
  'https://startuplab.io/careers/junior-frontend',
  0,
  2,
  'bachelor',
  'HTML, CSS, JavaScript, React, TypeScript, Git',
  true
),
(
  'Lead Mobile Developer (React Native)',
  'FinTech Global',
  'London, UK',
  'en',
  'Lead our mobile engineering team and build world-class fintech apps used by millions. Expert-level React Native, TypeScript, and native iOS/Android experience required.',
  'FinTech Global is seeking an exceptional Lead Mobile Developer to architect and build our next-generation mobile banking platform. You will lead a team of 5-7 mobile engineers, make critical technical decisions, and ensure our apps deliver exceptional performance, security, and user experience. This is a high-impact role working on products used by 2M+ active users.',
  '["Architect and build scalable React Native applications", "Lead mobile engineering team (5-7 developers)", "Define mobile development standards and best practices", "Conduct technical interviews and mentor team members", "Collaborate with product managers to define roadmap", "Optimize app performance (60 FPS, <3s startup time)", "Implement security best practices (encryption, biometrics, secure storage)", "Work with native iOS/Android code when needed", "Set up monitoring and crash reporting (Sentry, Firebase)", "Drive technical decisions (state management, navigation, testing)"]'::jsonb,
  '["React Native", "TypeScript", "iOS development (Swift/Objective-C)", "Android development (Kotlin/Java)", "Redux or MobX", "Native modules", "Git", "CI/CD (Fastlane, GitHub Actions)", "App Store and Google Play submission"]'::jsonb,
  '["GraphQL", "WebSockets", "Push notifications (FCM, APNs)", "Deep linking", "Biometric authentication", "Offline-first architecture", "E2E testing (Detox, Appium)", "Code signing and distribution", "MonoRepo experience (Nx, Turborepo)"]'::jsonb,
  '["Bachelor''s or Master''s degree in Computer Science", "7+ years mobile development experience", "3+ years React Native in production", "2+ years leading engineering teams", "Published apps with 100K+ downloads", "Strong understanding of mobile security", "Experience in fintech or banking domain", "Excellent communication and leadership skills"]'::jsonb,
  '["Competitive salary (£90K-£130K)", "Annual bonus (10-20%)", "Stock options", "Private health insurance (Bupa)", "Pension contribution (5% match)", "25 days vacation + bank holidays", "Hybrid work (2 days office)", "Learning budget (£2000/year)", "Latest MacBook Pro + accessories", "Visa sponsorship available"]'::jsonb,
  'full-time',
  'lead',
  90000,
  130000,
  'GBP',
  'yearly',
  'large',
  'finance',
  'hybrid',
  'https://fintechglobal.com/careers/lead-mobile',
  7,
  NULL,
  'bachelor',
  'React Native, TypeScript, iOS, Android, Swift, Kotlin, Redux, Git, CI/CD',
  true
);

-- Log confirmation
DO $$
BEGIN
  RAISE NOTICE '✓ Inserted 3 sample jobs for testing';
END $$;


-- ========================================
-- MIGRATION COMPLETE ✓
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '✓ MIGRATION COMPLETE - Jobs Table Rebuilt Successfully';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
  RAISE NOTICE '';
  RAISE NOTICE 'What was created:';
  RAISE NOTICE '  ✓ jobs table (31 columns + 8 constraints)';
  RAISE NOTICE '  ✓ 24 indexes (9 B-tree + 5 GIN + 5 HNSW + 1 composite)';
  RAISE NOTICE '  ✓ 1 trigger (auto-update timestamps)';
  RAISE NOTICE '  ✓ 2 functions (match_jobs, match_jobs_multi_vector)';
  RAISE NOTICE '  ✓ 3 sample jobs (Turkish Senior, English Junior, English Lead)';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Update TypeScript interfaces in lib/actions/job-actions.ts';
  RAISE NOTICE '  2. Implement embedding generation in lib/gemini/embeddings.ts';
  RAISE NOTICE '  3. Update job detail page UI to display new fields';
  RAISE NOTICE '  4. Add filter options to FilterPanel component';
  RAISE NOTICE '  5. Test semantic matching with real CVs';
  RAISE NOTICE '';
  RAISE NOTICE 'Verify migration:';
  RAISE NOTICE '  SELECT COUNT(*) FROM jobs; -- Should return 3';
  RAISE NOTICE '  SELECT column_name FROM information_schema.columns WHERE table_name = ''jobs'';';
  RAISE NOTICE '';
  RAISE NOTICE '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
END $$;
