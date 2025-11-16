"use client";

import { useCVStore } from "@/stores/cv-store";
import { PersonalInfoForm } from "./forms/personal-info-form";
import { ExperienceForm } from "./forms/experience-form";
import { EducationForm } from "./forms/education-form";
import { SkillsForm } from "./forms/skills-form";
import { ProjectsForm } from "./forms/projects-form";
import { CertificatesForm } from "./forms/certificates-form";
import { LanguagesForm } from "./forms/languages-form";
import { SocialMediaForm } from "./forms/social-media-form";
import { InterestsForm } from "./forms/interests-form";
import { CVPreview } from "./cv-preview";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CVBuilderProps {
    locale: string;
}

interface Section {
    id: string;
    labelKey: string;
}

const sections: Section[] = [
    { id: "personal", labelKey: "personalInfo" },
    { id: "experience", labelKey: "experience" },
    { id: "education", labelKey: "education" },
    { id: "skills", labelKey: "skills" },
    { id: "projects", labelKey: "projects" },
    { id: "certificates", labelKey: "certificates" },
    { id: "languages", labelKey: "languages" },
    { id: "social", labelKey: "socialMedia" },
    { id: "interests", labelKey: "interests" },
];

export function CVBuilder({ locale }: CVBuilderProps) {
    const { activeSection, setActiveSection } = useCVStore();
    const t = useTranslations("cvBuilder");
    const tSections = useTranslations("cvBuilder.sections");
    const tNav = useTranslations("cvBuilder.navigation");
    const tActions = useTranslations("cvBuilder.actions");

    const currentIndex = sections.findIndex((s) => s.id === activeSection);

    const handleNext = () => {
        if (currentIndex < sections.length - 1) {
            setActiveSection(sections[currentIndex + 1].id);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setActiveSection(sections[currentIndex - 1].id);
        }
    };

    const renderForm = () => {
        switch (activeSection) {
            case "personal":
                return <PersonalInfoForm />;
            case "experience":
                return <ExperienceForm />;
            case "education":
                return <EducationForm />;
            case "skills":
                return <SkillsForm />;
            case "projects":
                return <ProjectsForm />;
            case "certificates":
                return <CertificatesForm />;
            case "languages":
                return <LanguagesForm />;
            case "social":
                return <SocialMediaForm />;
            case "interests":
                return <InterestsForm />;
            default:
                return <PersonalInfoForm />;
        }
    };

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <div className="flex h-full min-h-screen w-full grow flex-row">
                {/* Left Sidebar - Column 1 (Narrow) */}
                <div className="flex h-full min-h-screen w-16 flex-col items-center border-r border-[#E9ECEF] dark:border-gray-700 bg-white dark:bg-background-dark p-3">
                    <div className="flex flex-col gap-4 items-center">
                        {/* Logo */}


                        {/* Navigation Items */}
                        <div className="flex flex-col gap-2 pt-8">
                            <a className="flex flex-col items-center gap-1.5 p-2 rounded text-primary bg-primary/10" href="#">
                                <span className="material-symbols-outlined">description</span>
                                <span className="text-[11px] font-medium leading-none">{tNav("edit")}</span>
                            </a>
                            <a className="flex flex-col items-center gap-1.5 p-2 rounded text-[#617289] dark:text-gray-400 hover:bg-primary/10 hover:text-primary" href="#">
                                <span className="material-symbols-outlined">auto_awesome</span>
                                <span className="text-[11px] font-medium leading-none">{tNav("ats")}</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Middle Panel - Form Area - Column 2 (Narrow, Fixed Height, Internal Scroll) */}
                <div className="flex w-80 h-screen flex-col border-r border-[#E9ECEF] dark:border-gray-700 bg-white dark:bg-background-dark">
                    <div className="flex flex-col h-full overflow-hidden">
                        {/* Tab Navigation */}
                        <div className="pb-3 px-6 pt-6 flex-shrink-0">
                            <div className="flex border-b border-[#E9ECEF] dark:border-gray-700 gap-8 overflow-x-auto">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={cn(
                                            "flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 whitespace-nowrap transition-colors",
                                            activeSection === section.id
                                                ? "border-b-primary text-primary"
                                                : "border-b-transparent text-[#617289] dark:text-gray-400 hover:text-primary"
                                        )}
                                    >
                                        <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                                            {tSections(section.labelKey)}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Form Content - Scrollable */}
                        <div className="flex flex-col gap-4 py-6 px-6 flex-1 overflow-y-auto custom-scrollbar">
                            {renderForm()}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-6 px-6 pb-6 border-t border-[#E9ECEF] dark:border-gray-700 flex-shrink-0">
                            <button
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                className="rounded-full px-6 py-3 text-sm font-bold text-[#617289] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {tNav("previous")}
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentIndex === sections.length - 1}
                                className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {tNav("next")}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Preview Area - Column 3 (WIDE - Dominant, Full Height) */}
                <div className="flex flex-1 flex-col h-screen overflow-hidden">
                    {/* Preview Toolbar - Single Slim Row */}
                    <div className="flex items-center justify-between px-8 py-3 border-b border-[#E9ECEF] dark:border-gray-700 bg-white dark:bg-background-dark flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 rounded-full border border-[#E9ECEF] dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                                <span className="material-symbols-outlined text-sm">swap_vert</span>
                                {tActions("reorder")}
                            </button>
                            <button className="flex items-center gap-2 rounded-full border border-[#E9ECEF] dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700">
                                <span className="material-symbols-outlined text-sm">style</span>
                                {tActions("style")}
                            </button>
                        </div>

                        {/* ATS Score Indicator - Compact */}
                        <div className="relative flex items-center justify-center size-12">
                            <svg className="absolute inset-0" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{ stopColor: "#E040FB", stopOpacity: 1 }} />
                                        <stop offset="100%" style={{ stopColor: "#2b7cee", stopOpacity: 1 }} />
                                    </linearGradient>
                                </defs>
                                <circle className="dark:stroke-gray-700" cx="50" cy="50" r="45" fill="none" stroke="#E9ECEF" strokeWidth="10" />
                                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#scoreGradient)" strokeDasharray="282.6" strokeDashoffset="36.738" strokeLinecap="round" strokeWidth="10" />
                            </svg>
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-bold text-[#111418] dark:text-white">87</span>
                                <span className="text-[8px] text-[#617289] dark:text-gray-400">{t("atsScore.label")}</span>
                            </div>
                        </div>
                    </div>

                    {/* CV Preview - Scrollable with Scaled Content */}
                    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
                        <div className="scale-90 origin-top">
                            <CVPreview />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Actions - Column 4 (Narrow, Fixed Height) */}
                <div className="flex w-56 h-screen flex-col border-l border-[#E9ECEF] dark:border-gray-700 bg-white dark:bg-background-dark p-6 overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        {/* Download Button */}
                        <button className="w-full rounded-full bg-primary px-4 py-3 text-base font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90">
                            {tActions("download")}
                        </button>

                        {/* Save/Duplicate Actions */}
                        <div className="flex flex-col gap-2 pt-4">
                            <a className="flex items-center gap-3 rounded p-3 text-[#111418] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" href="#">
                                <span className="material-symbols-outlined text-xl text-[#617289] dark:text-gray-400">save</span>
                                <span className="text-sm font-medium">{tActions("save")}</span>
                            </a>
                            <a className="flex items-center gap-3 rounded p-3 text-[#111418] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" href="#">
                                <span className="material-symbols-outlined text-xl text-[#617289] dark:text-gray-400">content_copy</span>
                                <span className="text-sm font-medium">{tActions("duplicate")}</span>
                            </a>
                        </div>

                        {/* Divider */}
                        <div className="w-full border-t border-[#E9ECEF] dark:border-gray-700 my-2"></div>

                        {/* AI Features */}
                        <div className="flex flex-col gap-2">
                            <a className="flex items-center gap-3 rounded p-3 text-[#111418] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" href="#">
                                <span className="material-symbols-outlined text-xl text-pop-secondary">auto_awesome</span>
                                <span className="text-sm font-medium">{tActions("rewriteAI")}</span>
                            </a>
                            <a className="flex items-center gap-3 rounded p-3 text-[#111418] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" href="#">
                                <span className="material-symbols-outlined text-xl text-pop-secondary">mail</span>
                                <span className="text-sm font-medium">{tActions("coverLetter")}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
