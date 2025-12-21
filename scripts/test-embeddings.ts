/**
 * Test script for embedding generation
 * Run with: npx tsx scripts/test-embeddings.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(__dirname, "../.env.local") });

import { generateCVEmbedding, generateJobEmbedding } from "../lib/gemini/embeddings";
import type { ResumeData, JobData } from "../lib/gemini/embeddings";

// Test CV data
const testCV: ResumeData = {
    personalInfo: {
        firstName: "Ali",
        lastName: "Yılmaz",
        email: "ali@example.com",
        phone: "+90 555 123 4567",
        location: "İstanbul, Türkiye",
        title: "Senior Full-Stack Developer",
        summary: "5+ years of experience building scalable web applications with React, Node.js, and cloud technologies. Passionate about clean code and user experience.",
    },
    skills: [
        { id: "1", name: "React", category: "Frontend", proficiency: "expert" },
        { id: "2", name: "TypeScript", category: "Frontend", proficiency: "expert" },
        { id: "3", name: "Node.js", category: "Backend", proficiency: "advanced" },
        { id: "4", name: "PostgreSQL", category: "Database", proficiency: "advanced" },
        { id: "5", name: "Docker", category: "DevOps", proficiency: "intermediate" },
    ],
    experiences: [
        {
            id: "1",
            company: "TechCorp",
            position: "Senior Full-Stack Developer",
            location: "İstanbul, Türkiye",
            startDate: "2021-01",
            endDate: "2024-11",
            current: false,
            description: "Led development of customer-facing web platform serving 100k+ users. Built microservices with Node.js, React frontend, and PostgreSQL database.",
        },
        {
            id: "2",
            company: "StartupXYZ",
            position: "Full-Stack Developer",
            location: "Remote",
            startDate: "2019-03",
            endDate: "2020-12",
            current: false,
            description: "Developed e-commerce platform from scratch. Implemented payment integrations, inventory management, and admin dashboard.",
        },
    ],
    education: [
        {
            id: "1",
            institution: "Boğaziçi Üniversitesi",
            degree: "Bachelor of Science",
            field: "Computer Engineering",
            startDate: "2015-09",
            endDate: "2019-06",
            current: false,
            gpa: "3.5",
        },
    ],
    projects: [
        {
            id: "1",
            name: "AI Resume Builder",
            description: "SaaS platform for creating ATS-optimized resumes with AI assistance",
            technologies: ["Next.js", "Supabase", "Gemini API", "Tailwind CSS"],
            startDate: "2024-10",
            current: true,
            url: "https://example.com",
            github: "https://github.com/example/resume-builder",
        },
    ],
    certificates: [
        {
            id: "1",
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            issueDate: "2023-06",
            credentialId: "ABC123",
        },
    ],
    languages: [
        { id: "1", name: "Turkish", proficiency: "native" },
        { id: "2", name: "English", proficiency: "professional" },
    ],
    socialMedia: [
        { id: "1", platform: "LinkedIn", url: "https://linkedin.com/in/aliyilmaz" },
        { id: "2", platform: "GitHub", url: "https://github.com/aliyilmaz" },
    ],
    interests: [
        { id: "1", name: "Open Source" },
        { id: "2", name: "Machine Learning" },
    ],
};

// Test Job data
const testJob: JobData = {
    job_title: "Senior Full-Stack Developer",
    company_name: "TechInnovate",
    location: "İstanbul, Türkiye",
    job_summary: "We're looking for a Senior Full-Stack Developer to join our growing engineering team and help build our next-generation SaaS platform.",
    responsibilities: [
        "Design and develop scalable web applications",
        "Lead technical discussions and code reviews",
        "Mentor junior developers",
        "Collaborate with product team on feature planning",
    ],
    must_have_skills: ["React", "TypeScript", "Node.js", "5+ years experience"],
    nice_to_have_skills: ["Next.js", "PostgreSQL", "Docker", "AWS"],
    qualifications: [
        "BS in Computer Science or equivalent",
        "Strong communication skills",
        "Experience with agile methodologies",
    ],
    required_education_level: "bachelor",
    years_of_experience_min: 5,
    years_of_experience_max: 10,
    experience_level: "senior",
    employment_type: "full-time",
    remote_type: "hybrid",
    company_size: "medium",
    industry: "tech",
    benefits: ["Health insurance", "Remote work flexibility", "Learning budget", "Stock options"],
};

async function testEmbeddings() {
    console.log("🧪 Testing Embedding Generation...\n");

    try {
        // Test CV embedding
        console.log("📝 Generating CV embedding...");
        const cvEmbedding = await generateCVEmbedding(testCV);
        console.log(`✅ CV embedding generated: ${cvEmbedding.length} dimensions`);
        console.log(`   First 5 values: [${cvEmbedding.slice(0, 5).join(", ")}]`);
        console.log(`   Last 5 values: [${cvEmbedding.slice(-5).join(", ")}]\n`);

        // Test Job embedding
        console.log("💼 Generating Job embedding...");
        const jobEmbedding = await generateJobEmbedding(testJob);
        console.log(`✅ Job embedding generated: ${jobEmbedding.length} dimensions`);
        console.log(`   First 5 values: [${jobEmbedding.slice(0, 5).join(", ")}]`);
        console.log(`   Last 5 values: [${jobEmbedding.slice(-5).join(", ")}]\n`);

        // Calculate similarity (cosine similarity)
        const similarity = cosineSimilarity(cvEmbedding, jobEmbedding);
        console.log(`🎯 Similarity Score: ${(similarity * 100).toFixed(2)}%`);
        console.log(`   (Should be high since CV and Job are well-matched)\n`);

        console.log("✨ All tests passed!");
    } catch (error) {
        console.error("❌ Test failed:", error);
        process.exit(1);
    }
}

// Helper function to calculate cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
        throw new Error("Vectors must have same length");
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

testEmbeddings();
