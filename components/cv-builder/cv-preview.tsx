"use client";

import { forwardRef } from "react";
import { useCVStore } from "@/stores/cv-store";
import { TemplateProfessional } from "./templates/template-professional";
import { TemplateTraditional } from "./templates/template-traditional";
import { TemplateCreative } from "./templates/template-creative";

export const CVPreview = forwardRef<HTMLDivElement>((props, ref) => {
    const { templateId } = useCVStore();

    const templates = [
        { id: "template-a", component: TemplateProfessional },
        { id: "template-b", component: TemplateTraditional },
        { id: "template-c", component: TemplateCreative },
    ];

    const CurrentTemplate = templates.find((t) => t.id === templateId)?.component || TemplateProfessional;

    return (
        <div ref={ref} className="print:shadow-none">
            <CurrentTemplate />
        </div>
    );
});

CVPreview.displayName = "CVPreview";
