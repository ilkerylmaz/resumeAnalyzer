import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations("landing");

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark antialiased scroll-smooth">
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/40"></div>
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="text-center md:text-left">
                                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                                    Land Your Dream Job with an{" "}
                                    <span className="bg-gradient-to-r from-primary to-accent-pink bg-clip-text text-transparent">
                                        AI-Powered
                                    </span>{" "}
                                    CV
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                    Stop guessing. Start impressing. Our AI analyzes your skills, builds a standout CV, and matches you with perfect-fit jobs.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                    <Link
                                        href={`/${locale}/auth/signup`}
                                        className="bg-primary text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                                    >
                                        Build My CV for Free
                                    </Link>
                                    <a
                                        href="#how-it-works"
                                        className="bg-card-light dark:bg-card-dark text-lg font-semibold px-8 py-4 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
                                    >
                                        See How It Works
                                    </a>
                                </div>
                            </div>
                            <div className="relative flex justify-center items-center">
                                <div className="absolute -inset-4 bg-gradient-to-r from-accent-pink to-accent-teal rounded-xl blur-2xl opacity-30 dark:opacity-20"></div>
                                <img
                                    alt="Pop art style businessman giving a thumbs up"
                                    className="relative max-w-sm w-full h-auto drop-shadow-[4px_4px_0px_rgba(0,0,0,0.5)]"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvzJiJ-cEWM4wEpm2TwHgKv44Qb7rZR4D6xbp_8RndJXNcm5V57aIfAIjFOY1LeNmiiyLFsOtLN-hJaKB57nC-wyh9wcKW5IRbs-PeVlH1ooeY-3W_7jjp2eiVl9_MS-mt-y1bWPL3aF-lQ-rx8-pk0g2rJGp7nsgOLFZFqcKKx3L9j5X5aj-fWrK8jTAmfH2pmVY4VGziM_e4p5i18svA6I4wO8xxW3d79NM3HJnF3ejK4PS5AkIWD3q8Xq3YeDdTe-7BowHWeCM"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Section */}
                <section className="py-20 md:py-28 bg-background-light dark:bg-background-dark" id="features">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                The{" "}
                                <span className="bg-gradient-to-r from-primary to-accent-pink bg-clip-text text-transparent">
                                    Future
                                </span>{" "}
                                of Your Career Starts Here
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Everything you need to go from applicant to interviewee, powered by intelligent technology.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-6">
                                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">AI CV Analysis</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Our AI scans your existing CV or profile to identify strengths, weaknesses, and key skills, suggesting powerful improvements.
                                </p>
                            </div>
                            <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-pink-100 dark:bg-pink-900/50 mb-6">
                                    <svg className="w-8 h-8 text-accent-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Instant CV Building</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Choose from professionally designed templates and let our builder generate a polished, ATS-friendly CV in minutes.
                                </p>
                            </div>
                            <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 dark:bg-teal-900/50 mb-6">
                                    <svg className="w-8 h-8 text-accent-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Smart Job Matching</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Forget endless scrolling. We match your unique skill profile to the best job openings, connecting you directly to opportunity.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-20 md:py-28 bg-blue-50/50 dark:bg-gray-800/50" id="how-it-works">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Hired in 3 Simple Steps</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                From creating your profile to landing interviews, we've streamlined the process.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-10">
                                <div className="flex items-start space-x-6">
                                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white text-2xl font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Upload or Build</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Start with your LinkedIn profile, an existing CV, or build from scratch. Our AI will guide you.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-6">
                                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white text-2xl font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Enhance with AI</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Accept AI-powered suggestions for keywords, phrasing, and formatting to beat the applicant tracking systems.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-6">
                                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white text-2xl font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Apply with Confidence</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Use your new supercharged CV to apply for jobs from our curated list of perfect matches.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <img
                                    alt="Pop art style businessman victoriously riding a sled"
                                    className="max-w-md w-full h-auto drop-shadow-[4px_4px_0px_rgba(0,0,0,0.5)]"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5ap5A8WrcsINuK4KmtlsxBaDtuf6V9GwwaYz3eaCxuutZ-ALe5VunfRIoa3SdqFWINtOJ7aqubE0AzObtJTorFRgq-Jo9fPEWcMSwJWaRdqZuf9I4weI93XBBqFlsRzpbiqXTxzMHtk7kh3_imhILJOd4ti5Dke8pPuzropfbhKwbXDaXM27rsoNCmOoaC0t1bX7maXcrCEpsrxW2V5OtfjR3YQ4mT1_A4zj-4deo1V_xGT-H7LsRPRxBbZfhVrHsaC96Bbk4C98"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-20 md:py-28 bg-background-light dark:bg-background-dark" id="testimonials">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Professionals Worldwide</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Don't just take our word for it. Here's what our users are saying.
                            </p>
                        </div>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-400 mb-6 italic">
                                    "The AI suggestions were a game-changer. I got three interview requests within a week of updating my CV with CareerPop!"
                                </p>
                                <div className="flex items-center">
                                    <img
                                        alt="Profile picture of Sarah L."
                                        className="w-12 h-12 rounded-full mr-4"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxmtKFE7XR1pLO4Idp2mHrctZuRkcwco28TP72og8RMxdgtWiGGEmK15mUe6OLF8upLUDDJwU7RN13zTos5sxAmGH346q0AhTX3qjkwG-jbrqq6NSPdT_CoFlPid9g2b-DMTTDpXZt3sqHqf8hrATcmcb3uo1IzasFoyy13UEZsafBIxHACqnxE6sdtdYLyM_uMA8Q3458ie8Ip_iy8oRg3qMbhbA5ElqtMVOOhqZ3n7UxwGKSZjfi35cqnlrcEJ8Yw-6J_zFN794"
                                    />
                                    <div>
                                        <p className="font-bold">Sarah L.</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Marketing Director</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-primary text-white p-8 rounded-xl shadow-2xl transform lg:scale-105">
                                <p className="mb-6 italic">
                                    "I hated writing CVs. This platform made it fast, easy, and honestly, kind of fun. The job matching feature is incredibly accurate."
                                </p>
                                <div className="flex items-center">
                                    <img
                                        alt="Profile picture of Mark C."
                                        className="w-12 h-12 rounded-full mr-4 border-2 border-white/50"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA5Nd3f3fSi0DGMcsky_n9tpQS6todHsxKC4YhQ3A70O04F_hEc6qDcCFSgFRjf9lbLIfyL_OS2kO-opA_3UwXzEuylaicgoyKMI6lrqnO9d_wb5SMZsWYVUea-ravl7x9Z00Dn9JvIhA6xBQzb9Rkmibp9H3mwy0EFuCAK8hYDjDKxhtbmMzdySF8oytpP23_2dLCEvS8URk43RzWNmYn4ju3om-UXRWrzEP1RL0KJX9Eo6uokQJRSE-2h2sDjYl7XOoBygmX1lM"
                                    />
                                    <div>
                                        <p className="font-bold">Mark C.</p>
                                        <p className="text-sm text-blue-200">Software Engineer</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <p className="text-gray-600 dark:text-gray-400 mb-6 italic">
                                    "As a recent graduate, I was lost. CareerPop helped me translate my academic projects into professional skills that recruiters noticed."
                                </p>
                                <div className="flex items-center">
                                    <img
                                        alt="Profile picture of Jessica Y."
                                        className="w-12 h-12 rounded-full mr-4"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3uBoa_ASs4-LwwA4a7NySYGIMLOt0sAZcl9yNrYsZwYq5043_2JbiR0s0YiONHgmVzucJrhIxuS0r0OgfJG8yKu2lMZIYnoDe8TTG57GI5knFfQv-_UryP3ZUNJAMhzh3hAzZ7W2fqTXlqDEw1WuEr_eP-HelvZFs81pnmf9vIKwLWyhjV-JuX3gn69QIjS4fCSVSxzDmIULqdufxf_DKb7wU-_ojE--dy8ixMtGrcpNymRKTzS4xwPq2hRvrR3-GqSOwpuhGcJ8"
                                    />
                                    <div>
                                        <p className="font-bold">Jessica Y.</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Junior Data Analyst</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="bg-gradient-to-r from-blue-500 to-primary dark:from-blue-800 dark:to-primary/70">
                    <div className="container mx-auto px-6 py-20 text-center">
                        <div className="relative max-w-2xl mx-auto">
                            <img
                                alt="Pop art style businessman welcoming users"
                                className="absolute -top-48 right-1/2 translate-x-1/2 md:-top-40 md:-right-40 md:translate-x-0 w-48 h-auto hidden md:block"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxkftFYLam7UMyTvuehEbYV7ZyOlMOkMM6ELkEL4jAF5lCE9bkByoWoFQrwlZDxbdfg81Qcor_nakwlN0Cr3qLYh_aWLslIS3rcVg28VDwU_ObFueV_HkIjQoZSekqGYtv3XGK0GDZ9sXRmZXdGQPbAM1qmhQTCeYgi8uyR4ZbE3qGe3a27APProA_hg2uCSbU-daVK9MEznwd5L84awTwboS-ruBrH0AfgzrpGVaU61-tSom8y7JLeJNf1W7F2XA-v0y6fOfOSZo"
                            />
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Pop Your Career?</h2>
                            <p className="text-lg text-blue-100 mb-8">
                                Join thousands of professionals who have supercharged their job search. Your next big opportunity is just a click away.
                            </p>
                            <Link
                                href={`/${locale}/auth/signup`}
                                className="bg-white text-primary text-lg font-bold px-10 py-4 rounded-lg shadow-lg hover:bg-gray-100 transition-colors transform hover:scale-105 inline-block"
                            >
                                Start Building for Free
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-card-light dark:bg-card-dark">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 dark:text-gray-400">© 2024 CareerPop. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#">
                                Terms
                            </a>
                            <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#">
                                Privacy
                            </a>
                            <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#">
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
