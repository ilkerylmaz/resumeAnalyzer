"use client";

import { useRouter } from "next/navigation";
import { useCVStore } from "@/stores/cv-store";

interface CreateCVButtonProps {
    locale: string;
    variant?: "primary" | "secondary";
    children: React.ReactNode;
}

export function CreateCVButton({ locale, variant = "primary", children }: CreateCVButtonProps) {
    const router = useRouter();
    const { clearCV } = useCVStore();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // Clear any existing CV data and navigate to create page
        clearCV();
        router.push(`/${locale}/cv/create`);
    };

    const baseClasses = variant === "primary"
        ? "flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-primary text-slate-50 text-sm font-bold hover:bg-primary/90 transition-colors"
        : "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-slate-50 gap-2 text-sm font-bold tracking-wide hover:bg-primary/90 transition-colors";

    return (
        <button onClick={handleClick} className={baseClasses}>
            {children}
        </button>
    );
}
