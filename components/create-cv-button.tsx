"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCVStore } from "@/stores/cv-store";
import { UnsavedDraftModal } from "./unsaved-draft-modal";
import Link from "next/link";

interface CreateCVButtonProps {
    locale: string;
    variant?: "primary" | "secondary";
    children: React.ReactNode;
}

export function CreateCVButton({ locale, variant = "primary", children }: CreateCVButtonProps) {
    const router = useRouter();
    const { clearCV } = useCVStore();
    const [showModal, setShowModal] = useState(false);
    const [hasUnsavedDraft, setHasUnsavedDraft] = useState(false);

    // Check if there's unsaved data in localStorage
    useEffect(() => {
        const checkDraft = () => {
            if (typeof window === "undefined") return;

            const stored = localStorage.getItem("cv-storage");
            if (!stored) {
                setHasUnsavedDraft(false);
                return;
            }

            try {
                const parsed = JSON.parse(stored);
                const state = parsed?.state;

                // Check if there's any actual CV data (not just initial state)
                const hasData =
                    state?.resumeId ||
                    state?.personalInfo?.firstName ||
                    state?.experiences?.length > 0 ||
                    state?.education?.length > 0 ||
                    state?.skills?.length > 0 ||
                    state?.projects?.length > 0;

                setHasUnsavedDraft(!!hasData);
            } catch {
                setHasUnsavedDraft(false);
            }
        };

        checkDraft();
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();

        if (hasUnsavedDraft) {
            setShowModal(true);
        } else {
            router.push(`/${locale}/cv/create`);
        }
    };

    const handleContinueDraft = () => {
        setShowModal(false);
        router.push(`/${locale}/cv/create`);
    };

    const handleCreateNew = () => {
        clearCV();
        setShowModal(false);
        setHasUnsavedDraft(false);
        router.push(`/${locale}/cv/create`);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const baseClasses = variant === "primary"
        ? "flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-primary text-slate-50 text-sm font-bold hover:bg-primary/90 transition-colors"
        : "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-slate-50 gap-2 text-sm font-bold tracking-wide hover:bg-primary/90 transition-colors";

    return (
        <>
            <button onClick={handleClick} className={baseClasses}>
                {children}
            </button>

            <UnsavedDraftModal
                isOpen={showModal}
                onClose={handleCancel}
                onContinueDraft={handleContinueDraft}
                onCreateNew={handleCreateNew}
            />
        </>
    );
}
