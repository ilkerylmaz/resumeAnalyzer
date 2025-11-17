"use client";

import { useCVStore } from "@/stores/cv-store";
import { useTranslations } from "next-intl";
import { TemplateProfessional } from "./templates/template-professional";
import { TemplateTraditional } from "./templates/template-traditional";
import { TemplateCreative } from "./templates/template-creative";

export function CVPreview() {
    const { templateId, setTemplateId } = useCVStore();
    const tTemplates = useTranslations("cvBuilder.templates");

    const templates = [
        { id: "template-a", name: tTemplates("professional"), component: TemplateProfessional },
        { id: "template-b", name: tTemplates("traditional"), component: TemplateTraditional },
        { id: "template-c", name: tTemplates("creative"), component: TemplateCreative },
    ];

    const CurrentTemplate = templates.find((t) => t.id === templateId)?.component || TemplateProfessional;

    return (
        <div className="h-full flex flex-col">
            {/* Template Switcher Toolbar */}
            <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">{tTemplates("label")}:</span>
                    <div className="flex gap-1">
                        {templates.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => setTemplateId(template.id)}
                                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${templateId === template.id
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {template.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Template Preview */}
            <div className="flex-1 overflow-auto p-6 bg-gray-100">
                <CurrentTemplate />
            </div>
        </div>
    );
}

