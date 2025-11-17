"use client";

import { useCVStore } from "@/stores/cv-store";
import { useTranslations } from "next-intl";

// Template B - Traditional (Two Column Layout)
export function TemplateTraditional() {
    const { personalInfo, experiences, education, skills, projects, certificates, languages, socialMedia, interests } = useCVStore();
    const tPreview = useTranslations("cvBuilder.preview");
    const tLang = useTranslations("cvBuilder.languages");

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-2xl overflow-hidden min-h-[1122px]">
            {/* A4 Size Preview - Two Column Layout */}
            <div className="flex min-h-[1122px]">
                {/* LEFT SIDEBAR */}
                <div className="w-56 bg-gray-50 p-6 border-r border-gray-200">
                    {/* Contact Info */}
                    <div className="mb-6">
                        <h2 className="text-sm font-bold text-gray-900 mb-3 border-b border-primary pb-1">
                            {tPreview("contact")}
                        </h2>
                        <div className="space-y-2 text-xs text-gray-700">
                            <div className="flex items-start gap-2">
                                <span className="text-primary">📧</span>
                                <span className="break-all">{personalInfo.email || "email@example.com"}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-primary">📱</span>
                                <span>{personalInfo.phone || "+1 234 567 8900"}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-primary">📍</span>
                                <span>{personalInfo.location || "City, Country"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    {skills.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-sm font-bold text-gray-900 mb-3 border-b border-primary pb-1">
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
                                                className="text-xs text-gray-600 flex items-center gap-1.5"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
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
                        <div className="mb-6">
                            <h2 className="text-sm font-bold text-gray-900 mb-3 border-b border-primary pb-1">
                                {tPreview("languages")}
                            </h2>
                            <div className="space-y-2">
                                {languages.map((lang) => (
                                    <div key={lang.id} className="text-xs">
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
                        <div className="mb-6">
                            <h2 className="text-sm font-bold text-gray-900 mb-3 border-b border-primary pb-1">
                                {tPreview("socialMedia")}
                            </h2>
                            <div className="space-y-1.5">
                                {socialMedia.map((social) => (
                                    <a
                                        key={social.id}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline text-xs flex items-center gap-1.5"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                        {social.platform}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Interests */}
                    {interests.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-sm font-bold text-gray-900 mb-3 border-b border-primary pb-1">
                                {tPreview("interests")}
                            </h2>
                            <ul className="space-y-1">
                                {interests.map((interest) => (
                                    <li
                                        key={interest.id}
                                        className="text-xs text-gray-600 flex items-center gap-1.5"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                        {interest.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* RIGHT MAIN CONTENT */}
                <div className="flex-1 p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                            {personalInfo.firstName || "First Name"} {personalInfo.lastName || "Last Name"}
                        </h1>
                        <p className="text-lg text-primary font-medium mb-2">
                            {personalInfo.title || "Professional Title"}
                        </p>
                    </div>

                    {/* Summary */}
                    {personalInfo.summary && (
                        <div className="mb-6">
                            <h2 className="text-sm font-bold text-gray-900 mb-2 border-b-2 border-primary pb-1">
                                {tPreview("professionalSummary")}
                            </h2>
                            <p className="text-gray-700 leading-relaxed text-xs whitespace-pre-wrap">
                                {personalInfo.summary}
                            </p>
                        </div>
                    )}

                    {/* Experience */}
                    {experiences.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-sm font-bold text-gray-900 mb-3 border-b-2 border-primary pb-1">
                                {tPreview("workExperience")}
                            </h2>
                            <div className="space-y-3">
                                {experiences.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-start mb-0.5">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm">
                                                    {exp.position}
                                                </h3>
                                                <p className="text-primary font-medium text-xs">{exp.company}</p>
                                            </div>
                                            <span className="text-xs text-gray-600">
                                                {exp.startDate} - {exp.current ? tPreview("present") : exp.endDate}
                                            </span>
                                        </div>
                                        {exp.location && (
                                            <p className="text-xs text-gray-600 mb-1">
                                                📍 {exp.location}
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
                        <div className="mb-6">
                            <h2 className="text-sm font-bold text-gray-900 mb-3 border-b-2 border-primary pb-1">
                                {tPreview("education")}
                            </h2>
                            <div className="space-y-3">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <div className="flex justify-between items-start mb-0.5">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-sm">
                                                    {edu.degree} in {edu.field}
                                                </h3>
                                                <p className="text-primary font-medium text-xs">{edu.institution}</p>
                                            </div>
                                            <span className="text-xs text-gray-600">
                                                {edu.startDate} - {edu.current ? tPreview("present") : edu.endDate}
                                            </span>
                                        </div>
                                        {edu.gpa && (
                                            <p className="text-xs text-gray-600">
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
                        <div className="mb-6">
                            <h2 className="text-sm font-bold text-gray-900 mb-3 border-b-2 border-primary pb-1">
                                {tPreview("projects")}
                            </h2>
                            <div className="space-y-3">
                                {projects.map((project) => (
                                    <div key={project.id}>
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h3 className="font-bold text-gray-900 text-sm">
                                                {project.name}
                                            </h3>
                                            <span className="text-xs text-gray-600">
                                                {project.startDate} - {project.current ? tPreview("present") : project.endDate}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-xs leading-relaxed mb-1 whitespace-pre-wrap">
                                            {project.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mb-1">
                                            {project.technologies.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                        {(project.url || project.github) && (
                                            <div className="flex gap-2 text-xs">
                                                {project.url && (
                                                    <a
                                                        href={project.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline"
                                                    >
                                                        🔗 Demo
                                                    </a>
                                                )}
                                                {project.github && (
                                                    <a
                                                        href={project.github}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline"
                                                    >
                                                        💻 Code
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
                        <div className="mb-6">
                            <h2 className="text-sm font-bold text-gray-900 mb-3 border-b-2 border-primary pb-1">
                                {tPreview("certificates")}
                            </h2>
                            <div className="space-y-2">
                                {certificates.map((cert) => (
                                    <div key={cert.id}>
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
