# Product Context

## Why This Product Exists

### The Problem
The job market is increasingly competitive and automated. Three critical pain points prevent job seekers from success:

#### 1. CV Creation Paralysis
- **Blank Page Syndrome:** Many job seekers don't know where to start when creating a CV
- **Format Confusion:** Uncertain about what sections to include, how to organize information
- **Time Investment:** Creating a professional CV from scratch takes 3-6 hours
- **Multiple Versions:** Need different CVs for different job types, multiplying the effort

#### 2. The ATS Black Hole
- **90% Rejection Rate:** Applicant Tracking Systems (ATS) filter out most CVs before human review
- **Invisible Barriers:** Job seekers don't know why their CVs are rejected
- **Keyword Mystery:** Unclear what keywords and formatting ATS systems prefer
- **Wasted Applications:** Hours spent applying to jobs where the CV never gets seen

#### 3. Job Discovery Inefficiency
- **Manual Search Fatigue:** Browsing hundreds of irrelevant job posts across multiple platforms
- **Poor Matching:** Generic search algorithms miss relevant opportunities
- **Time Sink:** Spending 10+ hours/week just finding suitable positions
- **Opportunity Cost:** Missing perfect-fit jobs buried in search results

### Current Solutions & Their Gaps

#### Existing Alternatives
1. **Traditional CV Builders (Canva, Microsoft Word templates)**
   - ❌ No ATS optimization guidance
   - ❌ No job matching
   - ❌ Static templates, no intelligence
   
2. **Job Boards (LinkedIn, Indeed, Kariyer.net)**
   - ❌ Basic keyword search (no semantic understanding)
   - ❌ No CV analysis/improvement
   - ❌ Separate from CV creation process
   
3. **ATS Checkers (Jobscan, Resume Worded)**
   - ❌ Expensive ($50-90/month)
   - ❌ Limited free tier
   - ❌ No integrated job matching
   - ❌ No CV creation tools

4. **Premium Platforms (owlapply.com, Teal HQ)**
   - ✅ Great UX for CV building
   - ✅ Some AI features
   - ❌ Subscription-based ($20-50/month)
   - ❌ Focused on single market (usually US)
   - ❌ Limited language support

### Why Our Solution Is Needed
**None of the existing solutions combine all three critical needs in an accessible, affordable package:**
- ✅ **Intuitive CV Creation** (inspired by owlapply's UX)
- ✅ **AI-Powered Intelligence** (Gemini for analysis and matching)
- ✅ **Semantic Job Matching** (vector embeddings for true relevance)
- ✅ **Multi-Language Support** (serving both Turkish and global markets)
- ✅ **Free Access** (MVP removes financial barrier)

---

## What This Product Does

### Core User Journey

#### Journey 1: New CV from Scratch
```
User Registration (Supabase Auth)
   ↓
Dashboard (empty state with CTA)
   ↓
CV Builder (form-based, section by section)
   ↓
Real-Time Preview (see CV as you type)
   ↓
Template Selection (2 professional designs)
   ↓
Download PDF (react-to-print)
   ↓
Dashboard (CV saved, job matches appear)
```

#### Journey 2: Upload Existing CV
```
User Registration
   ↓
Dashboard → "Upload CV" button
   ↓
PDF Upload (drag & drop or file picker)
   ↓
AI Processing (Gemini extracts data from PDF)
   ↓
Pre-Filled Form (user reviews/edits parsed data)
   ↓
Save & Continue → Same as Journey 1
```

#### Journey 3: Job Discovery
```
Dashboard (user has ≥1 CV saved)
   ↓
Select Primary CV (if multiple exist)
   ↓
"Find Matching Jobs" (automatic on dashboard load)
   ↓
Job List (ranked by relevance, with % match scores)
   ↓
Job Detail View (click to see full description)
   ↓
External Application (link to job poster's site)
```

### Feature Breakdown

#### 🎨 CV Builder
**Purpose:** Make CV creation feel effortless, even enjoyable

**How It Works:**
- **Left Panel:** Multi-step form with clear sections
  - Personal Details (name, contact, summary)
  - Work Experience (add multiple, drag to reorder)
  - Education (degree, institution, dates)
  - Skills (categorized: technical, soft, languages)
  - Projects (with tech stack and links)
  - Certificates (with expiration tracking)
  - Additional: Social media, interests
  
- **Right Panel:** Live CV preview
  - Updates in real-time as user types (Zustand state sync)
  - Switchable templates (A/B template toggle)
  - Zoom controls for preview comfort

**Key UX Principles:**
- **Progressive Disclosure:** Show one section at a time, "Next" to advance
- **Smart Defaults:** Pre-fill common values (e.g., "present" for current job)
- **Validation:** Inline error messages, prevent invalid data
- **Auto-Save:** Draft saved to database every 30 seconds
- **Flexibility:** All fields optional except name and one contact method

#### 🤖 AI-Powered CV Upload
**Purpose:** Eliminate manual data entry for users with existing CVs

**How It Works:**
1. User uploads PDF (max 5MB)
2. Frontend sends to Next.js API route (`/api/cv/parse`)
3. Backend uses `pdf-parse` to extract raw text
4. Text sent to Gemini API with structured prompt:
   ```
   "Extract CV information from this text and return JSON 
    matching this schema: {personal_info: {...}, experience: [...], ...}"
   ```
5. Gemini returns structured JSON
6. Frontend populates form with extracted data
7. User reviews, corrects, and saves

**User Value:**
- Saves 80% of data entry time
- Preserves existing CV content
- Allows refinement before finalizing

#### 🎯 Semantic Job Matching
**Purpose:** Surface truly relevant jobs, not just keyword matches

**How It Works (Phase 11 MVP - Single-Vector):**

1. **CV Embedding Generation:**
   - When user saves CV, backend creates optimized text:
     ```
     [🎯 TOP SKILLS] Expert: React, TypeScript...
     [📋 EXPERIENCE] Senior Dev at TechCorp (3 years): Built scalable apps...
     [🎯 CORE REQUIREMENTS] Summary, Education, Languages...
     [📂 CONTEXT] Projects, Certificates...
     ```
   - Gemini `text-embedding-004` generates 1024-dim vector
   - Stored in `resumes.embedding`
   - **Optimization:** Skills listed first (transformer attention favors beginning)

2. **Job Embedding (Pre-computed by Admin):**
   - Admin adds job with structured fields:
     - `must_have_skills`: `["React", "TypeScript", "5+ years"]` (JSONB)
     - `nice_to_have_skills`: `["GraphQL", "Docker"]` (JSONB)
     - `responsibilities`: `["Develop features", "Code review"]` (JSONB)
     - `qualifications`: `["BS in CS", "Strong communication"]` (JSONB)
     - `benefits`: `["Health insurance", "Remote work"]` (JSONB)
   - Backend combines into weighted text:
     ```
     [🎯 TOP SKILLS] Must-Have: React, TypeScript, 5+ years...
     [📋 RESPONSIBILITIES] Develop features, Code review...
     [🎯 CORE REQUIREMENTS] Title, Summary, Experience level...
     [📂 CONTEXT] Company size, industry, benefits...
     ```
   - Gemini generates 1024-dim vector → `jobs.embedding`

3. **Matching Query (Supabase pgvector):**
   ```sql
   SELECT *, (1 - (embedding <=> $user_cv_embedding)) AS match_score
   FROM jobs
   WHERE is_active = true 
     AND language = $user_language
     AND (1 - (embedding <=> $user_cv_embedding)) > 0.5
   ORDER BY embedding <=> $user_cv_embedding
   LIMIT 20
   ```
   - Uses HNSW index for fast approximate nearest neighbor search
   - Returns jobs sorted by cosine similarity
   - Threshold 0.5 = 50% minimum match

4. **Display:**
   - Job cards show: title, company, location, **match percentage** (e.g., "89% match")
   - Click for full details (responsibilities, skills, benefits, salary range)
   - External link to apply (`application_url`)

**Why This Matters:**
- ✅ **Semantic Understanding:** "React Developer" matches "Frontend Engineer" without exact keyword
- ✅ **Context-Aware:** Matches based on experience depth, not just buzzwords
- ✅ **Time Saved:** 20 relevant jobs vs. manually searching 200+
- ✅ **Accuracy:** Single-vector achieves 75-85% relevance (startup-grade)

---

**Future: Multi-Vector Matching (Phase 12 - Max Accuracy):**

**When to Activate:** After A/B testing with 20-30 CV-Job pairs validates need for higher accuracy

**How It Works:**
1. **CV Split into 4 Embeddings:**
   - Title (384-dim): Job title preference + seniority
   - Skills (1024-dim): Technical + soft skills with proficiency
   - Experience (1024-dim): Responsibilities + achievements from work history
   - Context (384-dim): Education, languages, location preferences

2. **Job Split into 4 Embeddings:**
   - Title (384-dim): Job title + company context
   - Skills (1024-dim): Must-have + nice-to-have skills
   - Responsibilities (1024-dim): Key duties + experience level
   - Context (384-dim): Company size, industry, benefits, remote type

3. **Hybrid Scoring:**
   ```
   weighted_score = 
     0.20 * title_similarity +
     0.35 * skills_similarity +      ← Highest weight (most critical)
     0.30 * responsibilities_similarity +
     0.15 * context_similarity
   ```

4. **Database Function:**
   ```sql
   SELECT *, 
     (0.20 * title_sim + 0.35 * skills_sim + 0.30 * resp_sim + 0.15 * context_sim) AS weighted_score
   FROM jobs
   WHERE weighted_score > 0.6  -- Higher threshold
   ORDER BY weighted_score DESC
   LIMIT 20
   ```

**Expected Improvement:**
- Single-vector: 75-85% accuracy (good for MVP)
- Multi-vector: 85-95% accuracy (enterprise-grade)
- Trade-off: 4x embedding generation cost + storage

**Decision Criteria:**
- User feedback: "Are matched jobs relevant?" (target >80% satisfaction)
- A/B test results: Multi-vector vs single-vector head-to-head
- Cost analysis: Gemini API calls (4x per job/CV vs 1x)

#### 📱 Dashboard
**Purpose:** Central hub for CV management and job discovery

**Layout:**
- **Header:** Welcome message, language switcher, logout
- **Left Section (40% width):** 
  - "My CVs" card list
  - Each CV shows: title, last updated, "Set as Primary" toggle, edit/delete buttons
  - "+ Create New CV" button
- **Right Section (60% width):**
  - "Recommended Jobs" (based on primary CV)
  - Job cards with match scores
  - Infinite scroll or pagination

**Empty States:**
- No CVs: "Create your first CV to get started" with CTA
- No jobs: "No active job listings match your profile yet. Check back soon!"

#### 🌍 Multi-Language Experience
**Purpose:** Serve both Turkish and international users seamlessly

**How It Works:**
- **URL-Based:** `/tr/dashboard` vs `/en/dashboard`
- **Middleware Logic:**
  - New user: Redirect based on browser language (`Accept-Language`)
  - Logged-in user: Redirect to saved `preferred_language` from database
- **UI Translation:** All interface text translated via next-intl
- **Content Language:** Users create CVs in any language (free text)
- **Job Listings:** Tagged with language (`tr` or `en`), matched accordingly

**User Control:**
- Language switcher in header (flags or dropdown)
- Clicking switches URL path and reloads in new language
- Preference saved to database on next login

---

## How Users Should Feel

### Emotional Journey

#### Before Using Product (Pain)
😰 Overwhelmed by blank page  
😤 Frustrated by generic job search results  
😞 Defeated by silent rejections (ATS black hole)  
⏰ Stressed by time investment with little return  

#### While Using Product (Experience)
😌 **Guided:** Form structure removes decision paralysis  
✨ **Empowered:** Real-time preview builds confidence  
🎯 **Focused:** Job matches feel personally relevant  
⚡ **Efficient:** Hours of work reduced to minutes  

#### After Using Product (Outcome)
😊 **Accomplished:** Professional CV in hand  
🚀 **Optimistic:** Clear path to relevant opportunities  
📈 **Informed:** Understanding of which jobs fit best (match scores)  
💪 **Confident:** Ready to apply with a strong CV  

### Design Principles

#### 1. Clarity Over Cleverness
- Simple, declarative UI
- No jargon or confusing labels
- Every button does exactly what it says

#### 2. Immediate Feedback
- Form validation as you type
- Live preview updates instantly
- Match scores displayed prominently

#### 3. Forgiving Interactions
- Drafts auto-save (never lose work)
- Undo/redo for section edits
- Confirm before destructive actions (delete CV)

#### 4. Progressive Complexity
- Start simple (personal info)
- Add detail gradually (experience, projects)
- Advanced features discoverable but not overwhelming

#### 5. Visual Hierarchy
- Primary actions (Save, Download) stand out
- Secondary actions (Edit, Delete) subtle but accessible
- Match scores use color psychology (green = high, yellow = medium)

---

## Success Metrics (Product Goals)

### User Engagement
- **Time to First CV:** <15 minutes from signup to download
- **CV Creation Rate:** >80% of signups create at least one CV
- **Multiple CVs:** >30% of users create 2+ CVs
- **Return Rate:** >50% of users return after first CV creation

### Feature Usage
- **PDF Upload:** >40% of users try upload feature
- **Job Matching:** >90% of users view job recommendations
- **Template Switching:** >60% of users try both templates
- **Language Switching:** >20% of bilingual users switch language

### Quality Indicators
- **Match Relevance (Qualitative):** User survey shows >70% find jobs "relevant"
- **Export Success:** >95% of PDF exports are successful on first try
- **Form Completion:** <10% drop-off rate during CV creation
- **Parsing Accuracy:** >80% of uploaded CVs parsed with <3 corrections needed

### Technical Health
- **Page Load:** <3 seconds (75th percentile)
- **Form Responsiveness:** <100ms input lag
- **API Latency:** Gemini calls complete in <5 seconds
- **Uptime:** >99% availability

---

## User Personas

### Primary: Active Job Seeker (Ayşe)
- **Age:** 26
- **Background:** Junior frontend developer, 2 years experience
- **Goal:** Find a mid-level position in a modern tech company
- **Pain Points:**
  - Unsure how to format technical skills
  - Overwhelmed by 100+ job posts on LinkedIn
  - Doesn't know why applications get rejected
- **How Product Helps:**
  - Structured form guides her through sections
  - Semantic matching surfaces 15 relevant jobs (vs. manual search of 100)
  - Professional PDF template makes CV look polished

### Secondary: Career Changer (Mehmet)
- **Age:** 34
- **Background:** Transitioning from sales to project management
- **Goal:** Create CV highlighting transferable skills
- **Pain Points:**
  - Old CV is 6 years outdated
  - Doesn't know how to frame sales experience for PM roles
  - Limited time (full-time job + job search)
- **How Product Helps:**
  - Upload old CV, AI extracts data (saves 2 hours)
  - Summary section prompts him to articulate transferable skills
  - Job matching finds PM roles that value sales background

### Tertiary: International Student (Elena)
- **Age:** 22
- **Background:** Master's student in Turkey, seeking internship
- **Goal:** Create CV in both Turkish and English
- **Pain Points:**
  - Needs CV in Turkish for local companies
  - Also needs English version for international firms
  - Not familiar with Turkish CV format
- **How Product Helps:**
  - Creates CV in English first
  - Switches language to Turkish, translates content
  - Both versions stored, can export either anytime

---

## Competitive Positioning

### Our Unique Value Proposition
**"Create ATS-optimized CVs in minutes and discover jobs that actually match your skills—powered by AI, available in your language, and completely free."**

### Differentiation Matrix

| Feature | Our Product | owlapply.com | Jobscan | LinkedIn | Canva |
|---------|-------------|--------------|---------|----------|-------|
| **Intuitive CV Builder** | ✅ | ✅ | ❌ | ⚠️ (basic) | ✅ |
| **Real-Time Preview** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **AI CV Parsing** | ✅ (Gemini) | ⚠️ (limited) | ❌ | ❌ | ❌ |
| **Semantic Job Matching** | ✅ (vector) | ❌ | ❌ | ⚠️ (keyword) | ❌ |
| **ATS Score** | 🔜 (post-MVP) | ✅ | ✅ | ❌ | ❌ |
| **Multi-Language** | ✅ (TR/EN) | ❌ (EN only) | ❌ | ⚠️ (UI only) | ✅ |
| **Price** | Free | $29/mo | $49/mo | Free | Free (limited) |
| **Turkish Market** | ✅ | ❌ | ❌ | ⚠️ | ⚠️ |

### Why Users Choose Us
1. **For Turkish Users:** Only solution with native Turkish interface + local job market
2. **For Budget-Conscious:** Free tier includes core features (others paywall)
3. **For AI Enthusiasts:** Gemini integration is cutting-edge (most use older tech)
4. **For Efficiency Seekers:** Upload → Parse → Match flow is faster than any alternative

---

## Product Roadmap (Beyond MVP)

### Phase 2: Intelligence (Post-Jan 15)
- **ATS Score:** Gemini analyzes CV, provides 0-100 score + improvement tips
- **Smart Suggestions:** AI recommends missing sections (e.g., "Add certifications to boost score")
- **Keyword Optimization:** Highlight missing keywords from job descriptions

### Phase 3: Collaboration
- **Share CV:** Generate public link to CV (for recruiters)
- **Feedback Mode:** Allow mentors/friends to comment on sections
- **Version History:** Track changes over time, revert to older versions

### Phase 4: Job Application
- **One-Click Apply:** Submit CV directly to integrated job boards
- **Application Tracking:** Dashboard shows where you applied, response status
- **Email Alerts:** Get notified when new matching jobs appear

### Phase 5: Monetization
- **Free Tier:** 3 CVs, 20 job matches/month, 2 templates
- **Pro Tier ($9/mo):** Unlimited CVs, unlimited matches, 10+ templates, priority support
- **Premium Tier ($19/mo):** ATS score, AI suggestions, application tracking

---

## Content Strategy

### Tone of Voice
- **Professional but Approachable:** Not corporate jargon, not overly casual
- **Encouraging:** "You're doing great!" vs. "Error: Invalid input"
- **Action-Oriented:** "Download Your CV" vs. "Export"
- **Inclusive:** "Create your next opportunity" (not "Find your dream job")

### Microcopy Examples
| Context | Copy |
|---------|------|
| Empty dashboard | "Ready to create your first CV? Let's get started!" |
| CV saved | "✓ Saved! Your CV is ready to download." |
| No job matches | "We're still adding jobs in your field. Check back tomorrow!" |
| Upload error | "That file didn't work. Try a PDF under 5MB." |
| High match | "🎯 89% match—this role looks perfect for you!" |
| Form validation | "Add at least one work experience to continue." |

### Accessibility
- **ARIA Labels:** All interactive elements labeled for screen readers
- **Keyboard Navigation:** Full tab-through support
- **Color Contrast:** WCAG AA compliant (4.5:1 minimum)
- **Error Messaging:** Clear, specific, actionable

---

## Risk Mitigation (Product Perspective)

### Risk 1: Users Don't Trust AI Parsing
- **Mitigation:** Always show parsed data in editable form, emphasize review step
- **Messaging:** "AI saves you time—you stay in control"

### Risk 2: Job Matches Feel Irrelevant
- **Mitigation:** Display match score prominently, allow filtering/sorting
- **Fallback:** If vector search quality is poor, supplement with keyword search

### Risk 3: Template Designs Look Unprofessional
- **Mitigation:** Start with proven layouts (inspired by owlapply), iterate based on user feedback
- **Quality Bar:** Each template must pass "Would I submit this?" test

### Risk 4: Language Support Creates Fragmentation
- **Mitigation:** Use next-intl from day one, treat i18n as core architecture (not feature)
- **Testing:** Every feature tested in both TR and EN before shipping

---

*Last Updated: November 15, 2025*
