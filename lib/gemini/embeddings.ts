/**
 * Gemini Embeddings Generation
 * 
 * Optimized embedding generation for CV and Job matching.
 * Implements Gemini's recommendations for transformer attention optimization:
 * - Critical information at the beginning ([🎯 TOP SKILLS])
 * - Structured sections with clear markers
 * - Weighted content prioritization
 */

import { getEmbeddingModel } from "./client";
import type {
    PersonalInfo,
    Experience,
    Education,
    Skill,
    Project,
    Certificate,
    Language,
    SocialMedia,
    Interest,
} from "@/stores/cv-store";

/**
 * Complete Resume Data for embedding generation
 */
export interface ResumeData {
    personalInfo: PersonalInfo;
    experiences: Experience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
    certificates: Certificate[];
    languages: Language[];
    socialMedia: SocialMedia[];
    interests: Interest[];
}

/**
 * Job Data for embedding generation (matches database schema)
 */
export interface JobData {
    job_title: string;
    company_name: string;
    location: string;
    job_summary?: string;
    responsibilities?: string[]; // JSONB array
    must_have_skills?: string[]; // JSONB array
    nice_to_have_skills?: string[]; // JSONB array
    qualifications?: string[]; // JSONB array
    required_education_level?: string;
    years_of_experience_min?: number;
    years_of_experience_max?: number;
    experience_level?: string;
    employment_type?: string;
    remote_type?: string;
    company_size?: string;
    industry?: string;
    benefits?: string[]; // JSONB array
}

/**
 * Generate optimized CV embedding using text-embedding-004
 * 
 * Format optimized for transformer attention:
 * - [🎯 TOP SKILLS] - Most critical for job matching
 * - [📋 EXPERIENCE] - Professional history
 * - [🎯 CORE REQUIREMENTS] - Education, languages, summary
 * - [📂 ADDITIONAL CONTEXT] - Projects, certificates, interests
 */
export async function generateCVEmbedding(
    cvData: ResumeData
): Promise<number[]> {
    const formattedText = formatCVForEmbedding(cvData);

    try {
        const model = getEmbeddingModel();
        const result = await model.embedContent(formattedText);
        const embedding = result.embedding;

        // text-embedding-004 produces 768-dimensional embeddings
        if (!embedding || !embedding.values || embedding.values.length !== 768) {
            throw new Error(
                `Invalid embedding dimensions: expected 768, got ${embedding?.values?.length || 0}`
            );
        }

        return embedding.values;
    } catch (error) {
        console.error("Error generating CV embedding:", error);
        throw new Error(
            `Failed to generate CV embedding: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

/**
 * Format CV data for embedding generation
 * Optimized for semantic job matching
 */
function formatCVForEmbedding(cvData: ResumeData): string {
    const sections: string[] = [];

    // ========== SECTION 1: TOP SKILLS (CRITICAL - First for transformer attention) ==========
    const topSkills = cvData.skills
        .filter((s) => s.proficiency === "expert" || s.proficiency === "advanced")
        .map((s) => s.name)
        .join(", ");

    const allSkills = cvData.skills.map((s) => s.name).join(", ");

    sections.push(
        `[🎯 TOP SKILLS]\nExpert & Advanced: ${topSkills || "None"}\nAll Skills: ${allSkills || "None"}`
    );

    // ========== SECTION 2: EXPERIENCE (Dual View: Responsibilities + Achievements) ==========
    if (cvData.experiences.length > 0) {
        const experienceText = cvData.experiences
            .map((exp) => {
                const duration = exp.current
                    ? `${exp.startDate} - Present`
                    : `${exp.startDate} - ${exp.endDate || "N/A"}`;
                return `${exp.position} at ${exp.company} (${duration}): ${exp.description || "No description"}`;
            })
            .join("\n");

        sections.push(`[📋 EXPERIENCE]\n${experienceText}`);
    }

    // ========== SECTION 3: CORE REQUIREMENTS (Grouped for clarity) ==========
    const coreRequirements: string[] = [];

    // Professional summary
    if (cvData.personalInfo.summary) {
        coreRequirements.push(`Summary: ${cvData.personalInfo.summary}`);
    }

    // Current title
    if (cvData.personalInfo.title) {
        coreRequirements.push(`Title: ${cvData.personalInfo.title}`);
    }

    // Education
    if (cvData.education.length > 0) {
        const eduText = cvData.education
            .map((edu) => `${edu.degree} in ${edu.field} from ${edu.institution}`)
            .join("; ");
        coreRequirements.push(`Education: ${eduText}`);
    }

    // Languages
    if (cvData.languages.length > 0) {
        const langText = cvData.languages
            .map((lang) => `${lang.name} (${lang.proficiency})`)
            .join(", ");
        coreRequirements.push(`Languages: ${langText}`);
    }

    if (coreRequirements.length > 0) {
        sections.push(`[🎯 CORE REQUIREMENTS]\n${coreRequirements.join("\n")}`);
    }

    // ========== SECTION 4: ADDITIONAL CONTEXT ==========
    const additionalContext: string[] = [];

    // Projects
    if (cvData.projects.length > 0) {
        const projectText = cvData.projects
            .map(
                (proj) =>
                    `${proj.name}: ${proj.description} (Tech: ${proj.technologies.join(", ")})`
            )
            .join("; ");
        additionalContext.push(`Projects: ${projectText}`);
    }

    // Certificates
    if (cvData.certificates.length > 0) {
        const certText = cvData.certificates
            .map((cert) => `${cert.name} by ${cert.issuer}`)
            .join(", ");
        additionalContext.push(`Certificates: ${certText}`);
    }

    // Interests (low weight, but helps cultural fit)
    if (cvData.interests.length > 0) {
        const interestText = cvData.interests.map((i) => i.name).join(", ");
        additionalContext.push(`Interests: ${interestText}`);
    }

    if (additionalContext.length > 0) {
        sections.push(`[📂 ADDITIONAL CONTEXT]\n${additionalContext.join("\n")}`);
    }

    return sections.join("\n\n");
}

/**
 * Generate optimized Job embedding using text-embedding-004
 * 
 * Format optimized for transformer attention:
 * - [🎯 TOP SKILLS] - Must-have and nice-to-have skills
 * - [📋 RESPONSIBILITIES] - Key job duties
 * - [🎯 CORE REQUIREMENTS] - Title, summary, experience level
 * - [📂 CONTEXT] - Company details, benefits, location
 */
export async function generateJobEmbedding(
    jobData: JobData
): Promise<number[]> {
    const formattedText = formatJobForEmbedding(jobData);

    try {
        const model = getEmbeddingModel();
        const result = await model.embedContent(formattedText);
        const embedding = result.embedding;

        // text-embedding-004 produces 768-dimensional embeddings
        if (!embedding || !embedding.values || embedding.values.length !== 768) {
            throw new Error(
                `Invalid embedding dimensions: expected 768, got ${embedding?.values?.length || 0}`
            );
        }

        return embedding.values;
    } catch (error) {
        console.error("Error generating job embedding:", error);
        throw new Error(
            `Failed to generate job embedding: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

/**
 * Format Job data for embedding generation
 * Optimized for semantic CV matching
 */
function formatJobForEmbedding(jobData: JobData): string {
    const sections: string[] = [];

    // ========== SECTION 1: TOP SKILLS (CRITICAL - First for transformer attention) ==========
    const mustHaveSkills = jobData.must_have_skills?.join(", ") || "None";
    const niceToHaveSkills = jobData.nice_to_have_skills?.join(", ") || "None";

    sections.push(
        `[🎯 TOP SKILLS]\nMust-Have: ${mustHaveSkills}\nNice-to-Have: ${niceToHaveSkills}`
    );

    // ========== SECTION 2: RESPONSIBILITIES ==========
    if (jobData.responsibilities && jobData.responsibilities.length > 0) {
        sections.push(
            `[📋 RESPONSIBILITIES]\n${jobData.responsibilities.join("\n")}`
        );
    }

    // ========== SECTION 3: CORE REQUIREMENTS ==========
    const coreRequirements: string[] = [];

    coreRequirements.push(`Title: ${jobData.job_title}`);

    if (jobData.job_summary) {
        coreRequirements.push(`Summary: ${jobData.job_summary}`);
    }

    if (jobData.experience_level) {
        coreRequirements.push(`Experience Level: ${jobData.experience_level}`);
    }

    if (jobData.years_of_experience_min !== undefined) {
        const yearsText =
            jobData.years_of_experience_max !== undefined
                ? `${jobData.years_of_experience_min}-${jobData.years_of_experience_max} years`
                : `${jobData.years_of_experience_min}+ years`;
        coreRequirements.push(`Years of Experience: ${yearsText}`);
    }

    if (jobData.required_education_level) {
        coreRequirements.push(
            `Education: ${jobData.required_education_level}`
        );
    }

    if (jobData.qualifications && jobData.qualifications.length > 0) {
        coreRequirements.push(
            `Qualifications: ${jobData.qualifications.join(", ")}`
        );
    }

    sections.push(`[🎯 CORE REQUIREMENTS]\n${coreRequirements.join("\n")}`);

    // ========== SECTION 4: ADDITIONAL CONTEXT ==========
    const additionalContext: string[] = [];

    additionalContext.push(`Company: ${jobData.company_name}`);
    additionalContext.push(`Location: ${jobData.location}`);

    if (jobData.employment_type) {
        additionalContext.push(`Employment Type: ${jobData.employment_type}`);
    }

    if (jobData.remote_type) {
        additionalContext.push(`Remote Type: ${jobData.remote_type}`);
    }

    if (jobData.company_size) {
        additionalContext.push(`Company Size: ${jobData.company_size}`);
    }

    if (jobData.industry) {
        additionalContext.push(`Industry: ${jobData.industry}`);
    }

    if (jobData.benefits && jobData.benefits.length > 0) {
        additionalContext.push(`Benefits: ${jobData.benefits.join(", ")}`);
    }

    sections.push(`[📂 ADDITIONAL CONTEXT]\n${additionalContext.join("\n")}`);

    return sections.join("\n\n");
}

/**
 * Determine if CV embedding needs to be regenerated
 * 
 * Checks for meaningful changes that would affect job matching:
 * - Skills added/removed/changed
 * - Experience added/removed
 * - Education added/removed
 * - Summary changed
 * - Title changed
 */
export function shouldRegenerateCVEmbedding(
    oldCV: ResumeData,
    newCV: ResumeData
): boolean {
    // Check skills
    if (
        oldCV.skills.length !== newCV.skills.length ||
        JSON.stringify(oldCV.skills.map((s) => s.name).sort()) !==
        JSON.stringify(newCV.skills.map((s) => s.name).sort())
    ) {
        return true;
    }

    // Check experience count
    if (oldCV.experiences.length !== newCV.experiences.length) {
        return true;
    }

    // Check education count
    if (oldCV.education.length !== newCV.education.length) {
        return true;
    }

    // Check summary
    if (oldCV.personalInfo.summary !== newCV.personalInfo.summary) {
        return true;
    }

    // Check title
    if (oldCV.personalInfo.title !== newCV.personalInfo.title) {
        return true;
    }

    // Check projects count (affects embedding)
    if (oldCV.projects.length !== newCV.projects.length) {
        return true;
    }

    // Check certificates count
    if (oldCV.certificates.length !== newCV.certificates.length) {
        return true;
    }

    // Check languages count
    if (oldCV.languages.length !== newCV.languages.length) {
        return true;
    }

    // No meaningful changes detected
    return false;
}
