import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default async function DashboardPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/${locale}/auth/login`);
    }

    const t = await getTranslations("dashboard");

    // Extract first name from email or use email
    const userName = user.email?.split("@")[0] || "User";

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
            <Navbar />

            <main className="flex h-full grow flex-col">
                <div className="px-4 md:px-8 lg:px-10 flex flex-1 justify-center py-8">
                    <div className="flex flex-col w-full max-w-7xl">
                        {/* Page Heading */}
                        <div className="flex flex-wrap justify-between gap-4 p-4">
                            <div className="flex flex-col gap-1">
                                <p className="text-slate-900 dark:text-slate-50 text-3xl font-black tracking-tighter">
                                    Welcome back, {userName}!
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 text-base font-normal">
                                    Here's a summary of your professional profile and opportunities.
                                </p>
                            </div>
                        </div>

                        {/* Layout Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
                            {/* Left Column: Resumes */}
                            <div className="lg:col-span-2 flex flex-col gap-6">
                                {/* Section Header and Button */}
                                <div className="flex justify-between items-center">
                                    <h2 className="text-slate-900 dark:text-slate-50 text-xl font-bold tracking-tight">
                                        My Resumes
                                    </h2>
                                    <Link
                                        href={`/${locale}/cv/create`}
                                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-slate-50 gap-2 text-sm font-bold tracking-wide hover:bg-primary/90 transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                        <span className="truncate">Add New Resume</span>
                                    </Link>
                                </div>

                                {/* Empty State - No CVs Yet */}
                                <div className="flex flex-col items-center justify-center py-16 px-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                                    <svg
                                        className="w-16 h-16 text-slate-400 dark:text-slate-600 mb-4"
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
                                    <p className="text-slate-900 dark:text-slate-50 text-lg font-semibold mb-1">
                                        No resumes yet
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm text-center mb-6 max-w-sm">
                                        Create your first AI-powered resume to get started with job matching and ATS optimization
                                    </p>
                                    <Link
                                        href={`/${locale}/cv/create`}
                                        className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-primary text-slate-50 text-sm font-bold hover:bg-primary/90 transition-colors"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                        Create Your First Resume
                                    </Link>
                                </div>

                                {/* Resume Cards Grid - Hidden until we have data */}
                                {/* Will be populated from database later */}
                            </div>

                            {/* Right Column: Recommended Jobs */}
                            <div className="lg:col-span-1 flex flex-col gap-6">
                                {/* Section Header */}
                                <div className="flex flex-col">
                                    <h2 className="text-slate-900 dark:text-slate-50 text-xl font-bold tracking-tight">
                                        Recommended Jobs For You
                                    </h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                        Create a resume to see personalized job matches
                                    </p>
                                </div>

                                {/* Empty State - No Jobs Yet */}
                                <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                                    <svg
                                        className="w-12 h-12 text-slate-400 dark:text-slate-600 mb-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium text-center">
                                        No job matches yet
                                    </p>
                                    <p className="text-slate-500 dark:text-slate-500 text-xs text-center mt-1">
                                        Upload a resume first
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
