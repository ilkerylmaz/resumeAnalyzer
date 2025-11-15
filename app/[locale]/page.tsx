import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations("landing");

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
            <Navbar />

            <main className="flex flex-col gap-12 sm:gap-16 md:gap-24">
                {/* Hero Section */}
                <section className="px-4 py-16 sm:py-24">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-black leading-tight tracking-tighter text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                            {t("hero.title")}
                        </h1>
                        <p className="mt-6 text-base sm:text-lg font-normal leading-normal text-gray-600 dark:text-gray-400">
                            {t("hero.subtitle")}
                        </p>
                        <div className="mt-10 flex justify-center">
                            <Link
                                href={`/${locale}/auth/signup`}
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90"
                            >
                                <span className="truncate">{t("hero.cta")}</span>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-12 sm:mt-16 mx-auto max-w-4xl">
                        <div
                            className="w-full bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 bg-center bg-no-repeat aspect-[16/9] bg-cover rounded-xl shadow-lg flex items-center justify-center"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80')",
                                backgroundBlendMode: "overlay",
                            }}
                        >
                            <div className="text-center p-8 bg-white/90 dark:bg-gray-800/90 rounded-lg backdrop-blur-sm">
                                <svg
                                    className="w-16 h-16 mx-auto text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <p className="mt-4 font-semibold text-gray-900 dark:text-white">
                                    AI-Powered CV Analysis
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Section */}
                <section className="flex flex-col gap-10 px-4 py-10">
                    <div className="flex flex-col gap-4 text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Why Choose AI CV Pro?
                        </h2>
                        <p className="text-base font-normal leading-normal text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Our platform leverages cutting-edge technology to give you a
                            competitive edge in your job search.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-gray-800 p-6 text-center items-center hover:shadow-lg transition-shadow">
                            <svg
                                className="w-8 h-8 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                            </svg>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-base font-bold leading-tight text-gray-900 dark:text-white">
                                    AI CV Scoring
                                </h3>
                                <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">
                                    Get an instant score on your CV's effectiveness and find out how
                                    to improve it.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-gray-800 p-6 text-center items-center hover:shadow-lg transition-shadow">
                            <svg
                                className="w-8 h-8 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                />
                            </svg>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-base font-bold leading-tight text-gray-900 dark:text-white">
                                    Smart Keyword Suggestions
                                </h3>
                                <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">
                                    Receive AI-driven suggestions for keywords to beat applicant
                                    tracking systems.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-gray-800 p-6 text-center items-center hover:shadow-lg transition-shadow">
                            <svg
                                className="w-8 h-8 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-base font-bold leading-tight text-gray-900 dark:text-white">
                                    Professional Templates
                                </h3>
                                <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">
                                    Choose from a library of professionally designed templates to
                                    make your CV stand out.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-gray-800 p-6 text-center items-center hover:shadow-lg transition-shadow">
                            <svg
                                className="w-8 h-8 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-base font-bold leading-tight text-gray-900 dark:text-white">
                                    Automated Job Matching
                                </h3>
                                <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">
                                    Automatically find job listings that are the perfect fit for
                                    your skills and experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="px-4 py-10">
                    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-12">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 max-w-md mx-auto">
                        <div className="flex flex-col items-center gap-2 pt-1">
                            <svg
                                className="w-6 h-6 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <div className="w-px bg-gray-300 dark:bg-gray-600 grow"></div>
                        </div>
                        <div className="flex flex-1 flex-col pb-12">
                            <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">
                                Step 1
                            </p>
                            <p className="text-lg font-medium leading-normal text-gray-900 dark:text-white">
                                Upload or Build CV
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-px bg-gray-300 dark:bg-gray-600 h-2"></div>
                            <svg
                                className="w-6 h-6 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div className="w-px bg-gray-300 dark:bg-gray-600 grow"></div>
                        </div>
                        <div className="flex flex-1 flex-col pb-12">
                            <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">
                                Step 2
                            </p>
                            <p className="text-lg font-medium leading-normal text-gray-900 dark:text-white">
                                Get AI Feedback & Optimize
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-px bg-gray-300 dark:bg-gray-600 h-2"></div>
                            <svg
                                className="w-6 h-6 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div className="flex flex-1 flex-col">
                            <p className="text-sm font-normal leading-normal text-gray-500 dark:text-gray-400">
                                Step 3
                            </p>
                            <p className="text-lg font-medium leading-normal text-gray-900 dark:text-white">
                                Apply to Matched Jobs
                            </p>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="px-4 py-10 bg-gray-50 dark:bg-gray-800/50">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            What Our Users Say
                        </h2>
                        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="rounded-xl bg-background-light dark:bg-gray-800 p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-400">
                                    "The AI suggestions were a game-changer. I completely revamped my
                                    CV, and the interview requests started pouring in. Increased my
                                    interview requests by 50%!"
                                </p>
                                <div className="mt-6 flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        SL
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            Sarah L.
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Marketing Manager
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl bg-background-light dark:bg-gray-800 p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-400">
                                    "As a recent graduate, building a professional CV was daunting. AI
                                    CV Pro made it incredibly easy with their templates and smart
                                    keyword feature. I landed my first job in a month."
                                </p>
                                <div className="mt-6 flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        JD
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            John D.
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Software Engineer
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="px-4 py-16 sm:py-24 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Ready to Elevate Your Career?
                    </h2>
                    <p className="mt-4 text-base leading-normal text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                        Join thousands of professionals who have transformed their job search. Create
                        your perfect CV today.
                    </p>
                    <div className="mt-8">
                        <Link
                            href={`/${locale}/auth/signup`}
                            className="inline-flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90"
                        >
                            <span className="truncate">Sign Up Now</span>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 dark:border-gray-700 mt-auto">
                <div className="px-4 py-12 mx-auto max-w-5xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <div className="text-primary size-5">
                                    <svg
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                                            fill="currentColor"
                                        ></path>
                                    </svg>
                                </div>
                                <h2 className="text-base font-bold leading-tight">AI CV Pro</h2>
                            </div>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Your career, powered by AI.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Product
                            </h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <Link
                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary"
                                        href="#"
                                    >
                                        CV Builder
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary"
                                        href="#"
                                    >
                                        Job Listings
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Company
                            </h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <Link
                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary"
                                        href="#"
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary"
                                        href="#"
                                    >
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Legal
                            </h3>
                            <ul className="mt-4 space-y-2">
                                <li>
                                    <Link
                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary"
                                        href="#"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary"
                                        href="#"
                                    >
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            © 2025 AI CV Pro. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
