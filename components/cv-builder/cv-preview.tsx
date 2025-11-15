"use client";

import { useCVStore } from "@/stores/cv-store";

export function CVPreview() {
    const { personalInfo, experiences, education, skills } = useCVStore();

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-2xl overflow-hidden min-h-[1122px]">
            {/* A4 Size Preview - Scaled down content */}
            <div className="p-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        {personalInfo.firstName || "First Name"} {personalInfo.lastName || "Last Name"}
                    </h1>
                    <p className="text-lg text-primary font-medium mb-3">
                        {personalInfo.title || "Professional Title"}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                        <span>📧 {personalInfo.email || "email@example.com"}</span>
                        <span>📱 {personalInfo.phone || "+1 234 567 8900"}</span>
                        <span>📍 {personalInfo.location || "City, Country"}</span>
                    </div>
                </div>

                {/* Summary */}
                {personalInfo.summary && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 border-b-2 border-primary pb-1">
                            Professional Summary
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                            {personalInfo.summary}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {experiences.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 border-b-2 border-primary pb-1">
                            Work Experience
                        </h2>
                        <div className="space-y-3">
                            {experiences.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-start mb-0.5">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                                                {exp.position}
                                            </h3>
                                            <p className="text-primary font-medium text-sm">{exp.company}</p>
                                        </div>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                            {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                        </span>
                                    </div>
                                    {exp.location && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                            📍 {exp.location}
                                        </p>
                                    )}
                                    {exp.description && (
                                        <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
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
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 border-b-2 border-primary pb-1">
                            Education
                        </h2>
                        <div className="space-y-3">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-start mb-0.5">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                                                {edu.degree} in {edu.field}
                                            </h3>
                                            <p className="text-primary font-medium text-sm">{edu.institution}</p>
                                        </div>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                            {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                                        </span>
                                    </div>
                                    {edu.gpa && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            GPA: {edu.gpa}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 border-b-2 border-primary pb-1">
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                            {skills.map((skill) => (
                                <span
                                    key={skill.id}
                                    className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                                >
                                    {skill.name}
                                </span>
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
                        <p className="text-lg">Start filling out your resume</p>
                        <p className="text-sm mt-1">Your changes will appear here in real-time</p>
                    </div>
                )}
            </div>
        </div>
    );
}
