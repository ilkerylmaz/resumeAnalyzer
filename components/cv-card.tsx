import Link from "next/link";

interface CVCardProps {
    id: string;
    title: string;
    lastEdited: string;
    atsScore?: number;
    isPrimary?: boolean;
    locale: string;
}

export function CVCard({ id, title, lastEdited, atsScore, isPrimary, locale }: CVCardProps) {

    const getScoreColor = (score?: number) => {
        if (!score) return "text-slate-500";
        if (score >= 90) return "text-primary";
        if (score >= 80) return "text-amber-500";
        return "text-red-500";
    };

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900/50 hover:shadow-lg transition-shadow">
            {/* CV Preview Placeholder */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 aspect-[3/4] rounded-lg flex items-center justify-center">
                <svg
                    className="w-16 h-16 text-slate-400 dark:text-slate-600"
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
            </div>

            {/* CV Info */}
            <div className="flex-grow">
                <div className="flex items-start justify-between mb-1">
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-50">{title}</p>
                    {isPrimary && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                            Primary
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Last edited: {lastEdited}</p>
                {atsScore !== undefined && (
                    <p className={`text-sm font-medium mt-1 ${getScoreColor(atsScore)}`}>
                        ATS Score: {atsScore}%
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 text-slate-600 dark:text-slate-300">
                <Link
                    href={`/${locale}/cv/edit/${id}`}
                    className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                    title="Edit"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                </Link>
                <button
                    className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors"
                    title="Download"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                </button>
                <button
                    className="h-8 w-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center transition-colors"
                    title="Delete"
                >
                    <svg className="w-5 h-5 text-red-500/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
