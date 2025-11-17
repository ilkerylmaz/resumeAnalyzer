"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

interface UnsavedDraftModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinueDraft: () => void;
    onCreateNew: () => void;
}

export function UnsavedDraftModal({
    isOpen,
    onClose,
    onContinueDraft,
    onCreateNew,
}: UnsavedDraftModalProps) {
    const t = useTranslations("unsavedDraftModal");

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-2xl mx-4 animate-in fade-in zoom-in duration-200">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl text-amber-600 dark:text-amber-400">
                        warning
                    </span>
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
                    {t("title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-8 leading-relaxed">
                    {t("description")}
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    {/* Primary: Continue Draft */}
                    <button
                        onClick={onContinueDraft}
                        className="w-full rounded-lg bg-primary px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
                    >
                        {t("continueDraft")}
                    </button>

                    {/* Danger: Create New (Clear) */}
                    <button
                        onClick={onCreateNew}
                        className="w-full rounded-lg border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-6 py-3.5 text-base font-bold text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                        {t("createNew")}
                    </button>

                    {/* Secondary: Cancel */}
                    <button
                        onClick={onClose}
                        className="w-full rounded-lg px-6 py-3.5 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        {t("cancel")}
                    </button>
                </div>
            </div>
        </div>
    );
}
