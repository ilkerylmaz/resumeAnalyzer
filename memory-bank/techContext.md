# Tech Context

## Technology Stack Overview

### Frontend Framework
**Next.js 14+ (App Router)**
- **Why:** Server components, built-in API routes, optimal performance, excellent Vercel integration
- **Routing:** App Router (not Pages Router) for modern React patterns
- **Rendering:** Mix of SSR (dashboard), SSG (marketing pages), and CSR (CV builder)
- **Version:** Latest stable (14.x or 15.x at implementation time)

### Language
**TypeScript**
- **Why:** Type safety, better DX, catches errors at compile time
- **Config:** Strict mode enabled
- **Standards:** 
  - Interfaces for data models
  - Types for component props
  - Enums for constants (job types, proficiency levels, etc.)

### Styling
**Tailwind CSS 3.x**
- **Why:** Utility-first, rapid development, small bundle size, excellent with Next.js
- **Configuration:**
  - Custom color palette (primary, secondary, accent)
  - Extended spacing for CV templates
  - Dark mode support (optional post-MVP)
- **Organization:** Component-level classes, avoid global styles

**shadcn/ui**
- **Why:** Beautiful, accessible, customizable components built on Radix UI
- **Components to Use:**
  - `Button`, `Input`, `Textarea`, `Select`, `Dialog`
  - `Card`, `Tabs`, `Accordion`
  - `Form` (integrates with React Hook Form)
  - `Dropdown Menu`, `Toast`
- **Customization:** All components styled with Tailwind, full source control

### State Management
**Zustand**
- **Why:** Lightweight (3kb), simple API, no boilerplate, perfect for React 18+
- **Use Cases:**
  - CV form state (shared between form and live preview)
  - User preferences (language, selected CV)
  - UI state (modals, notifications)
- **Structure:**
  ```typescript
  // stores/cvStore.ts
  interface CVStore {
    currentCV: ResumeData | null
    updatePersonalInfo: (data: PersonalInfo) => void
    addExperience: (exp: Experience) => void
    // ...
  }
  ```

**React Hook Form + Zod**
- **React Hook Form:** Form state, validation, performance optimization
- **Zod:** Schema validation, type inference
- **Why:** Best-in-class form handling, minimal re-renders, excellent TypeScript support
- **Pattern:**
  ```typescript
  const schema = z.object({
    fullname: z.string().min(2),
    email: z.string().email(),
    // ...
  })
  type FormData = z.infer<typeof schema>
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema)
  })
  ```

---

## Backend & Database

### Backend Architecture
**Next.js API Routes (App Router)**
- **Why:** 
  - Full-stack framework (no separate backend needed)
  - Serverless functions on Vercel
  - Type-safe with TypeScript
  - Same codebase as frontend
  - Built-in API routing
- **Runtime:** Node.js 18+ (Vercel serverless functions)
- **API Structure:** Route Handlers in `app/api/` directory
- **Execution:** Edge Runtime for simple queries, Node.js Runtime for AI/file operations

**Key Backend Operations:**
1. **CV Parsing** (`/api/cv/parse`)
   - PDF text extraction (pdf-parse)
   - Gemini API calls for structured data
   - Node.js Runtime (needs file system)

2. **Embedding Generation** (`/api/cv/embed`)
   - Gemini API calls
   - Vector storage in Supabase
   - Node.js Runtime

3. **Job Matching** (`/api/jobs/match`)
   - Supabase pgvector queries
   - Can use Edge Runtime (fast)

4. **File Operations** (`/api/export/*`)
   - PDF generation (react-to-print client-side)
   - DOCX generation (post-MVP, Node.js Runtime)

**Security:**
- Server-side API key storage (never exposed to client)
- Supabase Row-Level Security (RLS) enforces data access
- CORS configured for same-origin only
- Rate limiting via Vercel edge middleware

### Database
**Supabase (PostgreSQL 15+)**
- **Why:** 
  - Postgres with pgvector extension (critical for embeddings)
  - Built-in auth
  - Real-time subscriptions (optional future feature)
  - Row-level security (RLS)
  - Free tier generous for MVP
  - RESTful API auto-generated from schema
  - PostgREST for direct database queries
- **Extensions:**
  - `pgvector`: Vector similarity search
  - `uuid-ossp`: UUID generation
  - `pg_trgm`: Text search (optional)
- **Connection:**
  - Direct connection via Supabase client library
  - Connection pooling handled by Supabase
  - SSL/TLS encryption

### Authentication
**Supabase Auth**
- **Methods (MVP):**
  - Email + Password (primary)
  - Magic Link (email-only login)
- **Future:**
  - OAuth (Google, GitHub)
- **Session Management:**
  - JWT tokens
  - Automatic refresh
  - Next.js middleware for protected routes
- **User Table:**
  - Supabase `auth.users` for credentials
  - Custom `public.users` for app data (preferred_language, created_at)

### ORM / Query Builder
**Supabase Client Library**
- **Why:** Direct Postgres access, generated types, real-time support
- **Alternative Considered:** Prisma (decided against due to Supabase's native client being sufficient)
- **Pattern:**
  ```typescript
  const { data, error } = await supabase
    .from('resumes')
    .select('*, resume_experience(*)')
    .eq('user_id', userId)
  ```

### API Routes
**Next.js Route Handlers (App Router)**
- **Location:** `app/api/[endpoint]/route.ts`
- **Key Routes:**
  - `POST /api/cv/parse` - PDF upload & Gemini parsing
  - `POST /api/cv/embed` - Generate CV embedding
  - `GET /api/jobs/match` - Get matched jobs
  - `POST /api/export/pdf` - (Optional) Server-side PDF generation
  - `POST /api/export/docx` - (Post-MVP) DOCX export

---

## AI & Machine Learning

### Primary AI Service
**Google Gemini API**
- **Models Used:**
  - `gemini-pro`: CV parsing, ATS analysis (text generation)
  - `text-embedding-004`: Embedding generation (1024 dimensions)
- **SDK:** `@google/generative-ai` (official Node.js library)
- **API Key:** Stored in `.env.local` as `GEMINI_API_KEY`
- **Rate Limiting:** 
  - Free tier: 60 requests/minute
  - Implement client-side debouncing
  - Server-side caching for repeat queries

### Embeddings Strategy

#### CV Embeddings
```typescript
// When user saves/updates CV
const cvText = `
  Summary: ${personalInfo.summary}
  
  Experience:
  ${experiences.map(e => 
    `${e.title} at ${e.companyName}: ${e.jobDescription}`
  ).join('\n')}
  
  Skills: ${skills.map(s => s.skillName).join(', ')}
  
  Education: ${education.map(e => 
    `${e.degree} in ${e.fieldOfStudy} at ${e.schoolName}`
  ).join('\n')}
`

const embedding = await gemini.embedContent({
  content: cvText,
  model: 'text-embedding-004'
})

// Store in resumes.embedding (vector column)
```

#### Job Embeddings
```typescript
// When admin adds job (manual process)
const jobText = `
  ${job.job_title}
  Company: ${job.company_name}
  Description: ${job.job_description}
  Required Skills: ${job.required_skills.join(', ')}
  Experience Level: ${job.experience_level}
`

const embedding = await gemini.embedContent({
  content: jobText,
  model: 'text-embedding-004'
})
```

### Vector Search (pgvector)
**Setup:**
```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add vector column to resumes
ALTER TABLE resumes 
ADD COLUMN embedding vector(1024);

-- Create index for fast similarity search
CREATE INDEX ON resumes 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Same for jobs table
ALTER TABLE jobs 
ADD COLUMN embedding vector(1024);

CREATE INDEX ON jobs 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

**Query Pattern:**
```typescript
// Find similar jobs to user's CV
const { data: jobs } = await supabase.rpc('match_jobs', {
  query_embedding: userCVEmbedding,
  match_threshold: 0.5,  // Minimum similarity
  match_count: 20
})

// SQL function:
CREATE FUNCTION match_jobs(
  query_embedding vector(1024),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  job_id uuid,
  job_title text,
  company_name text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT 
    job_id,
    job_title,
    company_name,
    1 - (embedding <=> query_embedding) AS similarity
  FROM jobs
  WHERE 
    1 - (embedding <=> query_embedding) > match_threshold
    AND is_active = true
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

---

## File Handling

### PDF Upload
**Libraries:**
- `pdf-parse` (Node.js, server-side only)
  - **Why:** Reliable text extraction from PDF
  - **Limitations:** 
    - No OCR (scanned PDFs won't work - acceptable for MVP)
    - Formatting lost (only raw text extracted)

**Upload Flow:**
```typescript
// Client: Upload to Supabase Storage
const file = event.target.files[0]
const { data, error } = await supabase.storage
  .from('cv-uploads')
  .upload(`${userId}/${file.name}`, file)

// Client: Trigger parsing
const response = await fetch('/api/cv/parse', {
  method: 'POST',
  body: JSON.stringify({ filePath: data.path })
})

// Server: /api/cv/parse
import pdf from 'pdf-parse'

const fileBuffer = await supabase.storage
  .from('cv-uploads')
  .download(filePath)

const pdfData = await pdf(fileBuffer)
const extractedText = pdfData.text

// Send to Gemini for structured extraction
const result = await gemini.generateContent({
  contents: [{
    parts: [{
      text: `Extract CV data from this text and return JSON:
      ${extractedText}
      
      Schema: {
        personalInfo: { fullname, email, phone, location, summary },
        experience: [{ title, companyName, startDate, endDate, description }],
        education: [...],
        skills: [...]
      }`
    }]
  }]
})

const parsedData = JSON.parse(result.response.text())
return parsedData
```

### PDF Export
**Library:** `react-to-print`
- **Why:** Preserves React component styling, works with Tailwind
- **How:**
  ```typescript
  import { useReactToPrint } from 'react-to-print'
  
  const handlePrint = useReactToPrint({
    content: () => cvTemplateRef.current,
    documentTitle: `${user.fullname}_CV`
  })
  
  // User clicks "Download PDF" → Browser print dialog → Save as PDF
  ```
- **Styling:** Use Tailwind with print-specific classes (`print:hidden`, `print:text-black`)

### DOCX Export (Post-MVP)
**Library:** `docx` (docx.js)
- **Why:** Programmatic .docx creation, full control
- **Server-Side Route:** `/api/export/docx`
- **Pattern:**
  ```typescript
  import { Document, Packer, Paragraph, TextRun } from 'docx'
  
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          children: [new TextRun({ text: cvData.personalInfo.fullname, bold: true })]
        }),
        // ... build document programmatically
      ]
    }]
  })
  
  const buffer = await Packer.toBuffer(doc)
  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename=cv.docx'
    }
  })
  ```

### File Storage
**Supabase Storage**
- **Bucket:** `cv-uploads` (for user-uploaded PDFs)
- **Configuration:**
  - Max file size: 5MB
  - Allowed types: `application/pdf`
  - Public: No (authenticated users only)
  - RLS policy: Users can only access their own files
- **Cleanup:** Delete uploaded PDF after successful parsing (or keep for 24hrs as backup)

---

## Internationalization (i18n)

### Library
**next-intl**
- **Why:** 
  - Built for App Router
  - Type-safe translations
  - Server component support
  - Automatic locale detection
- **Version:** 3.x

### Implementation

#### Routing Structure
```
/app
  /[locale]         # Dynamic locale segment
    /layout.tsx     # Root layout with locale
    /page.tsx       # Home page
    /dashboard
      /page.tsx
    /cv
      /create
        /page.tsx
```

#### Middleware
```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware'
import { createClient } from '@supabase/supabase-js'

export default async function middleware(request) {
  const supabase = createClient(...)
  const { data: { user } } = await supabase.auth.getUser()
  
  let defaultLocale = 'en'
  
  if (user) {
    // Fetch user's preferred language from database
    const { data } = await supabase
      .from('users')
      .select('preferred_language')
      .eq('id', user.id)
      .single()
    
    defaultLocale = data?.preferred_language || 'en'
  } else {
    // Use browser language
    defaultLocale = request.headers.get('accept-language')?.startsWith('tr') 
      ? 'tr' 
      : 'en'
  }
  
  return createMiddleware({
    locales: ['en', 'tr'],
    defaultLocale
  })(request)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
```

#### Translation Files
```
/messages
  /en.json
  /tr.json
```

```json
// messages/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "dashboard": {
    "welcome": "Welcome back, {name}!",
    "noCVs": "You haven't created any CVs yet.",
    "createFirst": "Create your first CV to get started"
  },
  "cvBuilder": {
    "personalInfo": "Personal Information",
    "experience": "Work Experience",
    "addExperience": "Add Experience"
  }
}
```

#### Usage in Components
```typescript
import { useTranslations } from 'next-intl'

export default function Dashboard() {
  const t = useTranslations('dashboard')
  
  return (
    <h1>{t('welcome', { name: user.fullname })}</h1>
  )
}
```

---

## Development Environment

### Package Manager
**pnpm**
- **Why:** Faster than npm/yarn, disk space efficient, strict peer dependencies
- **Version:** 8.x or latest

### Code Quality

#### ESLint
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

#### Prettier
```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### Environment Variables
```bash
# .env.local (never commit!)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # Server-side only
GEMINI_API_KEY=AIxxx...
```

### Git Workflow
```
main          # Production (Vercel auto-deploys)
  ↑
develop       # Integration branch
  ↑
feature/*     # Feature branches
```

**Commit Convention:** Conventional Commits
```
feat: add CV template B
fix: resolve PDF export styling issue
docs: update README with setup instructions
refactor: extract form validation to utils
```

---

## Database Schema (Detailed)

### Core Tables

#### `resumes`
```sql
CREATE TABLE resumes (
  resume_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  embedding vector(1024),  -- Gemini embedding
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_primary_per_user 
    EXCLUDE (user_id WITH =) WHERE (is_primary = true)
)
```

#### `resume_personal_details`
```sql
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
)
```

#### `resume_experience`
```sql
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
  
  CHECK (end_date IS NULL OR end_date >= start_date)
)
```

#### `resume_education`
```sql
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
  gpa NUMERIC(3, 2),  -- e.g., 3.85
  honors TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

#### `resume_projects`
```sql
CREATE TABLE resume_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE,
  project_name VARCHAR(255) NOT NULL,
  description TEXT,
  technologies_used TEXT,  -- Comma-separated or JSON
  project_link VARCHAR(500),
  demo_url VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

#### `resume_certificates`
```sql
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

#### `resume_skills`
```sql
CREATE TABLE resume_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE,
  skill_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),  -- technical, soft, language, etc.
  proficiency_level VARCHAR(50),  -- beginner, intermediate, advanced, expert
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

#### `resume_languages`
```sql
CREATE TABLE resume_languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE,
  language_name VARCHAR(100) NOT NULL,
  proficiency VARCHAR(50) NOT NULL,  -- native, fluent, intermediate, basic
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

#### `resume_social_media`
```sql
CREATE TABLE resume_social_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE,
  platform_name VARCHAR(100) NOT NULL,  -- LinkedIn, GitHub, Portfolio, etc.
  url VARCHAR(500) NOT NULL,
  username VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

#### `resume_interests`
```sql
CREATE TABLE resume_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id UUID NOT NULL REFERENCES resumes(resume_id) ON DELETE CASCADE,
  interest_name VARCHAR(255) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

#### `jobs`
```sql
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
  embedding vector(1024),  -- Gemini embedding
  language VARCHAR(10) NOT NULL,  -- tr, en
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CHECK (max_salary IS NULL OR max_salary >= min_salary)
)
```

#### `users` (Custom User Data)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

### Indexes
```sql
-- Fast lookup for user's CVs
CREATE INDEX idx_resumes_user_id ON resumes(user_id);

-- Fast lookup for primary CV
CREATE INDEX idx_resumes_primary ON resumes(user_id, is_primary) 
WHERE is_primary = true;

-- Vector similarity search (already covered in pgvector section)
CREATE INDEX idx_resumes_embedding ON resumes 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX idx_jobs_embedding ON jobs 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Filter active jobs
CREATE INDEX idx_jobs_active_language ON jobs(is_active, language) 
WHERE is_active = true;
```

### Row-Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_personal_details ENABLE ROW LEVEL SECURITY;
-- (Enable for all resume_* tables)

-- Policy: Users can only see their own resumes
CREATE POLICY "Users can view own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes"
  ON resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Users can access resume sections of their own resumes
CREATE POLICY "Users can view own resume details"
  ON resume_personal_details FOR ALL
  USING (
    resume_id IN (
      SELECT resume_id FROM resumes WHERE user_id = auth.uid()
    )
  );

-- (Repeat for all resume_* tables)

-- Jobs table: Public read access
CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT
  USING (is_active = true);
```

---

## Deployment & Hosting

### Platform
**Vercel**
- **Why:**
  - Native Next.js support (same company)
  - Automatic deployments from Git
  - Edge functions for API routes
  - Free SSL certificates
  - Generous free tier
- **Configuration:**
  ```json
  // vercel.json
  {
    "framework": "nextjs",
    "buildCommand": "pnpm build",
    "installCommand": "pnpm install"
  }
  ```

### CI/CD Pipeline
```
Git Push (GitHub/GitLab)
   ↓
Vercel detects change
   ↓
Run build (pnpm build)
   ↓
Run type check (tsc --noEmit)
   ↓
Run linter (eslint)
   ↓
Deploy to preview URL (for PRs)
   OR
Deploy to production (for main branch)
   ↓
Automatic HTTPS setup
```

### Environment Variables (Production)
- Set in Vercel dashboard
- Separate for Preview and Production environments
- Never commit `.env` files

### Database Hosting
**Supabase Cloud**
- **Plan:** Free tier (500MB database, 1GB file storage, 50k monthly active users)
- **Backups:** Daily automatic backups (retained 7 days on free tier)
- **Connection:** Connection pooling enabled

### Domain
- **MVP:** Default Vercel domain (`project-name.vercel.app`)
- **Future:** Custom domain (e.g., `cvbuilder.com`)

---

## Performance Optimization

### Image Optimization
- **Next.js Image:** Use `next/image` for all images
- **Formats:** WebP with PNG/JPEG fallback
- **Lazy Loading:** Below-the-fold images lazy loaded

### Code Splitting
- **Automatic:** Next.js handles route-based code splitting
- **Manual:** Dynamic imports for heavy components
  ```typescript
  const CVTemplate = dynamic(() => import('@/components/CVTemplate'), {
    loading: () => <Skeleton />,
    ssr: false  // Template only needed client-side
  })
  ```

### Bundle Size
- **Target:** <200KB initial JS bundle
- **Tools:** `@next/bundle-analyzer` to track size
- **Optimization:**
  - Tree-shake unused shadcn components
  - Import only needed Gemini SDK modules

### Caching Strategy
- **Static Pages:** ISR (Incremental Static Regeneration) for marketing pages
- **API Routes:** Cache Gemini embeddings (same CV text = same embedding)
- **CDN:** Vercel Edge Network caches static assets

---

## Security Considerations

### Authentication
- **JWT Storage:** httpOnly cookies (handled by Supabase)
- **CSRF Protection:** SameSite cookies
- **Session Duration:** 7 days, auto-refresh

### API Security
- **Rate Limiting:** Vercel Edge Middleware limits requests per IP
- **Input Validation:** Zod schemas validate all user input
- **SQL Injection:** Parameterized queries (Supabase client)
- **XSS Prevention:** React auto-escapes, avoid `dangerouslySetInnerHTML`

### File Upload Security
- **Type Validation:** Only PDF files accepted
- **Size Limit:** 5MB enforced client and server-side
- **Virus Scanning:** (Post-MVP) Integrate ClamAV or similar

### Environment Variables
- **Client-Side:** Only `NEXT_PUBLIC_*` variables exposed
- **Server-Side:** API keys never sent to browser
- **Rotation:** Rotate Gemini API key quarterly

### HTTPS
- **Enforced:** Vercel provides automatic HTTPS
- **HSTS:** Strict-Transport-Security header enabled

---

## Monitoring & Logging

### Error Tracking (Post-MVP)
**Sentry**
- Track unhandled exceptions
- Monitor API route errors
- User feedback on errors

### Analytics (Post-MVP)
**Vercel Analytics**
- Page views, unique visitors
- Core Web Vitals (LCP, FID, CLS)

**Plausible / Umami (Alternative)**
- Privacy-friendly analytics
- GDPR compliant

### Logging
- **Development:** `console.log`
- **Production:** Vercel logs (real-time in dashboard)
- **Database:** Supabase logs (query performance)

---

## Testing Strategy (Post-MVP)

### Unit Tests
**Vitest**
- Test utility functions
- Test Zod schemas
- Test Zustand stores

### Integration Tests
**Playwright**
- E2E tests for critical flows:
  - User registration → CV creation → PDF download
  - CV upload → parsing → save
  - Dashboard → job matching

### Manual Testing
- **Cross-Browser:** Chrome, Firefox, Safari, Edge
- **Devices:** Desktop (1920x1080), Tablet (iPad), Mobile (iPhone 14)
- **Languages:** Test all UI in both TR and EN

---

## Third-Party Services Summary

| Service | Purpose | Plan | Cost (MVP) |
|---------|---------|------|------------|
| **Vercel** | Hosting, deployment | Hobby | Free |
| **Supabase** | Database, auth, storage | Free tier | Free |
| **Google Gemini** | AI (parsing, embeddings) | Pay-as-you-go | ~$5-20/month |
| **GitHub/GitLab** | Version control | Free | Free |
| **Cloudflare** (Optional) | DNS, CDN | Free tier | Free |

**Total Estimated Cost (MVP):** $5-20/month (primarily Gemini API usage)

---

## Dependencies (package.json)

### Core Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    
    "@supabase/supabase-js": "^2.38.0",
    "@google/generative-ai": "^0.1.0",
    
    "zustand": "^4.4.0",
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    
    "next-intl": "^3.0.0",
    
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-*": "^1.0.0",  // shadcn components
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    
    "react-to-print": "^2.14.0",
    "pdf-parse": "^1.1.1",
    
    "date-fns": "^2.30.0",  // Date formatting
    "nanoid": "^5.0.0"  // Unique IDs
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.50.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "@next/bundle-analyzer": "^14.0.0"
  }
}
```

---

## Development Workflow

### Initial Setup
```bash
# Clone repo
git clone <repo-url>
cd project-bitirme-nextjs

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run database migrations (Supabase)
pnpm supabase db push

# Start dev server
pnpm dev
```

### Daily Development
```bash
# Create feature branch
git checkout -b feature/cv-builder-form

# Make changes, test locally
pnpm dev

# Run linter
pnpm lint

# Commit changes
git add .
git commit -m "feat: add personal info section to CV builder"

# Push to remote
git push origin feature/cv-builder-form

# Create PR → Vercel auto-deploys preview
```

### Pre-Deployment Checklist
- [ ] All TypeScript errors resolved (`pnpm tsc`)
- [ ] ESLint passes (`pnpm lint`)
- [ ] Environment variables set in Vercel
- [ ] Database migrations applied to production Supabase
- [ ] Tested in both languages (TR/EN)
- [ ] Tested on mobile viewport
- [ ] PDF export works correctly

---

*Last Updated: November 15, 2025*
