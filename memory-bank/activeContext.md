# Active Context

## Current Focus
**Project Foundation Complete** - Next.js project initialized with all core dependencies. Ready to implement Supabase integration and authentication.

---

## Recent Changes
- ✅ Created Memory Bank directory structure (`/memory-bank`)
- ✅ Completed `projectbrief.md` - Comprehensive project scope and requirements
- ✅ Completed `productContext.md` - User problems, solutions, and product vision
- ✅ Completed `techContext.md` - Full technology stack and implementation details
- ✅ Completed `systemPatterns.md` - Architecture patterns and design decisions
- ✅ Established database schema (11 tables total)
- ✅ Defined AI integration strategy (Gemini API for parsing, embeddings, ATS scoring)
- ✅ Confirmed multi-language support architecture (next-intl with path-based routing)
- ✅ Confirmed backend architecture (Next.js API Routes with serverless functions)
- ✅ **Initialized Next.js project** (v16.0.3 with App Router)
- ✅ **Installed all core dependencies** (Supabase, Gemini, Zustand, next-intl, etc.)
- ✅ **Setup Tailwind CSS** with custom configuration
- ✅ **Created project structure** (app, components, lib, stores, hooks, messages)
- ✅ **Configured i18n** (next-intl with EN/TR translations)
- ✅ **Created initial pages** (root layout, home page)
- ✅ **Development server running** (localhost:3000)

---

## Next Immediate Steps

### Phase 1: Project Setup (Week 1)
1. **Initialize Next.js Project**
   ```bash
   pnpx create-next-app@latest project-bitirme-nextjs --typescript --tailwind --app
   cd project-bitirme-nextjs
   pnpm install
   ```
   - Select: App Router ✓, TypeScript ✓, Tailwind CSS ✓, ESLint ✓
   - Skip: src/ directory (use app/ directly)

2. **Install Core Dependencies**
   ```bash
   pnpm add @supabase/supabase-js @google/generative-ai zustand react-hook-form @hookform/resolvers zod next-intl
   pnpm add -D @types/node
   ```

3. **Setup Supabase Project**
   - Create project at supabase.com
   - Note down:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Enable pgvector extension in SQL editor:
     ```sql
     CREATE EXTENSION IF NOT EXISTS vector;
     ```

4. **Setup Gemini API**
   - Get API key from ai.google.dev
   - Note down: `GEMINI_API_KEY`

5. **Create `.env.local`**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   GEMINI_API_KEY=AIza...
   ```

6. **Setup shadcn/ui**
   ```bash
   pnpm dlx shadcn-ui@latest init
   ```
   - Choose: New York style, Zinc color, CSS variables ✓

7. **Create Database Schema**
   - Run SQL migration in Supabase SQL Editor (see `techContext.md` for full schema)
   - Tables to create:
     - `users` (custom user data)
     - `resumes` (with vector embedding column)
     - `resume_personal_details`
     - `resume_experience`
     - `resume_education`
     - `resume_projects`
     - `resume_certificates`
     - `resume_skills`
     - `resume_languages`
     - `resume_social_media`
     - `resume_interests`
     - `jobs` (with vector embedding column)
   - Enable RLS policies
   - Create indexes (including pgvector indexes)

8. **Setup Project Structure**
   ```
   app/
     [locale]/
       layout.tsx
       page.tsx
   components/
     ui/
   lib/
     supabase/
     gemini/
     utils/
   stores/
   hooks/
   messages/
     en.json
     tr.json
   ```

---

## Active Decisions & Considerations

### Confirmed Decisions
✅ **Framework:** Next.js 14+ with App Router  
✅ **Backend:** Next.js API Routes (serverless functions on Vercel)  
✅ **Language:** TypeScript (strict mode)  
✅ **Styling:** Tailwind CSS + shadcn/ui  
✅ **Database:** Supabase (PostgreSQL + pgvector)  
✅ **Auth:** Supabase Auth (email/password)  
✅ **AI Provider:** Google Gemini (`gemini-pro`, `text-embedding-004`)  
✅ **State Management:** Zustand (global) + React Hook Form (forms)  
✅ **i18n:** next-intl with path-based routing (`/en`, `/tr`)  
✅ **Deployment:** Vercel (serverless)  
✅ **Package Manager:** pnpm  
✅ **PDF Export:** react-to-print (MVP), docx.js (post-MVP for DOCX)  
✅ **PDF Parsing:** pdf-parse + Gemini structured extraction  
✅ **File Storage:** Supabase Storage (max 5MB PDFs)  

### Deferred to Post-MVP
⏳ **ATS Score Analysis:** Gemini analyzes CV and provides score/suggestions  
⏳ **DOCX Export:** Server-side generation with docx.js  
⏳ **Advanced Job Filters:** Location, experience level, salary range  
⏳ **User Settings Page:** Profile management  
⏳ **Rate Limiting:** Usage quotas for free users  
⏳ **Error Tracking:** Sentry integration  
⏳ **Analytics:** Vercel Analytics or Plausible  

### Open Questions (To Be Decided During Implementation)
❓ **Dark Mode:** Should we add dark mode support in MVP? (Low priority, likely post-MVP)  
❓ **Email Notifications:** When new matching jobs appear? (Post-MVP)  
❓ **CV Sharing:** Generate public link to CV for sharing with recruiters? (Post-MVP)  
❓ **Application Tracking:** Track which jobs user applied to? (Post-MVP)  

---

## Important Patterns & Preferences

### Code Style
- **Component Naming:** PascalCase for components, camelCase for utilities
- **File Naming:** PascalCase for components (`CVBuilder.tsx`), lowercase for utilities (`date.ts`)
- **Import Order:** React → Next.js → Third-party → Local (enforced by ESLint)
- **Tailwind Classes:** Use `cn()` utility for conditional classes
- **Comments:** Prefer self-documenting code, add comments for complex logic only

### Database Patterns
- **UUIDs:** All primary keys use UUID (generated by Postgres)
- **Timestamps:** `created_at`, `updated_at` on all major tables
- **Soft Deletes:** Not implemented (hard delete for MVP simplicity)
- **Cascading Deletes:** All foreign keys use `ON DELETE CASCADE`
- **RLS:** Enabled on all user-facing tables

### API Route Patterns
- **Error Handling:** Always try-catch, return JSON with error message
- **Status Codes:** 200 (success), 400 (bad request), 401 (unauthorized), 500 (server error)
- **Response Format:** `{ data: {...} }` or `{ error: "message" }`
- **Authentication:** Check `auth.uid()` in Supabase queries (RLS handles this)

### State Management Philosophy
- **Zustand:** For global app state (current CV, user preferences)
- **React Hook Form:** For form-specific state (validation, errors)
- **Server State:** Fetch fresh from Supabase, don't cache in Zustand (use React Query post-MVP if needed)
- **Local Storage:** Only for draft recovery (auto-save fallback)

### Component Composition
- **Atomic Design:** ui/ (atoms), components/ (molecules/organisms)
- **Server vs Client:** Default to Server Components, add `'use client'` only when needed
- **Props:** Prefer explicit props over `...rest` spreading
- **Children:** Use `children` prop for layout components, explicit props for data components

---

## Learnings & Project Insights

### Database Design Insights
- **Embedding Storage:** Store embeddings at resume level (not individual sections) for efficient matching
- **Display Order:** All multi-entry sections (experience, education) need `display_order` for user-controlled sorting
- **Primary CV Constraint:** Use Postgres EXCLUDE constraint to ensure only one CV is primary per user
- **Vector Indexes:** pgvector's ivfflat indexes dramatically speed up similarity search (100+ lists for >10k jobs)

### AI Integration Insights
- **Gemini Embeddings:** 1024 dimensions (text-embedding-004) - ensure pgvector column matches
- **Parsing Accuracy:** Gemini's structured output requires explicit JSON schema in prompt
- **Cost Management:** Cache embeddings, only regenerate when CV content changes (not on contact info edits)
- **Error Handling:** Always provide fallback when AI parsing fails (raw text for manual entry)

### UX Insights
- **Real-Time Preview:** Critical for user confidence - users want to see CV as they build it
- **Auto-Save:** Users expect modern apps to save automatically, not require manual save button
- **Match Scores:** Displaying similarity as percentage (0-100%) more intuitive than raw cosine distance (0-1)
- **Template Switching:** Must preserve data when switching templates (data ≠ presentation)

### Performance Insights
- **Debouncing:** 2 seconds for auto-save feels natural (not too frequent, not too slow)
- **Vector Search:** pgvector with cosine distance (<=> operator) is fast enough for 1000s of jobs
- **PDF Generation:** Client-side react-to-print faster than server-side rendering for MVP
- **Image Optimization:** next/image handles optimization, always use it over `<img>`

### i18n Insights
- **Path-Based Routing:** `/en` and `/tr` better for SEO than cookies/headers
- **Middleware Logic:** Check user preference first, fall back to browser language
- **Translation Keys:** Nest by feature (`dashboard.welcome`, not flat `dashboardWelcome`)
- **Dynamic Content:** CV text itself is user-created (not translated), only UI is translated

---

## Current Risks & Mitigation

### Risk: Time Pressure (Deadline Jan 15, 2026)
**Status:** HIGH  
**Mitigation:**
- Ruthlessly prioritize MVP features only
- Use shadcn/ui to avoid building components from scratch
- Defer all "nice-to-have" features to post-MVP
- Build vertically (one feature end-to-end) rather than horizontally (all backends, then all frontends)

### Risk: Gemini API Costs
**Status:** MEDIUM  
**Mitigation:**
- Implement caching for embeddings (same text = cache hit)
- Rate limit parsing (prevent spam uploads)
- Use free tier during development, monitor usage
- Estimated cost: $5-20/month for MVP (acceptable)

### Risk: Vector Search Quality
**Status:** MEDIUM  
**Mitigation:**
- Test matching early with real job data
- Adjust embedding text composition if results poor (e.g., weight skills more than summary)
- Fallback: Combine with keyword search if semantic alone insufficient

### Risk: CV Parsing Accuracy
**Status:** LOW  
**Mitigation:**
- Always show parsed data in editable form (user review required)
- Provide raw text as fallback if parsing fails
- Acceptable if 80% accurate - user will fix the rest

---

## Development Priorities (Next 2 Weeks)

### Week 1: Foundation
**Goal:** Working authentication + basic database + empty CV builder page

**Tasks:**
1. ✅ Complete Memory Bank documentation (DONE)
2. ⬜ Initialize Next.js project with TypeScript + Tailwind
3. ⬜ Setup Supabase project + enable pgvector
4. ⬜ Run database schema migration
5. ⬜ Implement Supabase Auth (signup, login, logout)
6. ⬜ Create basic routing structure (`/[locale]/dashboard`, `/[locale]/cv/create`)
7. ⬜ Setup next-intl with EN/TR translations
8. ⬜ Create protected route middleware (redirect to login if not authenticated)

**Success Criteria:**
- User can register, login, see dashboard (empty state)
- Language switcher works (EN ↔ TR)
- Database tables created with proper constraints

### Week 2: CV Builder Core
**Goal:** Users can create CV via form, see live preview, save to database

**Tasks:**
1. ⬜ Install shadcn/ui components (Button, Input, Form, Card, Tabs)
2. ⬜ Create Zustand store for CV state
3. ⬜ Build PersonalInfoForm component (React Hook Form + Zod)
4. ⬜ Build ExperienceForm component (multiple entries, add/remove)
5. ⬜ Build EducationForm component
6. ⬜ Build SkillsForm component
7. ⬜ Create TemplateA component (modern two-column design)
8. ⬜ Create CVPreview component (live updates from Zustand)
9. ⬜ Implement auto-save hook (debounced Supabase writes)
10. ⬜ Wire up form → Zustand → Database pipeline

**Success Criteria:**
- User can fill out CV form, see preview update in real-time
- CV saved to database automatically
- Form validates inputs (email format, required fields)

---

## Context for Next Session

When resuming work:
1. **Check `progress.md`** for what's been completed
2. **Review this file** for current focus and decisions
3. **Reference `systemPatterns.md`** for implementation patterns
4. **Check `techContext.md`** for specific technology usage

If starting implementation:
- Begin with Week 1 tasks (project setup)
- Follow database schema exactly as defined in `techContext.md`
- Use patterns from `systemPatterns.md` (don't reinvent)
- All features must work in both EN and TR from day one

---

## Quick Reference Links

### Documentation
- Next.js App Router: https://nextjs.org/docs/app
- Supabase Docs: https://supabase.com/docs
- pgvector Docs: https://github.com/pgvector/pgvector
- Gemini API: https://ai.google.dev/docs
- next-intl: https://next-intl-docs.vercel.app
- shadcn/ui: https://ui.shadcn.com

### Design Inspiration
- CV Builder UX: https://app.owlapply.com/resume-builder
- (Study their form flow, preview layout, template switcher)

### Tools
- Supabase Dashboard: https://app.supabase.com
- Vercel Dashboard: https://vercel.com/dashboard
- Gemini AI Studio: https://aistudio.google.com

---

*Last Updated: November 15, 2025*  
*Next Update: After Week 1 completion or when major decisions made*
