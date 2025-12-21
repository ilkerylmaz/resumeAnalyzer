"use server";

import { createClient } from "@/lib/supabase/server";
import type { CVState } from "@/stores/cv-store";
import {
    generateCVEmbedding,
    shouldRegenerateCVEmbedding,
    type ResumeData,
} from "@/lib/gemini/embeddings";

export interface SaveResumeResult {
    success: boolean;
    resumeId?: string;
    error?: string;
}

/**
 * Save complete resume to database
 * - If resumeId exists: UPDATE existing resume
 * - If resumeId is null: INSERT new resume
 */
export async function saveResume(cvData: Partial<CVState>): Promise<SaveResumeResult> {
    try {
        const supabase = await createClient();

        // Get current user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "User not authenticated" };
        }

        const userId = user.id;
        const isNewResume = !cvData.resumeId;

        // Step 1: Save or update main resume record
        let resumeId = cvData.resumeId;

        if (isNewResume) {
            // Insert new resume
            const { data: newResume, error: resumeError } = await supabase
                .from("resumes")
                .insert({
                    user_id: userId,
                    title: cvData.resumeTitle || "Untitled Resume",
                    template_id: cvData.templateId || "template-a",
                    is_primary: cvData.isPrimary || false,
                })
                .select("resume_id")
                .single();

            if (resumeError) {
                console.error("Error inserting resume:", resumeError);
                return { success: false, error: resumeError.message };
            }

            resumeId = newResume.resume_id;
        } else {
            // Update existing resume
            const { error: resumeError } = await supabase
                .from("resumes")
                .update({
                    title: cvData.resumeTitle || "Untitled Resume",
                    template_id: cvData.templateId || "template-a",
                    is_primary: cvData.isPrimary || false,
                })
                .eq("resume_id", resumeId);

            if (resumeError) {
                console.error("Error updating resume:", resumeError);
                return { success: false, error: resumeError.message };
            }
        }

        // Step 2: Save all sections with error tracking
        if (resumeId) {
            const sectionErrors: string[] = [];

            try {
                await savePersonalDetails(resumeId, cvData.personalInfo);
            } catch (e) {
                console.error("❌ savePersonalDetails failed:", e);
                sectionErrors.push("personalInfo");
            }

            try {
                await saveExperiences(resumeId, cvData.experiences || []);
            } catch (e) {
                console.error("❌ saveExperiences failed:", e);
                sectionErrors.push("experiences");
            }

            try {
                await saveEducation(resumeId, cvData.education || []);
            } catch (e) {
                console.error("❌ saveEducation failed:", e);
                sectionErrors.push("education");
            }

            try {
                await saveSkills(resumeId, cvData.skills || []);
            } catch (e) {
                console.error("❌ saveSkills failed:", e);
                sectionErrors.push("skills");
            }

            try {
                await saveProjects(resumeId, cvData.projects || []);
            } catch (e) {
                console.error("❌ saveProjects failed:", e);
                sectionErrors.push("projects");
            }

            try {
                await saveCertificates(resumeId, cvData.certificates || []);
            } catch (e) {
                console.error("❌ saveCertificates failed:", e);
                sectionErrors.push("certificates");
            }

            try {
                await saveLanguages(resumeId, cvData.languages || []);
            } catch (e) {
                console.error("❌ saveLanguages failed:", e);
                sectionErrors.push("languages");
            }

            try {
                await saveSocialMedia(resumeId, cvData.socialMedia || []);
            } catch (e) {
                console.error("❌ saveSocialMedia failed:", e);
                sectionErrors.push("socialMedia");
            }

            try {
                await saveInterests(resumeId, cvData.interests || []);
            } catch (e) {
                console.error("❌ saveInterests failed:", e);
                sectionErrors.push("interests");
            }

            if (sectionErrors.length > 0) {
                console.warn("⚠️ Some sections failed to save:", sectionErrors);
            }

            // Step 3: Generate and save embedding (non-blocking)
            // Run in background - don't block CV save if embedding fails
            try {
                console.log("🔄 Generating CV embedding...");
                const embeddingResult = await generateAndSaveEmbedding(resumeId);

                if (embeddingResult.success) {
                    console.log("✅ CV embedding generated successfully");
                } else {
                    console.error("⚠️ Embedding generation failed:", embeddingResult.error);
                    // Don't fail the entire save operation
                }
            } catch (embeddingError) {
                console.error("⚠️ Embedding generation error:", embeddingError);
                // Don't fail the entire save operation
            }
        }

        return { success: true, resumeId };
    } catch (error) {
        console.error("Error saving resume:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}

/**
 * Fetch complete resume from database
 */
export async function fetchResume(resumeId: string): Promise<Partial<CVState> | null> {
    try {
        const supabase = await createClient();

        // Fetch main resume
        const { data: resume, error: resumeError } = await supabase
            .from("resumes")
            .select("*")
            .eq("resume_id", resumeId)
            .single();

        if (resumeError || !resume) {
            console.error("Error fetching resume:", resumeError);
            return null;
        }

        // Fetch all sections in parallel
        const [
            personalDetails,
            experiences,
            education,
            skills,
            projects,
            certificates,
            languages,
            socialMedia,
            interests,
        ] = await Promise.all([
            fetchPersonalDetails(resumeId),
            fetchExperiences(resumeId),
            fetchEducation(resumeId),
            fetchSkills(resumeId),
            fetchProjects(resumeId),
            fetchCertificates(resumeId),
            fetchLanguages(resumeId),
            fetchSocialMedia(resumeId),
            fetchInterests(resumeId),
        ]);

        return {
            resumeId: resume.resume_id,
            resumeTitle: resume.title,
            templateId: resume.template_id,
            isPrimary: resume.is_primary,
            personalInfo: personalDetails,
            experiences,
            education,
            skills,
            projects,
            certificates,
            languages,
            socialMedia,
            interests,
        };
    } catch (error) {
        console.error("Error fetching resume:", error);
        return null;
    }
}

// Helper functions for each section

async function savePersonalDetails(resumeId: string, data: any) {
    if (!data) return;

    const supabase = await createClient();
    const fullname = `${data.firstName || ""} ${data.lastName || ""}`.trim();

    // Check if personal details already exist
    const { data: existing } = await supabase
        .from("resume_personal_details")
        .select("id")
        .eq("resume_id", resumeId)
        .single();

    const payload = {
        resume_id: resumeId,
        fullname: fullname || "Unknown",
        email: data.email || "",
        phone: data.phone || "",
        age: null,
        location: data.location || "",
        summary: data.summary || "",
    };

    let error;
    if (existing) {
        // Update existing record
        const result = await supabase
            .from("resume_personal_details")
            .update(payload)
            .eq("resume_id", resumeId);
        error = result.error;
    } else {
        // Insert new record
        const result = await supabase
            .from("resume_personal_details")
            .insert(payload);
        error = result.error;
    }

    if (error) {
        console.error("❌ Save personal details error:", error);
        console.error("📦 Data being saved:", data);
        throw error;
    }

    console.log("✅ Saved personal details");
}

async function saveExperiences(resumeId: string, experiences: any[]) {
    const supabase = await createClient();

    // Delete existing experiences
    const { error: deleteError } = await supabase
        .from("resume_experience")
        .delete()
        .eq("resume_id", resumeId);

    if (deleteError) {
        console.error("❌ Delete experiences error:", deleteError);
        throw deleteError;
    }

    // Insert new experiences
    if (experiences.length > 0) {
        const { error: insertError } = await supabase
            .from("resume_experience")
            .insert(
                experiences.map((exp, index) => ({
                    resume_id: resumeId,
                    title: exp.position,
                    company_name: exp.company,
                    location: exp.location || null,
                    start_date: exp.startDate ? `${exp.startDate}-01` : null,
                    end_date: exp.current ? null : (exp.endDate ? `${exp.endDate}-01` : null),
                    is_current: exp.current,
                    employment_type: null,
                    job_description: exp.description || null,
                    achievements: null,
                    display_order: index,
                }))
            );

        if (insertError) {
            console.error("❌ Insert experiences error:", insertError);
            console.error("📦 Data being inserted:", experiences);
            throw insertError;
        }

        console.log("✅ Saved", experiences.length, "experiences");
    }
}

async function saveEducation(resumeId: string, education: any[]) {
    const supabase = await createClient();

    const { error: deleteError } = await supabase
        .from("resume_education")
        .delete()
        .eq("resume_id", resumeId);

    if (deleteError) {
        console.error("❌ Delete education error:", deleteError);
        throw deleteError;
    }

    if (education.length > 0) {
        const { error: insertError } = await supabase
            .from("resume_education")
            .insert(
                education.map((edu, index) => ({
                    resume_id: resumeId,
                    degree: edu.degree,
                    school_name: edu.institution,
                    field_of_study: edu.field,
                    location: edu.location || null,
                    start_date: edu.startDate ? `${edu.startDate}-01` : null,
                    end_date: edu.current ? null : (edu.endDate ? `${edu.endDate}-01` : null),
                    is_current: edu.current,
                    gpa: edu.gpa ? parseFloat(edu.gpa) : null,
                    honors: edu.description || null,
                    display_order: index,
                }))
            );

        if (insertError) {
            console.error("❌ Insert education error:", insertError);
            console.error("📦 Data being inserted:", education);
            throw insertError;
        }

        console.log("✅ Saved", education.length, "education entries");
    }
}

async function saveSkills(resumeId: string, skills: any[]) {
    const supabase = await createClient();

    const { error: deleteError } = await supabase
        .from("resume_skills")
        .delete()
        .eq("resume_id", resumeId);

    if (deleteError) {
        console.error("❌ Delete skills error:", deleteError);
        throw deleteError;
    }

    if (skills.length > 0) {
        const { error: insertError } = await supabase
            .from("resume_skills")
            .insert(
                skills.map((skill, index) => ({
                    resume_id: resumeId,
                    skill_name: skill.name,
                    category: skill.category || null,
                    proficiency_level: skill.level || null,
                    display_order: index,
                }))
            );

        if (insertError) {
            console.error("❌ Insert skills error:", insertError);
            console.error("📦 Data being inserted:", skills);
            throw insertError;
        }

        console.log("✅ Saved", skills.length, "skills");
    }
}

async function saveProjects(resumeId: string, projects: any[]) {
    const supabase = await createClient();

    const { error: deleteError } = await supabase
        .from("resume_projects")
        .delete()
        .eq("resume_id", resumeId);

    if (deleteError) {
        console.error("❌ Delete projects error:", deleteError);
        throw deleteError;
    }

    if (projects.length > 0) {
        const { error: insertError } = await supabase
            .from("resume_projects")
            .insert(
                projects.map((project, index) => ({
                    resume_id: resumeId,
                    project_name: project.name,
                    description: project.description || null,
                    technologies_used: project.technologies?.join(", ") || null,
                    project_link: project.url || null,
                    demo_url: project.github || null,
                    start_date: project.startDate ? `${project.startDate}-01` : null,
                    end_date: project.current ? null : (project.endDate ? `${project.endDate}-01` : null),
                    is_current: project.current,
                    display_order: index,
                }))
            );

        if (insertError) {
            console.error("❌ Insert projects error:", insertError);
            console.error("📦 Data being inserted:", projects);
            throw insertError;
        }

        console.log("✅ Saved", projects.length, "projects");
    }
}

async function saveCertificates(resumeId: string, certificates: any[]) {
    const supabase = await createClient();

    const { error: deleteError } = await supabase
        .from("resume_certificates")
        .delete()
        .eq("resume_id", resumeId);

    if (deleteError) {
        console.error("❌ Delete certificates error:", deleteError);
        throw deleteError;
    }

    if (certificates.length > 0) {
        const { error: insertError } = await supabase
            .from("resume_certificates")
            .insert(
                certificates.map((cert, index) => ({
                    resume_id: resumeId,
                    certificate_name: cert.name,
                    issuing_organization: cert.issuer,
                    issue_date: cert.issueDate ? `${cert.issueDate}-01` : null,
                    expiration_date: cert.expirationDate ? `${cert.expirationDate}-01` : null,
                    does_not_expire: !cert.expirationDate,
                    credential_id: cert.credentialId || null,
                    credential_url: cert.url || null,
                    display_order: index,
                }))
            );

        if (insertError) {
            console.error("❌ Insert certificates error:", insertError);
            console.error("📦 Data being inserted:", certificates);
            throw insertError;
        }

        console.log("✅ Saved", certificates.length, "certificates");
    }
}

async function saveLanguages(resumeId: string, languages: any[]) {
    const supabase = await createClient();

    const { error: deleteError } = await supabase
        .from("resume_languages")
        .delete()
        .eq("resume_id", resumeId);

    if (deleteError) {
        console.error("❌ Delete languages error:", deleteError);
        throw deleteError;
    }

    if (languages.length > 0) {
        // Map proficiency levels: elementary → basic, limited → intermediate, professional → fluent, native → native
        const mapProficiency = (level: string) => {
            const mapping: Record<string, string> = {
                elementary: "basic",
                limited: "intermediate",
                professional: "fluent",
                native: "native",
            };
            return mapping[level] || "intermediate";
        };

        const { error: insertError } = await supabase
            .from("resume_languages")
            .insert(
                languages.map((lang, index) => ({
                    resume_id: resumeId,
                    language_name: lang.name,
                    proficiency: mapProficiency(lang.proficiency),
                    display_order: index,
                }))
            );

        if (insertError) {
            console.error("❌ Insert languages error:", insertError);
            console.error("📦 Data being inserted:", languages);
            throw insertError;
        }

        console.log("✅ Saved", languages.length, "languages");
    }
}

async function saveSocialMedia(resumeId: string, socialMedia: any[]) {
    const supabase = await createClient();

    const { error: deleteError } = await supabase
        .from("resume_social_media")
        .delete()
        .eq("resume_id", resumeId);

    if (deleteError) {
        console.error("❌ Delete social media error:", deleteError);
        throw deleteError;
    }

    if (socialMedia.length > 0) {
        const { error: insertError } = await supabase
            .from("resume_social_media")
            .insert(
                socialMedia.map((social, index) => ({
                    resume_id: resumeId,
                    platform_name: social.platform,
                    url: social.url,
                    username: null,
                    display_order: index,
                }))
            );

        if (insertError) {
            console.error("❌ Insert social media error:", insertError);
            console.error("📦 Data being inserted:", socialMedia);
            throw insertError;
        }

        console.log("✅ Saved", socialMedia.length, "social media entries");
    }
}

async function saveInterests(resumeId: string, interests: any[]) {
    const supabase = await createClient();

    const { error: deleteError } = await supabase
        .from("resume_interests")
        .delete()
        .eq("resume_id", resumeId);

    if (deleteError) {
        console.error("❌ Delete interests error:", deleteError);
        throw deleteError;
    }

    if (interests.length > 0) {
        const { error: insertError } = await supabase
            .from("resume_interests")
            .insert(
                interests.map((interest, index) => ({
                    resume_id: resumeId,
                    interest_name: interest.name,
                    display_order: index,
                }))
            );

        if (insertError) {
            console.error("❌ Insert interests error:", insertError);
            console.error("📦 Data being inserted:", interests);
            throw insertError;
        }

        console.log("✅ Saved", interests.length, "interests");
    }
}

// Fetch helper functions

async function fetchPersonalDetails(resumeId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("resume_personal_details")
        .select("*")
        .eq("resume_id", resumeId)
        .single();

    if (data) {
        const nameParts = data.fullname?.split(" ") || ["", ""];
        return {
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            title: "",
            summary: data.summary || "",
        };
    }

    return {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        title: "",
        summary: "",
    };
}

async function fetchExperiences(resumeId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("resume_experience")
        .select("*")
        .eq("resume_id", resumeId)
        .order("display_order", { ascending: true });

    return (
        data?.map((exp) => ({
            id: exp.id,
            company: exp.company_name,
            position: exp.title,
            location: exp.location || "",
            startDate: exp.start_date,
            endDate: exp.end_date || "",
            current: exp.is_current,
            description: exp.job_description || "",
        })) || []
    );
}

async function fetchEducation(resumeId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("resume_education")
        .select("*")
        .eq("resume_id", resumeId)
        .order("display_order", { ascending: true });

    return (
        data?.map((edu) => ({
            id: edu.id,
            institution: edu.school_name,
            degree: edu.degree,
            field: edu.field_of_study,
            location: edu.location || "",
            startDate: edu.start_date,
            endDate: edu.end_date || "",
            current: edu.is_current,
            gpa: edu.gpa?.toString() || "",
            description: edu.honors || "",
        })) || []
    );
}

async function fetchSkills(resumeId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("resume_skills")
        .select("*")
        .eq("resume_id", resumeId)
        .order("display_order", { ascending: true });

    return (
        data?.map((skill) => ({
            id: skill.id,
            name: skill.skill_name,
            category: skill.category,
            proficiency: skill.proficiency_level as "beginner" | "intermediate" | "advanced" | "expert",
        })) || []
    );
}

async function fetchProjects(resumeId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("resume_projects")
        .select("*")
        .eq("resume_id", resumeId)
        .order("display_order", { ascending: true });

    return (
        data?.map((project) => ({
            id: project.id,
            name: project.project_name,
            description: project.description || "",
            technologies: project.technologies_used?.split(", ").filter(Boolean) || [],
            startDate: project.start_date,
            endDate: project.end_date || "",
            current: project.is_current,
            url: project.project_link || "",
            github: project.demo_url || "",
        })) || []
    );
}

async function fetchCertificates(resumeId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("resume_certificates")
        .select("*")
        .eq("resume_id", resumeId)
        .order("display_order", { ascending: true });

    return (
        data?.map((cert) => ({
            id: cert.id,
            name: cert.certificate_name,
            issuer: cert.issuing_organization,
            issueDate: cert.issue_date,
            expirationDate: cert.expiration_date || "",
            credentialId: cert.credential_id || "",
            url: cert.credential_url || "",
        })) || []
    );
}

async function fetchLanguages(resumeId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("resume_languages")
        .select("*")
        .eq("resume_id", resumeId)
        .order("display_order", { ascending: true });

    // Map DB proficiency back to code values: basic → elementary, intermediate → limited, fluent → professional
    const mapProficiency = (dbLevel: string) => {
        const mapping: Record<string, string> = {
            basic: "elementary",
            intermediate: "limited",
            fluent: "professional",
            native: "native",
        };
        return mapping[dbLevel] || "limited";
    };

    return (
        data?.map((lang) => ({
            id: lang.id,
            name: lang.language_name,
            proficiency: mapProficiency(lang.proficiency) as "elementary" | "limited" | "professional" | "native",
        })) || []
    );
}

async function fetchSocialMedia(resumeId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("resume_social_media")
        .select("*")
        .eq("resume_id", resumeId)
        .order("display_order", { ascending: true });

    return (
        data?.map((social) => ({
            id: social.id,
            platform: social.platform_name,
            url: social.url,
        })) || []
    );
}

async function fetchInterests(resumeId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("resume_interests")
        .select("*")
        .eq("resume_id", resumeId)
        .order("display_order", { ascending: true });

    return (
        data?.map((interest) => ({
            id: interest.id,
            name: interest.interest_name,
        })) || []
    );
}

/**
 * Fetch all resumes for the current user
 */
export async function fetchUserResumes() {
    try {
        const supabase = await createClient();

        // Get current user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error("User not authenticated");
            return [];
        }

        // Fetch user's resumes
        const { data: resumes, error: resumesError } = await supabase
            .from("resumes")
            .select("resume_id, title, template_id, is_primary, created_at, updated_at")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });

        if (resumesError) {
            console.error("Error fetching resumes:", resumesError);
            return [];
        }

        return resumes || [];
    } catch (error) {
        console.error("Error fetching user resumes:", error);
        return [];
    }
}

/**
 * Generate and save CV embedding to database
 * Called after CV is saved/updated
 * 
 * @param resumeId - The resume ID to generate embedding for
 * @returns Success status and embedding array (if successful)
 */
export async function generateAndSaveEmbedding(
    resumeId: string
): Promise<{ success: boolean; embedding?: number[]; error?: string }> {
    try {
        const supabase = await createClient();

        // Fetch complete resume data
        const cvData = await fetchResume(resumeId);

        if (!cvData || !cvData.personalInfo) {
            return { success: false, error: "Resume not found or incomplete" };
        }

        // Convert to ResumeData format for embedding generation
        const resumeData: ResumeData = {
            personalInfo: cvData.personalInfo,
            experiences: cvData.experiences || [],
            education: cvData.education || [],
            skills: cvData.skills || [],
            projects: cvData.projects || [],
            certificates: cvData.certificates || [],
            languages: cvData.languages || [],
            socialMedia: cvData.socialMedia || [],
            interests: cvData.interests || [],
        };

        // Generate embedding using Gemini API
        const embedding = await generateCVEmbedding(resumeData);

        // Save embedding to database (Supabase client handles pgvector conversion)
        const { error: updateError } = await supabase
            .from("resumes")
            .update({ embedding })
            .eq("resume_id", resumeId);

        if (updateError) {
            console.error("Error saving embedding:", updateError);
            return { success: false, error: updateError.message };
        }

        return { success: true, embedding };
    } catch (error) {
        console.error("Error generating embedding:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Check if embedding regeneration is needed and do it if necessary
 * 
 * @param resumeId - The resume ID to check
 * @param newCVData - The new CV data to compare
 * @returns Whether embedding was regenerated
 */
export async function regenerateEmbeddingIfNeeded(
    resumeId: string,
    newCVData: Partial<CVState>
): Promise<{ regenerated: boolean; error?: string }> {
    try {
        const supabase = await createClient();

        // Fetch current resume data from database
        const currentCVData = await fetchResume(resumeId);

        if (!currentCVData || !currentCVData.personalInfo) {
            return { regenerated: false, error: "Resume not found" };
        }

        // Convert to ResumeData format for comparison
        const oldResumeData: ResumeData = {
            personalInfo: currentCVData.personalInfo,
            experiences: currentCVData.experiences || [],
            education: currentCVData.education || [],
            skills: currentCVData.skills || [],
            projects: currentCVData.projects || [],
            certificates: currentCVData.certificates || [],
            languages: currentCVData.languages || [],
            socialMedia: currentCVData.socialMedia || [],
            interests: currentCVData.interests || [],
        };

        const newResumeData: ResumeData = {
            personalInfo: newCVData.personalInfo!,
            experiences: newCVData.experiences || [],
            education: newCVData.education || [],
            skills: newCVData.skills || [],
            projects: newCVData.projects || [],
            certificates: newCVData.certificates || [],
            languages: newCVData.languages || [],
            socialMedia: newCVData.socialMedia || [],
            interests: newCVData.interests || [],
        };

        // Check if regeneration is needed
        const needsRegeneration = shouldRegenerateCVEmbedding(
            oldResumeData,
            newResumeData
        );

        if (!needsRegeneration) {
            return { regenerated: false };
        }

        // Regenerate embedding
        const result = await generateAndSaveEmbedding(resumeId);

        if (!result.success) {
            return { regenerated: false, error: result.error };
        }

        return { regenerated: true };
    } catch (error) {
        console.error("Error checking/regenerating embedding:", error);
        return {
            regenerated: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
