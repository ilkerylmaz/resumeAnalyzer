# Active Context

## Current Focus
**Phase 5: CV Builder Development (40% Complete)** - Professional 4-column layout implemented with Personal Info and Experience forms working. Real-time preview + auto-save infrastructure ready. Now building remaining 7 form sections.

---

## Recent Changes
- ✅ **Phase 5 Started** - CV Builder core infrastructure
  - Zustand CV store with 9 sections + persist middleware
  - Zod validation schemas for all CV sections
  - PersonalInfoForm complete (real-time preview, debounced auto-save)
  - ExperienceForm complete (multi-entry, add/edit/delete)
  - CV Preview component (A4 paper design, 90% scale)
- ✅ **XHTML Design Integration** - Professional 4-column layout
  - Left sidebar (w-16): Logo + Edit/ATS nav with Material icons
  - Form panel (w-80): Horizontal tabs, fixed height, custom scrollbar
  - Preview panel (flex-1): Dominant, toolbar, ATS score indicator
  - Right sidebar (w-56): Download, Save, AI actions
  - Space Grotesk font, primary #2b7cee, pop-secondary #E040FB
  - Global navbar restored above builder
- ✅ **Layout Refinements**
  - Re-balanced column widths (preview dominant)
  - Thin custom scrollbar (6px, almost invisible until hover)
  - Preview toolbar redesigned (single slim row)
  - Form panel internally scrollable (fixed h-screen)
  - Preview content scaled down for document view
- ✅ **User Feedback:** "tasarim cok guzel oldu. bu tasarimi sevdik" ✨
- ✅ **Phase 2 Completed** - Full authentication flow working
  - Supabase client instances (browser + server)
  - Signup, login, verify-email, callback, signout pages
  - Protected route middleware integrated with i18n
  - Fixed signout route (404 → 200)
  - Dashboard page with auth check
- ✅ **Phase 3 Completed** - Multi-language fully functional
  - next-intl configured with EN/TR
  - All auth pages translated
  - Language switcher in navbar
  - Locale routing working (/en, /tr)
- ✅ **Stitch Design Integration**
  - Professional landing page with hero, features, timeline, testimonials
  - Custom Tailwind colors (#0A3D62 primary)
  - Inter font integration
  - Modern navbar with AI CV Pro branding
- ✅ **Bug Fixes**
  - Tailwind 4.x → 3.x downgrade for Turbopack compatibility
  - Async params pattern for Next.js 16
  - Refresh token error filtering
  - Signout route 404 fix
- ✅ **Created project structure** (app, components, lib, stores, hooks, messages)
- ✅ **Configured i18n** (next-intl with EN/TR translations)
- ✅ **Created initial pages** (root layout, home page)
- ✅ **Development server running** (localhost:3000)

---

## Next Immediate Steps

### Phase 5: CV Builder Forms (Week 3-4) - Continuing
**Current Status:** 40% Complete - Personal Info ✅, Experience ✅, Need 7 more forms

**Next Priority Tasks:**
1. **Build Summary Form**
   - Simple textarea for professional summary
   - Character counter (500 max)
   - Real-time preview update
   - Pattern: Similar to PersonalInfoForm (single section, no multi-entry)

2. **Build Education Form**
   - Multi-entry like ExperienceForm
   - Fields: institution, degree, field, dates, current checkbox, GPA
   - Add/edit/delete functionality
   - Card-based display when not editing

3. **Build Skills Form**
   - Multi-entry with add/remove
   - Fields: skill name, category, proficiency level (dropdown)
   - Display as badges in preview
   - Simple list view when not adding

4. **Build Projects Form**
   - Multi-entry like Experience
   - Fields: name, description, technologies (array), dates, URLs
   - Technologies as tag input
   - Current project checkbox

5. **Build Languages Form**
   - Multi-entry, simpler than others
   - Fields: language name, proficiency (dropdown: elementary/limited/professional/native)
   - Display as simple list

6. **Build Certificates, Social Media, Interests Forms**
   - Follow same patterns as above
   - Certificates: name, issuer, dates, credential ID, URL
   - Social Media: platform, URL
   - Interests: just name (simplest)

**Implementation Pattern (for all remaining forms):**
```typescript
// 1. Use existing Zod schemas from lib/schemas/cv-schemas.ts
// 2. Follow ExperienceForm pattern for multi-entry
// 3. Follow PersonalInfoForm pattern for single-entry
// 4. Use react-hook-form + zodResolver
// 5. Update Zustand store on form changes
// 6. No padding/title in form (handled by parent CVBuilder)
// 7. Match XHTML design (form-input classes, rounded, border-[#dbe0e6])
```

**Success Criteria for Phase 5:**
- All 9 form sections working
- Real-time preview updates for all sections
- Form validation with inline errors
- Tab navigation between sections
- Auto-save triggers on all form changes
- Preview shows all CV sections correctly

---

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

### Active Decisions & Considerations

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
✅ **Package Manager:** npm  
✅ **PDF Export:** react-to-print (MVP), docx.js (post-MVP for DOCX)  
✅ **PDF Parsing:** pdf-parse + Gemini structured extraction  
✅ **File Storage:** Supabase Storage (max 5MB PDFs)  
✅ **CV Builder Design:** 4-column professional layout (XHTML-inspired)  
✅ **Form Library:** react-hook-form 7.66.0 + @hookform/resolvers  
✅ **Validation:** Zod 4.1.12 schemas  
✅ **ID Generation:** nanoid for multi-entry items  
✅ **Icons:** Material Symbols Outlined (Google)  
✅ **Fonts:** Space Grotesk (primary), Inter, Poppins (fallbacks)  
✅ **Colors:** Primary #2b7cee, Pop-secondary #E040FB, Accent-teal #14b8a6  
✅ **Preview Scale:** 90% CSS transform for document view  
✅ **Auto-Save:** 300ms debounce on form changes

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

### CV Builder Design Insights (Phase 5)
- **4-Column Layout:** Left sidebar (narrow), form panel (narrow), preview (WIDE/dominant), actions sidebar (narrow) creates professional workspace
- **Preview Dominance:** Making preview `flex-1` while keeping other panels fixed width (w-16, w-80, w-56) ensures CV is the focal point
- **Internal Scrolling:** Fixed `h-screen` panels with `overflow-y-auto` content keeps UI stable while allowing long forms to scroll
- **Scale Transform:** CSS `scale(0.9)` on preview makes A4 document viewable without feeling "zoomed in" - more efficient use of space
- **Horizontal Tabs:** Border-bottom style tabs (vs. card-style buttons) feel more professional and save vertical space
- **Custom Scrollbar:** 6px width with almost-invisible default state (`#2b7cee20` = 12% opacity) and full color on hover creates polished look
- **Material Icons:** Google's Material Symbols Outlined provide consistent, modern iconography across UI
- **Form Patterns:** Multi-entry sections (Experience, Education) need add/edit/delete UI, single sections (Personal Info, Summary) are simpler forms
- **Real-Time Preview:** Users expect instant feedback - 300ms debounce on auto-save feels natural (not too fast to spam API, not too slow to feel laggy)
- **TypeScript Resolver:** zodResolver type mismatch with optional fields solved by explicit cast: `zodResolver(schema) as Resolver<Type, any>`
- **Space Grotesk Font:** Modern, professional feel that works well for both UI text and CV preview content
- **Toolbar Design:** Single slim horizontal row with proportionally-sized elements (compact buttons + small score indicator) keeps UI clean

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
