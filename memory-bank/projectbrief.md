# Project Brief

## Project Identity
**Name:** AI-Powered CV Builder & Job Matcher  
**Type:** Graduation Project (Bitirme Projesi)  
**Deadline:** January 15, 2026  
**Platform:** Web Application (Next.js)

---

## Project Vision
Build an intelligent CV creation and analysis platform that helps job seekers create ATS-optimized resumes and matches them with relevant job listings using AI-powered semantic search.

---

## Core Problem Statement
Job seekers face three critical challenges:
1. **CV Creation Difficulty:** Many struggle to create professional, well-structured CVs
2. **ATS Optimization:** Most CVs fail to pass Applicant Tracking Systems (ATS), never reaching human recruiters
3. **Job Discovery:** Finding relevant job postings that match their skills and experience is time-consuming and inefficient

---

## Solution Overview
An AI-powered platform that:
- Enables users to create multiple professional CVs through intuitive forms or PDF upload
- Analyzes CVs using Gemini AI to provide ATS optimization scores (post-MVP)
- Matches CVs with relevant job listings using semantic search (vector embeddings + pgvector)
- Provides real-time CV preview during creation (inspired by owlapply.com)
- Supports multi-language content (Turkish & English)

---

## Target Users
- **Primary:** Job seekers actively looking for employment
- **Secondary:** Individuals struggling with CV creation and formatting
- **Demographics:** Global audience (Turkish and international markets)
- **Scale:** Single-user focus initially, scalable architecture for future growth

---

## Must-Have Features (MVP - Due Jan 15, 2026)

### 1. Authentication & User Management
- User registration and login via Supabase Auth
- Secure session management
- User profile with language preference

### 2. CV Creation
- **Two Input Methods:**
  - Form-based creation with real-time preview
  - PDF upload with AI-powered parsing (Gemini API)
- **CV Sections:**
  - Personal Details (name, email, phone, location, summary)
  - Work Experience (multiple entries)
  - Education (multiple entries)
  - Skills (categorized with proficiency levels)
  - Projects (with tech stack and links)
  - Certificates (with expiration tracking)
  - Languages (with proficiency)
  - Social Media Links
  - Interests
- **Multiple CV Support:** Users can create and manage multiple CVs
- **Primary CV Selection:** Mark one CV as primary for job matching
- **Real-time Preview:** Live preview while editing (owlapply.com style)

### 3. CV Export
- **PDF Export:** Using react-to-print (preserving Tailwind styles)
- **Template System:** 2 initial templates, architecture supports dynamic addition
- **Download:** One-click download of formatted CV

### 4. Job Matching (Core Feature)
- **Semantic Search:** Match user's primary CV with job listings using vector embeddings
- **AI-Powered:** Gemini embeddings (text-embedding-004) + Supabase pgvector
- **Match Display:** Show similarity score as percentage (0-100%)
- **Ranking:** Display jobs sorted by relevance

### 5. Dashboard
- **CV Management:** List all user CVs with edit/delete actions
- **Job Recommendations:** Display matched jobs based on primary CV
- **Clean Layout:** Focus on CV management and job discovery

### 6. Multi-language Support
- **Languages:** Turkish and English (MVP)
- **Implementation:** next-intl with path-based routing (/tr, /en)
- **Dynamic:** Architecture supports easy addition of new languages
- **Preference Storage:** User's language choice saved in database

### 7. Design & UX
- **UI Framework:** shadcn/ui components + Tailwind CSS
- **Responsive:** Mobile-first design
- **Accessibility:** WCAG compliant
- **CV Builder UX:** Inspired by https://app.owlapply.com/resume-builder

---

## Post-MVP Features (After Jan 15, 2026)

### 1. ATS Score Analysis
- Gemini API analyzes CV and provides score out of 100
- Highlights missing/weak sections
- Provides improvement suggestions

### 2. DOCX Export
- Server-side DOCX generation using docx.js
- API route: `/api/export/docx`

### 3. Advanced Filtering
- Filter job matches by location, experience level, salary
- Combine structured filters with semantic search

### 4. User Settings Page
- Profile management (name, email update)
- Notification preferences
- Account deletion

### 5. Rate Limiting
- Implement usage quotas for non-paying users
- Prepare for potential premium tier

---

## Success Criteria (MVP Completion)

### Technical Requirements
✅ CV creation form fully functional with all sections  
✅ Real-time preview working seamlessly  
✅ PDF upload + AI parsing extracts data correctly  
✅ PDF export generates professional-looking documents  
✅ Job matching returns relevant results (>70% user satisfaction)  
✅ Authentication flows complete and secure  
✅ Multi-language switching works correctly  
✅ Responsive design on mobile, tablet, desktop  

### User Experience
✅ CV creation takes <10 minutes for new users  
✅ Form is intuitive and requires no documentation  
✅ Export process is one-click simple  
✅ Job matches feel relevant (qualitative feedback)  

### Deployment
✅ Deployed on Vercel with custom domain  
✅ Database migrations documented  
✅ Environment variables configured  
✅ Basic monitoring/error tracking in place  

---

## Non-Goals (Out of Scope)

### For MVP
❌ Payment/subscription system  
❌ Admin panel for job posting management  
❌ User-to-user messaging  
❌ Company profiles  
❌ Application tracking (beyond viewing matches)  
❌ Email notifications  
❌ Social features (sharing, commenting)  
❌ Mobile native apps  

---

## Key Constraints

### Time
- **Hard Deadline:** January 15, 2026
- **Development Time:** ~2 months from project start
- **Focus:** MVP features only, ruthlessly cut scope if needed

### Technical
- **AI Costs:** Gemini API calls must be optimized (caching, rate limiting)
- **File Size:** PDF uploads limited to 5MB
- **Browser Support:** Modern browsers only (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **Performance:** Page load <3s, form interactions <100ms

### Resources
- **Team:** Single developer (you)
- **Budget:** Free tier services where possible (Supabase free tier, Vercel hobby)
- **Learning Curve:** Time allocated for learning new technologies (pgvector, Gemini API)

---

## Risk Mitigation

### High-Risk Items
1. **AI Parsing Accuracy:** Gemini may not extract PDF CV data perfectly
   - **Mitigation:** Allow manual correction after parsing
   
2. **Vector Search Quality:** Job matches might not feel relevant
   - **Mitigation:** Start testing early, adjust embedding strategy if needed

3. **Time Crunch:** 2 months is tight for this scope
   - **Mitigation:** Priority matrix established, post-MVP features clearly defined

4. **Template Complexity:** Dynamic CV templates could be time-consuming
   - **Mitigation:** Start with 2 simple templates, focus on data structure over design

---

## Project Phases

### Phase 1: Foundation (Weeks 1-2)
- Project setup (Next.js 14+, TypeScript, Tailwind)
- Supabase configuration (auth + database)
- Database schema implementation
- Basic routing structure

### Phase 2: CV Creation (Weeks 3-5)
- Form implementation (all sections)
- Real-time preview component
- State management (Zustand)
- Template components (2 designs)
- PDF export functionality

### Phase 3: AI Integration (Weeks 6-7)
- Gemini API integration
- PDF upload + parsing
- Embedding generation (CVs + jobs)
- pgvector setup and queries

### Phase 4: Job Matching (Week 7)
- Dashboard implementation
- Job listing display
- Match algorithm
- Filtering and sorting

### Phase 5: Polish & Deploy (Week 8)
- Multi-language implementation (next-intl)
- Responsive design refinement
- Testing (manual + automated)
- Deployment to Vercel
- Documentation

---

## Stakeholders
- **Developer:** You (full ownership)
- **Users:** Job seekers (feedback during development)
- **Evaluators:** Academic reviewers (graduation committee)

---

## Definition of Done
The MVP is complete when:
1. A user can register, create a CV (via form or upload), and download it as PDF
2. The CV builder UI matches the inspiration (owlapply.com) in quality
3. Job matching returns 10-20 relevant jobs with similarity scores
4. The application works in both Turkish and English
5. All code is deployed to production and accessible via URL
6. Basic documentation exists (README, setup guide)
7. The project can be demonstrated in 10-15 minutes

---

## Repository & Documentation
- **Code:** Git version control with clear commit messages
- **Branches:** `main` (production), `develop` (active development)
- **Documentation:** README.md with setup instructions
- **Memory Bank:** This directory maintains project context across sessions

---

*Last Updated: November 15, 2025*
