"use client";

import { useCVStore } from "@/stores/cv-store";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Section {
    id: string;
    labelKey: string;
    icon: string;
}

const sections: Section[] = [
    { id: "personal", labelKey: "personalInfo", icon: "👤" },
    { id: "experience", labelKey: "experience", icon: "💼" },
    { id: "education", labelKey: "education", icon: "🎓" },
    { id: "skills", labelKey: "skills", icon: "🛠️" },
    { id: "projects", labelKey: "projects", icon: "📦" },
    { id: "certificates", labelKey: "certificates", icon: "🏆" },
    { id: "languages", labelKey: "languages", icon: "🌍" },
    { id: "social", labelKey: "socialMedia", icon: "🔗" },
    { id: "interests", labelKey: "interests", icon: "⭐" },
];

export function SectionNav() {
    const { activeSection, setActiveSection } = useCVStore();
    const t = useTranslations("cvBuilder.sections");
    const tTitle = useTranslations("cvBuilder");

    return (
        <nav className="py-6">
            <div className="px-4 mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {tTitle("title")}
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
                        <span className="text-sm">{t(section.labelKey)}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
