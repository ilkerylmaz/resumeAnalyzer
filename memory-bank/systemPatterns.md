# System Patterns

## Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  CV Builder  │  │  Dashboard   │  │ Auth Pages   │      │
│  │  (Forms +    │  │  (Job Match) │  │              │      │
│  │   Preview)   │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ↓                  ↓                  ↓              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Zustand Store (Global State)              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ /api/cv/     │  │ /api/jobs/   │  │ /api/export/ │      │
│  │   parse      │  │   match      │  │   pdf        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
        ↓                    ↓                    ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Gemini API │    │   Supabase   │    │   Supabase   │
│              │    │  (pgvector)  │    │   Storage    │
│ - Parse CV   │    │              │    │              │
│ - Embeddings │    │ - Auth       │    │ - CV Uploads │
│ - ATS Score  │    │ - Database   │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## Key Design Patterns

### 1. Form State Management Pattern

**Problem:** CV builder has complex nested data (multiple experiences, skills, etc.) that needs to be synced between form and live preview.

**Solution:** Hybrid approach using React Hook Form + Zustand

```typescript
// Pattern: Form owns validation, Zustand owns global state

// 1. Define Zustand store
interface CVStore {
  currentCV: ResumeData | null
  updatePersonalInfo: (data: PersonalInfo) => void
  addExperience: (exp: Experience) => void
  removeExperience: (id: string) => void
  updateExperience: (id: string, data: Partial<Experience>) => void
  // ...
}

export const useCVStore = create<CVStore>((set) => ({
  currentCV: null,
  updatePersonalInfo: (data) => 
    set((state) => ({
      currentCV: { ...state.currentCV, personalInfo: data }
    })),
  // ...
}))

// 2. Form component uses React Hook Form for local state + validation
const PersonalInfoForm = () => {
  const updatePersonalInfo = useCVStore((s) => s.updatePersonalInfo)
  
  const { register, handleSubmit, formState: { errors } } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema)
  })
  
  const onSubmit = (data: PersonalInfo) => {
    updatePersonalInfo(data)  // Sync to Zustand
    // Auto-save to Supabase (debounced)
    debouncedSave(data)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('fullname')} />
      {errors.fullname && <span>{errors.fullname.message}</span>}
      {/* ... */}
    </form>
  )
}

// 3. Preview component reads from Zustand
const CVPreview = () => {
  const personalInfo = useCVStore((s) => s.currentCV?.personalInfo)
  
  return (
    <div>
      <h1>{personalInfo?.fullname}</h1>
      {/* Real-time update as form changes */}
    </div>
  )
}
```

**Why This Works:**
- ✅ React Hook Form handles complex validation logic
- ✅ Zustand provides single source of truth for preview
- ✅ No prop drilling needed
- ✅ Easy to persist to database (subscribe to Zustand changes)

---

### 2. Database Query Pattern (Supabase)

**Problem:** Need to fetch CV with all related sections (personal info, experiences, education, etc.) efficiently.

**Solution:** Use Supabase's relational query syntax with proper typing

```typescript
// Pattern: Single query with joins, TypeScript-safe

// 1. Define types (auto-generated from Supabase or manual)
interface Database {
  public: {
    Tables: {
      resumes: {
        Row: {
          resume_id: string
          user_id: string
          title: string
          is_primary: boolean
          embedding: number[]
          created_at: string
        }
      }
      resume_personal_details: {
        Row: {
          id: string
          resume_id: string
          fullname: string
          email: string
          // ...
        }
      }
      // ... other tables
    }
  }
}

// 2. Fetch pattern with select joins
const fetchFullCV = async (resumeId: string) => {
  const { data, error } = await supabase
    .from('resumes')
    .select(`
      *,
      resume_personal_details(*),
      resume_experience(*),
      resume_education(*),
      resume_skills(*),
      resume_projects(*),
      resume_certificates(*),
      resume_languages(*),
      resume_social_media(*),
      resume_interests(*)
    `)
    .eq('resume_id', resumeId)
    .order('display_order', { 
      foreignTable: 'resume_experience', 
      ascending: true 
    })
    .single()
  
  if (error) throw error
  return data
}

// 3. Transform to application model
const transformToResumeData = (dbData): ResumeData => ({
  id: dbData.resume_id,
  title: dbData.title,
  personalInfo: dbData.resume_personal_details[0],
  experience: dbData.resume_experience,
  education: dbData.resume_education,
  // ...
})
```

**Benefits:**
- ✅ Single database round-trip
- ✅ Type-safe with TypeScript
- ✅ Easy to maintain with Supabase's query builder

---

### 3. Embedding Generation Pattern

**Problem:** CV embeddings must be regenerated whenever CV content changes, but Gemini API calls are expensive.

**Solution:** Incremental embedding with change detection

```typescript
// Pattern: Only regenerate embedding when relevant fields change

interface EmbeddingRelevantData {
  summary: string
  experiences: string[]  // job descriptions
  skills: string[]
  education: string[]  // degrees + fields of study
}

const extractRelevantData = (cv: ResumeData): EmbeddingRelevantData => ({
  summary: cv.personalInfo.summary || '',
  experiences: cv.experience.map(e => 
    `${e.title} at ${e.companyName}: ${e.jobDescription || ''}`
  ),
  skills: cv.skills.map(s => s.skillName),
  education: cv.education.map(e => 
    `${e.degree} in ${e.fieldOfStudy || ''} at ${e.schoolName}`
  )
})

const generateCVText = (data: EmbeddingRelevantData): string => {
  return [
    `Summary: ${data.summary}`,
    `\nExperience:\n${data.experiences.join('\n')}`,
    `\nSkills: ${data.skills.join(', ')}`,
    `\nEducation:\n${data.education.join('\n')}`
  ].join('\n')
}

const shouldRegenerateEmbedding = (
  oldCV: ResumeData, 
  newCV: ResumeData
): boolean => {
  const oldText = generateCVText(extractRelevantData(oldCV))
  const newText = generateCVText(extractRelevantData(newCV))
  return oldText !== newText
}

const updateCVWithEmbedding = async (cv: ResumeData) => {
  // Check if embedding needs regeneration
  const existingCV = await fetchFullCV(cv.id)
  
  if (!shouldRegenerateEmbedding(existingCV, cv)) {
    // No change in relevant fields, skip embedding
    return
  }
  
  // Generate new embedding
  const cvText = generateCVText(extractRelevantData(cv))
  const embedding = await generateEmbedding(cvText)
  
  // Update database
  await supabase
    .from('resumes')
    .update({ embedding, updated_at: new Date().toISOString() })
    .eq('resume_id', cv.id)
}

const generateEmbedding = async (text: string): Promise<number[]> => {
  const result = await gemini.embedContent({
    content: { parts: [{ text }] },
    model: 'text-embedding-004'
  })
  
  return result.embedding.values
}
```

**Benefits:**
- ✅ Reduces unnecessary API calls (cost savings)
- ✅ Faster updates (skip embedding when only contact info changes)
- ✅ Still maintains accuracy (regenerates when content changes)

---

### 4. Job Matching Algorithm Pattern

**Problem:** Need to combine vector similarity with optional structured filters.

**Solution:** Two-phase query (filter → rank)

```typescript
// Pattern: SQL function for vector search + application-level filtering

// 1. Create Postgres function (run in Supabase SQL editor)
/*
CREATE OR REPLACE FUNCTION match_jobs(
  query_embedding vector(1024),
  user_language text,
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 20
)
RETURNS TABLE (
  job_id uuid,
  job_title text,
  company_name text,
  location text,
  job_description text,
  employment_type text,
  experience_level text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT 
    j.job_id,
    j.job_title,
    j.company_name,
    j.location,
    j.job_description,
    j.employment_type,
    j.experience_level,
    1 - (j.embedding <=> query_embedding) AS similarity
  FROM jobs j
  WHERE 
    j.is_active = true
    AND j.language = user_language
    AND 1 - (j.embedding <=> query_embedding) > match_threshold
  ORDER BY j.embedding <=> query_embedding
  LIMIT match_count;
$$;
*/

// 2. Call from API route
// app/api/jobs/match/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const resumeId = searchParams.get('resumeId')
  const language = searchParams.get('language') || 'en'
  
  // Get user's CV embedding
  const { data: resume } = await supabase
    .from('resumes')
    .select('embedding')
    .eq('resume_id', resumeId)
    .single()
  
  if (!resume?.embedding) {
    return Response.json({ error: 'CV has no embedding' }, { status: 400 })
  }
  
  // Call vector search function
  const { data: jobs, error } = await supabase
    .rpc('match_jobs', {
      query_embedding: resume.embedding,
      user_language: language,
      match_threshold: 0.5,  // Only show >50% matches
      match_count: 20
    })
  
  if (error) throw error
  
  // Transform similarity to percentage
  const jobsWithPercentage = jobs.map(job => ({
    ...job,
    matchPercentage: Math.round(job.similarity * 100)
  }))
  
  return Response.json({ jobs: jobsWithPercentage })
}

// 3. Optional: Post-MVP filtering (experience years, location)
const applyAdvancedFilters = (jobs, filters) => {
  return jobs.filter(job => {
    if (filters.minExperienceYears && 
        parseInt(job.experience_level) < filters.minExperienceYears) {
      return false
    }
    if (filters.location && !job.location.includes(filters.location)) {
      return false
    }
    return true
  })
}
```

**Why Postgres Function:**
- ✅ Offloads computation to database (faster)
- ✅ Atomic operation (vector search + filtering)
- ✅ Reusable across different clients

---

### 5. PDF Parsing Pattern

**Problem:** Extract structured data from unstructured PDF text using AI.

**Solution:** Structured prompt with JSON schema + error handling

```typescript
// Pattern: Define schema, prompt for conformance, validate output

// 1. Define Zod schema for validation
const parsedCVSchema = z.object({
  personalInfo: z.object({
    fullname: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    summary: z.string().optional()
  }),
  experience: z.array(z.object({
    title: z.string(),
    companyName: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().optional()
  })).optional(),
  education: z.array(z.object({
    degree: z.string(),
    schoolName: z.string(),
    fieldOfStudy: z.string().optional(),
    graduationYear: z.string().optional()
  })).optional(),
  skills: z.array(z.object({
    skillName: z.string(),
    category: z.string().optional()
  })).optional()
})

// 2. API route for parsing
// app/api/cv/parse/route.ts
export async function POST(request: Request) {
  const { filePath } = await request.json()
  
  // Download PDF from Supabase Storage
  const { data: fileBuffer } = await supabase.storage
    .from('cv-uploads')
    .download(filePath)
  
  // Extract text using pdf-parse
  const pdfData = await pdfParse(fileBuffer)
  const extractedText = pdfData.text
  
  // Construct Gemini prompt with JSON schema
  const prompt = `
You are a CV parsing assistant. Extract structured data from the following CV text.

IMPORTANT: Respond ONLY with valid JSON matching this schema:
{
  "personalInfo": {
    "fullname": "string (required)",
    "email": "string (optional)",
    "phone": "string (optional)",
    "location": "string (optional)",
    "summary": "string (optional, extract professional summary/objective)"
  },
  "experience": [
    {
      "title": "string (job title)",
      "companyName": "string",
      "startDate": "string (YYYY-MM format if possible)",
      "endDate": "string or null if current job",
      "description": "string (job responsibilities)"
    }
  ],
  "education": [
    {
      "degree": "string (e.g., Bachelor of Science)",
      "schoolName": "string",
      "fieldOfStudy": "string (e.g., Computer Science)",
      "graduationYear": "string (YYYY format)"
    }
  ],
  "skills": [
    {
      "skillName": "string",
      "category": "string (technical/soft/language)"
    }
  ]
}

CV Text:
${extractedText}
  `.trim()
  
  try {
    // Call Gemini
    const result = await gemini.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,  // Low temperature for consistent structured output
        topP: 0.8
      }
    })
    
    const responseText = result.response.text()
    
    // Extract JSON from response (Gemini sometimes wraps in markdown)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in Gemini response')
    }
    
    const parsedData = JSON.parse(jsonMatch[0])
    
    // Validate with Zod
    const validatedData = parsedCVSchema.parse(parsedData)
    
    return Response.json({ data: validatedData })
    
  } catch (error) {
    console.error('Parsing error:', error)
    return Response.json({ 
      error: 'Failed to parse CV. Please fill the form manually.',
      rawText: extractedText  // Fallback: let user copy/paste
    }, { status: 422 })
  }
}
```

**Error Handling Strategy:**
- ✅ If Gemini fails: Return raw text for manual entry
- ✅ If JSON invalid: Show error, allow retry
- ✅ If partial data: Pre-fill what worked, let user complete rest

---

### 6. Multi-Language Routing Pattern

**Problem:** Maintain clean URL structure while supporting dynamic locale switching.

**Solution:** Middleware-driven locale detection + path rewriting

```typescript
// Pattern: Middleware detects locale → rewrites URL → components use locale

// 1. Middleware (middleware.ts)
import { createMiddleware } from 'next-intl/server'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const intlMiddleware = createMiddleware({
  locales: ['en', 'tr'],
  defaultLocale: 'en'
})

export async function middleware(request: NextRequest) {
  // Check if URL already has locale
  const pathname = request.nextUrl.pathname
  const pathnameHasLocale = /^\/(en|tr)(\/|$)/.test(pathname)
  
  if (pathnameHasLocale) {
    // Locale already in URL, proceed
    return intlMiddleware(request)
  }
  
  // Determine locale
  let locale = 'en'
  
  // 1. Check if user is authenticated
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          cookie: request.headers.get('cookie') || ''
        }
      }
    }
  )
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    // Fetch user's preferred language
    const { data } = await supabase
      .from('users')
      .select('preferred_language')
      .eq('id', user.id)
      .single()
    
    locale = data?.preferred_language || 'en'
  } else {
    // Use browser language
    const acceptLanguage = request.headers.get('accept-language')
    locale = acceptLanguage?.startsWith('tr') ? 'tr' : 'en'
  }
  
  // Redirect to localized URL
  const newUrl = new URL(`/${locale}${pathname}`, request.url)
  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}

// 2. Layout with locale provider
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'tr' }]
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  let messages
  try {
    messages = (await import(`@/messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }
  
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

// 3. Language switcher component
const LanguageSwitcher = () => {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  
  const switchLocale = (newLocale: string) => {
    // Replace locale in current path
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`)
    router.push(newPath)
    
    // Update user preference in database (if authenticated)
    updateUserLanguage(newLocale)
  }
  
  return (
    <div>
      <button onClick={() => switchLocale('en')}>EN</button>
      <button onClick={() => switchLocale('tr')}>TR</button>
    </div>
  )
}
```

**Benefits:**
- ✅ SEO-friendly URLs (`/en/dashboard`, `/tr/dashboard`)
- ✅ User preference persisted across sessions
- ✅ Automatic locale detection for new users
- ✅ Easy to add new languages (just add `/messages/de.json`)

---

### 7. Template System Pattern

**Problem:** Support multiple CV templates with different layouts, but maintain single data source.

**Solution:** Component composition with template-specific styling

```typescript
// Pattern: Shared data interface, template-specific presentation

// 1. Define data interface (shared by all templates)
interface CVTemplateProps {
  data: ResumeData
  className?: string
}

// 2. Template A (Modern, two-column)
const TemplateA: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-[300px_1fr] gap-8 p-8 bg-white">
      {/* Left column: Personal info, contact, skills */}
      <aside className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{data.personalInfo.fullname}</h1>
          <p className="text-sm text-gray-600">{data.personalInfo.email}</p>
        </div>
        
        <section>
          <h2 className="text-lg font-semibold mb-2 text-blue-600">Skills</h2>
          <ul className="space-y-1">
            {data.skills.map(skill => (
              <li key={skill.id} className="text-sm">{skill.skillName}</li>
            ))}
          </ul>
        </section>
      </aside>
      
      {/* Right column: Experience, education */}
      <main className="space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-4 border-b-2 border-blue-600">
            Experience
          </h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-4">
              <h3 className="font-semibold">{exp.title}</h3>
              <p className="text-sm text-gray-600">{exp.companyName}</p>
              <p className="text-sm mt-1">{exp.jobDescription}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

// 3. Template B (Classic, single-column)
const TemplateB: React.FC<CVTemplateProps> = ({ data }) => {
  return (
    <div className="max-w-[800px] mx-auto p-12 bg-white">
      {/* Header: Centered name */}
      <header className="text-center mb-8 border-b-4 border-gray-800 pb-4">
        <h1 className="text-4xl font-bold">{data.personalInfo.fullname}</h1>
        <p className="text-gray-600 mt-2">{data.personalInfo.email}</p>
      </header>
      
      {/* Single column layout */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3 uppercase">Experience</h2>
        {/* ... similar structure ... */}
      </section>
    </div>
  )
}

// 4. Template registry (easy to add new templates)
const TEMPLATES = {
  'template-a': TemplateA,
  'template-b': TemplateB,
  // Future: 'template-c': TemplateC
} as const

type TemplateId = keyof typeof TEMPLATES

// 5. Template selector in CV builder
const CVPreview = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('template-a')
  const cvData = useCVStore(s => s.currentCV)
  
  const TemplateComponent = TEMPLATES[selectedTemplate]
  
  return (
    <div>
      <div className="mb-4">
        <label>Choose Template:</label>
        <select onChange={(e) => setSelectedTemplate(e.target.value as TemplateId)}>
          <option value="template-a">Modern (Two-Column)</option>
          <option value="template-b">Classic (Single-Column)</option>
        </select>
      </div>
      
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <TemplateComponent data={cvData} />
      </div>
    </div>
  )
}
```

**Scalability:**
- ✅ Adding new template = create component + add to registry
- ✅ All templates consume same data (no duplication)
- ✅ Template switching instant (no re-fetch)
- ✅ PDF export works for any template (react-to-print wraps component)

---

### 8. Auto-Save Pattern

**Problem:** Users shouldn't lose work if they close the browser accidentally.

**Solution:** Debounced auto-save with optimistic UI updates

```typescript
// Pattern: Local state updates immediately, database sync delayed

// 1. Debounced save hook
import { useDebounce } from '@/hooks/useDebounce'

const useAutoSave = (data: ResumeData, resumeId: string) => {
  const debouncedData = useDebounce(data, 2000)  // Wait 2s after last change
  
  useEffect(() => {
    if (!debouncedData) return
    
    const save = async () => {
      try {
        await supabase
          .from('resumes')
          .update({ updated_at: new Date().toISOString() })
          .eq('resume_id', resumeId)
        
        // Save each section
        await Promise.all([
          savePersonalInfo(debouncedData.personalInfo),
          saveExperiences(debouncedData.experience),
          saveEducation(debouncedData.education),
          // ...
        ])
        
        toast.success('Saved')
      } catch (error) {
        toast.error('Failed to save. Your work is cached locally.')
      }
    }
    
    save()
  }, [debouncedData, resumeId])
}

// 2. Use in CV builder
const CVBuilder = () => {
  const cvData = useCVStore(s => s.currentCV)
  const resumeId = cvData.id
  
  useAutoSave(cvData, resumeId)
  
  return (
    <div>
      {/* Forms update Zustand immediately (instant UI feedback) */}
      {/* useAutoSave syncs to DB after 2s of no changes */}
    </div>
  )
}

// 3. Offline persistence (bonus)
const persistCVToLocalStorage = (cv: ResumeData) => {
  localStorage.setItem(`cv-draft-${cv.id}`, JSON.stringify(cv))
}

const recoverCVFromLocalStorage = (cvId: string): ResumeData | null => {
  const saved = localStorage.getItem(`cv-draft-${cvId}`)
  return saved ? JSON.parse(saved) : null
}
```

**User Experience:**
- ✅ No manual "Save" button needed (but optional "Save Now" for peace of mind)
- ✅ Typing feels instant (no lag from network calls)
- ✅ Safe against accidental tab close
- ✅ Toast notifications confirm save status

---

## Component Architecture

### File Structure
```
app/
├── [locale]/
│   ├── layout.tsx              # Root layout with i18n
│   ├── page.tsx                # Home/landing page
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard (CV list + job matches)
│   ├── cv/
│   │   ├── create/
│   │   │   └── page.tsx        # CV builder
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx    # Edit existing CV
│   └── auth/
│       ├── login/
│       │   └── page.tsx
│       └── signup/
│           └── page.tsx
├── api/
│   ├── cv/
│   │   ├── parse/
│   │   │   └── route.ts        # PDF parsing
│   │   └── embed/
│   │       └── route.ts        # Generate embeddings
│   ├── jobs/
│   │   └── match/
│   │       └── route.ts        # Job matching
│   └── export/
│       └── pdf/
│           └── route.ts        # PDF export (optional server-side)

components/
├── cv/
│   ├── forms/
│   │   ├── PersonalInfoForm.tsx
│   │   ├── ExperienceForm.tsx
│   │   ├── EducationForm.tsx
│   │   └── SkillsForm.tsx
│   ├── templates/
│   │   ├── TemplateA.tsx
│   │   ├── TemplateB.tsx
│   │   └── TemplateRegistry.ts
│   ├── CVPreview.tsx           # Live preview wrapper
│   └── CVBuilder.tsx           # Main builder orchestrator
├── dashboard/
│   ├── CVCard.tsx              # Single CV card in list
│   ├── JobCard.tsx             # Single job card
│   └── JobMatchList.tsx        # List of matched jobs
├── ui/                         # shadcn components
│   ├── button.tsx
│   ├── input.tsx
│   ├── form.tsx
│   └── ...
└── shared/
    ├── Header.tsx
    ├── Footer.tsx
    └── LanguageSwitcher.tsx

lib/
├── supabase/
│   ├── client.ts               # Client-side Supabase instance
│   ├── server.ts               # Server-side Supabase instance
│   └── types.ts                # Database types
├── gemini/
│   ├── client.ts               # Gemini API wrapper
│   ├── embeddings.ts           # Embedding generation
│   └── parsing.ts              # CV parsing logic
├── utils/
│   ├── cn.ts                   # Tailwind class merge utility
│   ├── date.ts                 # Date formatting
│   └── validation.ts           # Zod schemas
└── stores/
    ├── cvStore.ts              # Zustand CV state
    └── userStore.ts            # Zustand user preferences

hooks/
├── useAutoSave.ts
├── useDebounce.ts
└── useCVData.ts

messages/
├── en.json
└── tr.json
```

---

## Critical Implementation Paths

### Path 1: User Creates First CV (Happy Path)
```
1. User signs up → Supabase Auth creates auth.users entry
2. Middleware creates users table entry with preferred_language
3. User redirected to /[locale]/dashboard (empty state)
4. User clicks "Create CV" → Navigate to /[locale]/cv/create
5. Backend creates empty resume record in database
6. CV builder loads with empty form + Zustand initialized
7. User fills personal info → React Hook Form validates → Zustand updates → Preview updates
8. User fills experience → Same validation/state flow
9. useAutoSave hook debounces and saves to Supabase every 2s
10. User clicks "Download PDF" → react-to-print generates PDF from preview component
11. PDF downloads → User redirected to dashboard
12. Backend triggers embedding generation for saved CV
13. Dashboard loads, runs job matching query
14. Matched jobs displayed with % scores
```

### Path 2: User Uploads Existing CV
```
1. User on dashboard, clicks "Upload CV"
2. File input opens, user selects PDF (max 5MB validated client-side)
3. PDF uploaded to Supabase Storage (bucket: cv-uploads)
4. API route /api/cv/parse triggered with file path
5. Server downloads PDF from storage
6. pdf-parse extracts raw text
7. Text sent to Gemini with structured prompt
8. Gemini returns JSON with extracted data
9. JSON validated with Zod schema
10. Frontend receives parsed data, navigates to /cv/create with pre-filled form
11. User reviews/edits parsed data
12. Saves → Same flow as Path 1 from step 9 onwards
```

### Path 3: Job Matching
```
1. User on dashboard with ≥1 saved CV
2. If multiple CVs, user selects "primary" CV (or defaults to most recent)
3. Frontend calls GET /api/jobs/match?resumeId=xxx&language=en
4. Backend fetches resume.embedding from database
5. Calls Postgres function match_jobs(embedding, language, 0.5, 20)
6. pgvector performs cosine similarity search
7. Returns 20 jobs sorted by similarity
8. Backend transforms similarity (0-1) to percentage (0-100)
9. Frontend displays jobs as cards with match %
10. User clicks job card → Modal/page with full job description
11. User clicks "Apply" → External link to job poster's website (MVP)
```

---

## Data Flow Diagrams

### CV Creation Flow
```
┌─────────────┐
│   User      │
│  (Browser)  │
└──────┬──────┘
       │ 1. Fill form
       ↓
┌──────────────────┐
│  React Hook Form │ ← Validates input
└──────┬───────────┘
       │ 2. onBlur/onChange
       ↓
┌──────────────────┐
│  Zustand Store   │ ← Global state
└──────┬───────────┘
       │ 3. State change
       ├──────────────────┐
       ↓                  ↓
┌──────────────┐   ┌──────────────┐
│  CV Preview  │   │  Auto-Save   │
│  Component   │   │  Hook        │
└──────────────┘   └──────┬───────┘
                          │ 4. Debounced save (2s)
                          ↓
                   ┌──────────────┐
                   │   Supabase   │
                   │   Database   │
                   └──────────────┘
```

### Job Matching Flow
```
┌─────────────┐
│  Dashboard  │
│   Page      │
└──────┬──────┘
       │ 1. Load effect
       ↓
┌──────────────────┐
│ GET /api/jobs/   │
│   match          │
└──────┬───────────┘
       │ 2. Fetch user's CV embedding
       ↓
┌──────────────────┐
│   Supabase       │
│ (resumes table)  │
└──────┬───────────┘
       │ 3. Return embedding vector
       ↓
┌──────────────────┐
│ RPC: match_jobs()│ ← Postgres function
└──────┬───────────┘
       │ 4. pgvector cosine search
       ↓
┌──────────────────┐
│   Supabase       │
│  (jobs table)    │
└──────┬───────────┘
       │ 5. Return top 20 jobs
       ↓
┌──────────────────┐
│  API Route       │ ← Transform to %
└──────┬───────────┘
       │ 6. JSON response
       ↓
┌──────────────────┐
│  Dashboard       │ ← Display job cards
│  (Frontend)      │
└──────────────────┘
```

---

## Error Handling Strategies

### 1. Network Errors (API Calls)
```typescript
// Pattern: Try-catch with user-friendly messages + retry option

const fetchJobs = async () => {
  try {
    const response = await fetch('/api/jobs/match?resumeId=xxx')
    if (!response.ok) throw new Error('Failed to fetch')
    return await response.json()
  } catch (error) {
    toast.error('Could not load jobs. Check your connection.')
    // Log to error tracking (Sentry in production)
    console.error(error)
    return { jobs: [] }  // Graceful degradation
  }
}
```

### 2. Form Validation Errors
```typescript
// Pattern: React Hook Form displays inline errors

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  fullname: z.string().min(2, 'Name must be at least 2 characters')
})

// Component shows errors automatically
{errors.email && <span className="text-red-500">{errors.email.message}</span>}
```

### 3. AI Parsing Failures
```typescript
// Pattern: Fallback to manual entry + preserve raw text

if (geminiParsingFails) {
  return {
    status: 'partial_success',
    data: { /* what we could extract */ },
    rawText: extractedPDFText,
    message: 'Some fields could not be extracted. Please review and fill manually.'
  }
}
```

### 4. Database Constraint Violations
```typescript
// Example: User tries to set 2 CVs as primary
// Constraint: EXCLUDE (user_id WITH =) WHERE (is_primary = true)

catch (error) {
  if (error.code === '23505') {  // Unique violation
    toast.error('You already have a primary CV. Unmark the other one first.')
  }
}
```

---

## Performance Optimization Patterns

### 1. Debouncing
```typescript
// Auto-save, search inputs
const debouncedSearch = useDebounce(searchTerm, 500)
```

### 2. Lazy Loading
```typescript
// Heavy components (CV templates)
const TemplateA = dynamic(() => import('./TemplateA'), { ssr: false })
```

### 3. Memoization
```typescript
// Expensive calculations (CV text generation for embedding)
const cvText = useMemo(() => 
  generateCVText(cvData), 
  [cvData.summary, cvData.experience, cvData.skills]
)
```

### 4. Pagination (Post-MVP)
```typescript
// Job list pagination
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: ['jobs'],
  queryFn: ({ pageParam = 0 }) => fetchJobs(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor
})
```

---

*Last Updated: November 15, 2025*
