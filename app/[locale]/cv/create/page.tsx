import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default async function CVCreatePage({
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

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
            <Navbar />

            <main className="flex h-full grow flex-col">
                <div className="px-4 md:px-8 lg:px-10 flex flex-1 justify-center py-8">
                    <div className="flex flex-col w-full max-w-7xl">
                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 mb-2">
                                Create New Resume
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Build your professional resume step by step
                            </p>
                        </div>

                        {/* Placeholder - CV Builder will be implemented in Phase 5 */}
                        <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <svg
                                    className="w-20 h-20 mx-auto text-slate-400 dark:text-slate-600 mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                                    CV Builder Coming Soon
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6">
                                    The full CV builder with form sections, templates, and real-time preview will be implemented in Phase 5.
                                </p>
                                <div className="text-sm text-slate-500 dark:text-slate-500 space-y-1">
                                    <p>📝 Personal Information</p>
                                    <p>💼 Work Experience</p>
                                    <p>🎓 Education</p>
                                    <p>🛠️ Skills & Projects</p>
                                    <p>📄 Professional Templates</p>
                                    <p>📥 PDF Export</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
