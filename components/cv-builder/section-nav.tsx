"use client";

import { useCVStore } from "@/stores/cv-store";
import { cn } from "@/lib/utils";

interface Section {
    id: string;
    label: string;
    icon: string;
}

const sections: Section[] = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "skills", label: "Skills", icon: "🛠️" },
    { id: "projects", label: "Projects", icon: "📦" },
    { id: "certificates", label: "Certificates", icon: "🏆" },
    { id: "languages", label: "Languages", icon: "🌍" },
    { id: "social", label: "Social Links", icon: "🔗" },
    { id: "interests", label: "Interests", icon: "⭐" },
];

export function SectionNav() {
    const { activeSection, setActiveSection } = useCVStore();

    return (
        <nav className="py-6">
            <div className="px-4 mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Resume Sections
                </h2>
            </div>
            <div className="space-y-1 px-2">
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                            activeSection === section.id
                                ? "bg-primary text-white font-medium"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                    >
                        <span className="text-lg">{section.icon}</span>
                        <span className="text-sm">{section.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
