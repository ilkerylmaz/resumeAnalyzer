import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Types for CV data structure
export interface PersonalInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa?: string;
    description?: string;
}

export interface Skill {
    id: string;
    name: string;
    category: string;
    proficiency: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface Project {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    startDate: string;
    endDate: string;
    current: boolean;
    url?: string;
    github?: string;
}

export interface Certificate {
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expirationDate?: string;
    credentialId?: string;
    url?: string;
}

export interface Language {
    id: string;
    name: string;
    proficiency: "elementary" | "limited" | "professional" | "native";
}

export interface SocialMedia {
    id: string;
    platform: string;
    url: string;
}

export interface Interest {
    id: string;
    name: string;
}

export interface CVState {
    // Resume metadata
    resumeId?: string;
    templateId: string;
    isPrimary: boolean;

    // CV sections
    personalInfo: PersonalInfo;
    experiences: Experience[];
    education: Education[];
    skills: Skill[];
    projects: Project[];
    certificates: Certificate[];
    languages: Language[];
    socialMedia: SocialMedia[];
    interests: Interest[];

    // UI state
    activeSection: string;
    isSaving: boolean;
    lastSaved?: Date;

    // Actions
    setResumeId: (id: string) => void;
    setTemplateId: (id: string) => void;
    setIsPrimary: (isPrimary: boolean) => void;

    updatePersonalInfo: (data: Partial<PersonalInfo>) => void;

    addExperience: (experience: Experience) => void;
    updateExperience: (id: string, data: Partial<Experience>) => void;
    removeExperience: (id: string) => void;

    addEducation: (education: Education) => void;
    updateEducation: (id: string, data: Partial<Education>) => void;
    removeEducation: (id: string) => void;

    addSkill: (skill: Skill) => void;
    updateSkill: (id: string, data: Partial<Skill>) => void;
    removeSkill: (id: string) => void;

    addProject: (project: Project) => void;
    updateProject: (id: string, data: Partial<Project>) => void;
    removeProject: (id: string) => void;

    addCertificate: (certificate: Certificate) => void;
    updateCertificate: (id: string, data: Partial<Certificate>) => void;
    removeCertificate: (id: string) => void;

    addLanguage: (language: Language) => void;
    updateLanguage: (id: string, data: Partial<Language>) => void;
    removeLanguage: (id: string) => void;

    addSocialMedia: (social: SocialMedia) => void;
    updateSocialMedia: (id: string, data: Partial<SocialMedia>) => void;
    removeSocialMedia: (id: string) => void;

    addInterest: (interest: Interest) => void;
    updateInterest: (id: string, data: Partial<Interest>) => void;
    removeInterest: (id: string) => void;

    setActiveSection: (section: string) => void;
    setIsSaving: (isSaving: boolean) => void;
    setLastSaved: (date: Date) => void;

    loadCV: (data: Partial<CVState>) => void;
    resetCV: () => void;
}

const initialPersonalInfo: PersonalInfo = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    summary: "",
};

const initialState = {
    templateId: "template-a",
    isPrimary: false,
    personalInfo: initialPersonalInfo,
    experiences: [],
    education: [],
    skills: [],
    projects: [],
    certificates: [],
    languages: [],
    socialMedia: [],
    interests: [],
    activeSection: "personal",
    isSaving: false,
    lastSaved: undefined,
};

export const useCVStore = create<CVState>()(
    devtools(
        persist(
            (set) => ({
                ...initialState,

                setResumeId: (id) => set({ resumeId: id }),
                setTemplateId: (id) => set({ templateId: id }),
                setIsPrimary: (isPrimary) => set({ isPrimary }),

                updatePersonalInfo: (data) =>
                    set((state) => ({
                        personalInfo: { ...state.personalInfo, ...data },
                    })),

                addExperience: (experience) =>
                    set((state) => ({
                        experiences: [...state.experiences, experience],
                    })),
                updateExperience: (id, data) =>
                    set((state) => ({
                        experiences: state.experiences.map((exp) =>
                            exp.id === id ? { ...exp, ...data } : exp
                        ),
                    })),
                removeExperience: (id) =>
                    set((state) => ({
                        experiences: state.experiences.filter((exp) => exp.id !== id),
                    })),

                addEducation: (education) =>
                    set((state) => ({
                        education: [...state.education, education],
                    })),
                updateEducation: (id, data) =>
                    set((state) => ({
                        education: state.education.map((edu) =>
                            edu.id === id ? { ...edu, ...data } : edu
                        ),
                    })),
                removeEducation: (id) =>
                    set((state) => ({
                        education: state.education.filter((edu) => edu.id !== id),
                    })),

                addSkill: (skill) =>
                    set((state) => ({
                        skills: [...state.skills, skill],
                    })),
                updateSkill: (id, data) =>
                    set((state) => ({
                        skills: state.skills.map((skill) =>
                            skill.id === id ? { ...skill, ...data } : skill
                        ),
                    })),
                removeSkill: (id) =>
                    set((state) => ({
                        skills: state.skills.filter((skill) => skill.id !== id),
                    })),

                addProject: (project) =>
                    set((state) => ({
                        projects: [...state.projects, project],
                    })),
                updateProject: (id, data) =>
                    set((state) => ({
                        projects: state.projects.map((project) =>
                            project.id === id ? { ...project, ...data } : project
                        ),
                    })),
                removeProject: (id) =>
                    set((state) => ({
                        projects: state.projects.filter((project) => project.id !== id),
                    })),

                addCertificate: (certificate) =>
                    set((state) => ({
                        certificates: [...state.certificates, certificate],
                    })),
                updateCertificate: (id, data) =>
                    set((state) => ({
                        certificates: state.certificates.map((cert) =>
                            cert.id === id ? { ...cert, ...data } : cert
                        ),
                    })),
                removeCertificate: (id) =>
                    set((state) => ({
                        certificates: state.certificates.filter((cert) => cert.id !== id),
                    })),

                addLanguage: (language) =>
                    set((state) => ({
                        languages: [...state.languages, language],
                    })),
                updateLanguage: (id, data) =>
                    set((state) => ({
                        languages: state.languages.map((lang) =>
                            lang.id === id ? { ...lang, ...data } : lang
                        ),
                    })),
                removeLanguage: (id) =>
                    set((state) => ({
                        languages: state.languages.filter((lang) => lang.id !== id),
                    })),

                addSocialMedia: (social) =>
                    set((state) => ({
                        socialMedia: [...state.socialMedia, social],
                    })),
                updateSocialMedia: (id, data) =>
                    set((state) => ({
                        socialMedia: state.socialMedia.map((social) =>
                            social.id === id ? { ...social, ...data } : social
                        ),
                    })),
                removeSocialMedia: (id) =>
                    set((state) => ({
                        socialMedia: state.socialMedia.filter((social) => social.id !== id),
                    })),

                addInterest: (interest) =>
                    set((state) => ({
                        interests: [...state.interests, interest],
                    })),
                updateInterest: (id, data) =>
                    set((state) => ({
                        interests: state.interests.map((int) =>
                            int.id === id ? { ...int, ...data } : int
                        ),
                    })),
                removeInterest: (id) =>
                    set((state) => ({
                        interests: state.interests.filter((int) => int.id !== id),
                    })),

                setActiveSection: (section) => set({ activeSection: section }),
                setIsSaving: (isSaving) => set({ isSaving }),
                setLastSaved: (date) => set({ lastSaved: date }),

                loadCV: (data) => set((state) => ({ ...state, ...data })),
                resetCV: () => set(initialState),
            }),
            {
                name: "cv-storage",
                partialize: (state) => ({
                    personalInfo: state.personalInfo,
                    experiences: state.experiences,
                    education: state.education,
                    skills: state.skills,
                    projects: state.projects,
                    certificates: state.certificates,
                    languages: state.languages,
                    socialMedia: state.socialMedia,
                    interests: state.interests,
                    templateId: state.templateId,
                }),
            }
        )
    )
);
