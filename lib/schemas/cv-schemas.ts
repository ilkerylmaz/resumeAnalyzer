import { z } from "zod";

// Personal Info Schema
export const personalInfoSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required").max(20),
    location: z.string().min(1, "Location is required").max(100),
    title: z.string().min(1, "Professional title is required").max(100),
    summary: z.string().max(500, "Summary must be 500 characters or less").optional(),
});

// Experience Schema
export const experienceSchema = z.object({
    id: z.string(),
    company: z.string().min(1, "Company name is required").max(100),
    position: z.string().min(1, "Position is required").max(100),
    location: z.string().max(100).optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    description: z.string().max(1000, "Description must be 1000 characters or less").optional(),
}).refine(
    (data) => {
        if (!data.current && !data.endDate) {
            return false;
        }
        return true;
    },
    {
        message: "Halen çalışmıyorsanız bitiş tarihi gereklidir",
        path: ["endDate"],
    }
).refine(
    (data) => {
        if (!data.current && data.endDate && data.startDate) {
            return data.endDate >= data.startDate;
        }
        return true;
    },
    {
        message: "Bitiş tarihi başlangıç tarihinden önce olamaz",
        path: ["endDate"],
    }
);

// Education Schema
export const educationSchema = z.object({
    id: z.string(),
    institution: z.string().min(1, "Institution name is required").max(100),
    degree: z.string().min(1, "Degree is required").max(100),
    field: z.string().min(1, "Field of study is required").max(100),
    location: z.string().max(100).optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    gpa: z.string().max(10).optional(),
    description: z.string().max(500).optional(),
}).refine(
    (data) => {
        if (!data.current && !data.endDate) {
            return false;
        }
        return true;
    },
    {
        message: "Halen okumuyorsanız bitiş tarihi gereklidir",
        path: ["endDate"],
    }
).refine(
    (data) => {
        if (!data.current && data.endDate && data.startDate) {
            return data.endDate >= data.startDate;
        }
        return true;
    },
    {
        message: "Bitiş tarihi başlangıç tarihinden önce olamaz",
        path: ["endDate"],
    }
);

// Skill Schema
export const skillSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Skill name is required").max(50),
    category: z.string().min(1, "Category is required").max(50),
    proficiency: z.enum(["beginner", "intermediate", "advanced", "expert"]).refine(
        (val) => ["beginner", "intermediate", "advanced", "expert"].includes(val),
        { message: "Please select a proficiency level" }
    ),
});

// Project Schema
export const projectSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Project name is required").max(100),
    description: z.string().min(1, "Description is required").max(1000),
    technologies: z.array(z.string()).min(1, "Add at least one technology"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    url: z.string().url("Invalid URL").optional().or(z.literal("")),
    github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
}).refine(
    (data) => {
        if (!data.current && !data.endDate) {
            return false;
        }
        return true;
    },
    {
        message: "Halen üzerinde çalışmıyorsanız bitiş tarihi gereklidir",
        path: ["endDate"],
    }
).refine(
    (data) => {
        if (!data.current && data.endDate && data.startDate) {
            return data.endDate >= data.startDate;
        }
        return true;
    },
    {
        message: "Bitiş tarihi başlangıç tarihinden önce olamaz",
        path: ["endDate"],
    }
);

// Certificate Schema
export const certificateSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Certificate name is required").max(100),
    issuer: z.string().min(1, "Issuer is required").max(100),
    issueDate: z.string().min(1, "Issue date is required"),
    expirationDate: z.string().optional(),
    credentialId: z.string().max(100).optional(),
    url: z.string().url("Invalid URL").optional().or(z.literal("")),
}).refine(
    (data) => {
        if (data.expirationDate && data.issueDate) {
            return data.expirationDate >= data.issueDate;
        }
        return true;
    },
    {
        message: "Son kullanma tarihi veriliş tarihinden önce olamaz",
        path: ["expirationDate"],
    }
);

// Language Schema
export const languageSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Language name is required").max(50),
    proficiency: z.enum(["elementary", "limited", "professional", "native"]).refine(
        (val) => ["elementary", "limited", "professional", "native"].includes(val),
        { message: "Please select a proficiency level" }
    ),
});

// Social Media Schema
export const socialMediaSchema = z.object({
    id: z.string(),
    platform: z.string().min(1, "Platform is required").max(50),
    url: z.string().url("Invalid URL").min(1, "URL is required"),
});

// Interest Schema
export const interestSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Interest name is required").max(50),
});

// Complete CV Schema (for validation before save)
export const completeCVSchema = z.object({
    personalInfo: personalInfoSchema,
    experiences: z.array(experienceSchema),
    education: z.array(educationSchema),
    skills: z.array(skillSchema),
    projects: z.array(projectSchema),
    certificates: z.array(certificateSchema),
    languages: z.array(languageSchema),
    socialMedia: z.array(socialMediaSchema),
    interests: z.array(interestSchema),
});

// Export types
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type CertificateInput = z.infer<typeof certificateSchema>;
export type LanguageInput = z.infer<typeof languageSchema>;
export type SocialMediaInput = z.infer<typeof socialMediaSchema>;
export type InterestInput = z.infer<typeof interestSchema>;
export type CompleteCVInput = z.infer<typeof completeCVSchema>;
