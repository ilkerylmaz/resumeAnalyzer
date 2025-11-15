# AI-Powered CV Builder & Job Matcher

A Next.js application that helps job seekers create ATS-optimized CVs and matches them with relevant job listings using AI-powered semantic search.

## Features

- 🎨 **Intuitive CV Builder** - Create professional CVs with real-time preview
- 🤖 **AI-Powered** - Gemini API for CV parsing and intelligent matching
- 📄 **PDF Export** - Download your CV as a professional PDF
- 🔍 **Smart Job Matching** - Vector-based semantic search finds relevant opportunities
- 🌍 **Multi-Language** - Full support for English and Turkish
- 🎯 **ATS Optimization** - Build CVs that pass Applicant Tracking Systems

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), React 19, TypeScript
- **Backend:** Next.js API Routes (Serverless)
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** Supabase (PostgreSQL + pgvector)
- **Auth:** Supabase Auth
- **AI:** Google Gemini API
- **State Management:** Zustand + React Hook Form
- **i18n:** next-intl
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account
- Google Gemini API key

### Installation

1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd project-bitirme-nextjs
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Setup environment variables
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your credentials:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-gemini-api-key
\`\`\`

4. Run database migrations (see `memory-bank/techContext.md` for schema)

5. Start the development server
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilities and configs
│   ├── supabase/        # Supabase client
│   ├── gemini/          # Gemini API wrapper
│   └── utils/           # Helper functions
├── stores/              # Zustand stores
├── hooks/               # Custom React hooks
├── messages/            # i18n translations
│   ├── en.json
│   └── tr.json
└── memory-bank/         # Project documentation
    ├── projectbrief.md
    ├── techContext.md
    └── ...
\`\`\`

## Documentation

Comprehensive project documentation is available in the `memory-bank/` directory:

- **projectbrief.md** - Project scope and requirements
- **productContext.md** - User problems and solutions
- **techContext.md** - Technology stack and database schema
- **systemPatterns.md** - Architecture patterns
- **activeContext.md** - Current development focus
- **progress.md** - Development progress tracking

## Development

\`\`\`bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
\`\`\`

## MVP Features (Due: January 15, 2026)

- ✅ Project setup complete
- ⬜ Authentication (Supabase Auth)
- ⬜ CV Builder (form-based creation)
- ⬜ Real-time CV preview
- ⬜ PDF export
- ⬜ CV upload & AI parsing
- ⬜ Job matching (vector search)
- ⬜ Dashboard
- ⬜ Multi-language support

## License

This is a graduation project (Bitirme Projesi).

## Contact

For questions or feedback, please contact [your-email]
