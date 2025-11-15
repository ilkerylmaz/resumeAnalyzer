interface JobCardProps {
    title: string;
    company: string;
    location: string;
    tags: string[];
    matchScore?: number;
}

export function JobCard({ title, company, location, tags, matchScore }: JobCardProps) {
    return (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div>
                <div className="flex items-start justify-between">
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-50">{title}</p>
                    {matchScore !== undefined && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
                            {matchScore}% Match
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{company}</p>
                <p className="text-sm text-slate-500 dark:text-slate-500">{location}</p>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className="text-xs font-medium bg-primary/10 text-primary py-1 px-2 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* View Job Button */}
            <button className="mt-2 flex h-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                View Job
            </button>
        </div>
    );
}
