"use client";

import { useCVStore } from "@/stores/cv-store";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";

export function TemplateSelector() {
    const { templateId, setTemplateId } = useCVStore();
    const tTemplates = useTranslations("cvBuilder.templates");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const templates = [
        { id: "template-a", name: tTemplates("professional") },
        { id: "template-b", name: tTemplates("traditional") },
        { id: "template-c", name: tTemplates("creative") },
    ];

    const currentTemplate = templates.find((t) => t.id === templateId);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-full border border-[#E9ECEF] dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-[#111418] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            >
                <span className="material-symbols-outlined text-sm">description</span>
                {tTemplates("label")}
                <span className="material-symbols-outlined text-sm">
                    {isOpen ? "expand_less" : "expand_more"}
                </span>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-1  z-50 w-40 border border-[#E9ECEF] dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                    {templates.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => {
                                setTemplateId(template.id);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 ${templateId === template.id
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-[#111418] dark:text-gray-300"
                                }`}
                        >
                            {template.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
