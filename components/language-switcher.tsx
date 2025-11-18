"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

export function LanguageSwitcher() {
    const params = useParams();
    const pathname = usePathname();
    const currentLocale = params.locale as string;


    const pathnameWithoutLocale = pathname.replace(`/${currentLocale}`, "") || "/";

    const languages = [
        { code: "en", label: "EN" },
        { code: "tr", label: "TR" },
    ];

    return (
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {languages.map((lang) => (
                <Link
                    key={lang.code}
                    href={`/${lang.code}${pathnameWithoutLocale}`}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${currentLocale === lang.code
                        ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        }`}
                >
                    {lang.label}
                </Link>
            ))}
        </div>
    );
}
