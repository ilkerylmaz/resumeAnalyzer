"use client";

import { useCVStore } from "@/stores/cv-store";
import { useTranslations } from "next-intl";

// Template C - Creative (Modern Minimal Design)
export function TemplateCreative() {
    const { personalInfo, experiences, education, skills, projects, certificates, languages, socialMedia, interests } = useCVStore();
    const tPreview = useTranslations("cvBuilder.preview");
    const tLang = useTranslations("cvBuilder.languages");

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-2xl overflow-hidden min-h-[1122px]">
            {/* A4 Size Preview - Creative Minimal Layout */}
            <div className="min-h-[1122px]">
                {/* Header with Colored Background */}
                <div className="bg-primary text-white p-8 mb-6">
                    <h1 className="text-4xl font-bold mb-2">
                        {personalInfo.firstName || "First"} {personalInfo.lastName || "Last"}
                    </h1>
                    <p className="text-xl font-light mb-4 opacity-90">
                        {personalInfo.title || "Professional Title"}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm opacity-90">
                        <span>📧 {personalInfo.email || "email@example.com"}</span>
                        <span>📱 {personalInfo.phone || "+1 234 567 8900"}</span>
                        <span>📍 {personalInfo.location || "City, Country"}</span>
                    </div>
                </div>

                <div className="px-8 pb-8">
                    {/* Summary */}
                    {personalInfo.summary && (
                        <div className="mb-8">
                            <p className="text-gray-700 leading-relaxed text-sm italic whitespace-pre-wrap">
                                "{personalInfo.summary}"
                            </p>
                        </div>
                    )}

                    {/* Two Column Grid */}
                    <div className="grid grid-cols-3 gap-8">
                        {/* Left Column (1/3) */}
                        <div className="space-y-6">
                            {/* Skills */}
                            {skills.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">
                                        {tPreview("skills")}
                                    </h2>
                                    {Object.entries(
                                        skills.reduce((acc, skill) => {
                                            if (!acc[skill.category]) {
                                                acc[skill.category] = [];
                                            }
                                            acc[skill.category].push(skill);
                                            return acc;
                                        }, {} as Record<string, typeof skills>)
                                    ).map(([category, categorySkills]) => (
                                        <div key={category} className="mb-3">
                                            <h3 className="text-xs font-bold text-gray-700 mb-1.5">
                                                {category}
                                            </h3>
                                            <ul className="space-y-1">
                                                {categorySkills.map((skill) => (
                                                    <li
                                                        key={skill.id}
                                                        className="text-xs text-gray-600 pl-3 border-l-2 border-primary/30"
                                                    >
                                                        {skill.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Languages */}
                            {languages.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">
                                        {tPreview("languages")}
                                    </h2>
                                    <div className="space-y-2">
                                        {languages.map((lang) => (
                                            <div key={lang.id} className="text-xs pl-3 border-l-2 border-primary/30">
                                                <div className="font-medium text-gray-900">{lang.name}</div>
                                                <div className="text-gray-600">
                                                    {lang.proficiency === "elementary" ? tLang("levels.elementary") :
                                                        lang.proficiency === "limited" ? tLang("levels.limited") :
                                                            lang.proficiency === "professional" ? tLang("levels.professional") : tLang("levels.native")}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Social Media */}
                            {socialMedia.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">
                                        {tPreview("socialMedia")}
                                    </h2>
                                    <div className="space-y-1.5">
                                        {socialMedia.map((social) => (
                                            <a
                                                key={social.id}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-700 hover:text-primary text-xs block pl-3 border-l-2 border-primary/30"
                                            >
                                                {social.platform}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Interests */}
                            {interests.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">
                                        {tPreview("interests")}
                                    </h2>
                                    <ul className="space-y-1">
                                        {interests.map((interest) => (
                                            <li
                                                key={interest.id}
                                                className="text-xs text-gray-600 pl-3 border-l-2 border-primary/30"
                                            >
                                                {interest.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Right Column (2/3) */}
                        <div className="col-span-2 space-y-6">
                            {/* Experience */}
                            {experiences.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">
                                        {tPreview("workExperience")}
                                    </h2>
                                    <div className="space-y-4">
                                        {experiences.map((exp) => (
                                            <div key={exp.id} className="pl-4 border-l-2 border-primary/20">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-gray-900 text-sm">
                                                        {exp.position}
                                                    </h3>
                                                    <span className="text-xs text-gray-500">
                                                        {exp.startDate} - {exp.current ? tPreview("present") : exp.endDate}
                                                    </span>
                                                </div>
                                                <p className="text-primary font-medium text-xs mb-1">{exp.company}</p>
                                                {exp.location && (
                                                    <p className="text-xs text-gray-500 mb-2">
                                                        {exp.location}
                                                    </p>
                                                )}
                                                {exp.description && (
                                                    <p className="text-gray-700 text-xs leading-relaxed whitespace-pre-wrap">
                                                        {exp.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Education */}
                            {education.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">
                                        {tPreview("education")}
                                    </h2>
                                    <div className="space-y-4">
                                        {education.map((edu) => (
                                            <div key={edu.id} className="pl-4 border-l-2 border-primary/20">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-gray-900 text-sm">
                                                        {edu.degree} in {edu.field}
                                                    </h3>
                                                    <span className="text-xs text-gray-500">
                                                        {edu.startDate} - {edu.current ? tPreview("present") : edu.endDate}
                                                    </span>
                                                </div>
                                                <p className="text-primary font-medium text-xs">{edu.institution}</p>
                                                {edu.gpa && (
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {tPreview("gpa")}: {edu.gpa}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Projects */}
                            {projects.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">
                                        {tPreview("projects")}
                                    </h2>
                                    <div className="space-y-4">
                                        {projects.map((project) => (
                                            <div key={project.id} className="pl-4 border-l-2 border-primary/20">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-bold text-gray-900 text-sm">
                                                        {project.name}
                                                    </h3>
                                                    <span className="text-xs text-gray-500">
                                                        {project.startDate} - {project.current ? tPreview("present") : project.endDate}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700 text-xs leading-relaxed mb-2 whitespace-pre-wrap">
                                                    {project.description}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {project.technologies.map((tech) => (
                                                        <span
                                                            key={tech}
                                                            className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                                {(project.url || project.github) && (
                                                    <div className="flex gap-3 text-xs">
                                                        {project.url && (
                                                            <a
                                                                href={project.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary hover:underline"
                                                            >
                                                                🔗 Live Demo
                                                            </a>
                                                        )}
                                                        {project.github && (
                                                            <a
                                                                href={project.github}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary hover:underline"
                                                            >
                                                                💻 Source Code
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Certificates */}
                            {certificates.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">
                                        {tPreview("certificates")}
                                    </h2>
                                    <div className="space-y-3">
                                        {certificates.map((cert) => (
                                            <div key={cert.id} className="pl-4 border-l-2 border-primary/20">
                                                <h3 className="font-bold text-gray-900 text-sm">
                                                    {cert.name}
                                                </h3>
                                                <p className="text-primary text-xs">{cert.issuer}</p>
                                                <p className="text-xs text-gray-600">
                                                    {tPreview("issued")}: {cert.issueDate}
                                                    {cert.expirationDate && ` • ${tPreview("expires")}: ${cert.expirationDate}`}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Empty State */}
                    {!personalInfo.firstName && experiences.length === 0 && education.length === 0 && (
                        <div className="text-center py-16 text-gray-400">
                            <svg
                                className="w-16 h-16 mx-auto mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <p className="text-lg">{tPreview("emptyState.title")}</p>
                            <p className="text-sm mt-1">{tPreview("emptyState.subtitle")}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
