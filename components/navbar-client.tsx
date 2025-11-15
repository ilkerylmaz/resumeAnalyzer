"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { LanguageSwitcher } from "./language-switcher";
import type { User } from "@supabase/supabase-js";
import { useState } from "react";

export function NavbarClient({ user }: { user: User | null }) {
    const params = useParams();
    const locale = params.locale as string;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Extract initials from user metadata or email
    const getInitials = () => {
        if (!user) return "U";

        // Try to get full name from user metadata
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
        if (fullName) {
            const names = fullName.split(" ");
            if (names.length >= 2) {
                return (names[0][0] + names[names.length - 1][0]).toUpperCase();
            }
            return fullName.substring(0, 2).toUpperCase();
        }

        // Fallback to email initials
        if (user.email) {
            const emailName = user.email.split("@")[0];
            if (emailName.length >= 2) {
                return emailName.substring(0, 2).toUpperCase();
            }
            return emailName[0].toUpperCase();
        }

        return "U";
    };

    const initials = getInitials();

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-4 sm:px-10 py-3 bg-background-light dark:bg-background-dark">
            <div className="flex items-center gap-4 text-gray-900 dark:text-white">
                <div className="text-primary size-6">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                </div>
                <Link href={`/${locale}`}>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">AI CV Pro</h2>
                </Link>
            </div>
            <div className="flex flex-1 justify-end items-center gap-8">
                <div className="hidden sm:flex items-center gap-9">
                    <Link
                        className="text-sm font-medium leading-normal text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                        href={`/${locale}/cv/create`}
                    >
                        CV Builder
                    </Link>
                    <Link
                        className="text-sm font-medium leading-normal text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                        href="#"
                    >
                        Job Listings
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />

                    {user ? (
                        // Logged in: Show user avatar dropdown
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                                    {initials}
                                </div>
                                <svg
                                    className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <>
                                    {/* Backdrop to close dropdown */}
                                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />

                                    {/* Dropdown menu */}
                                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
                                        {/* User Info Header */}
                                        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                                                    {initials}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                                        {user?.user_metadata?.full_name || user?.user_metadata?.name || "User"}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                        {user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/${locale}/dashboard`}
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Dashboard</span>
                                        </Link>
                                        <hr className="border-slate-200 dark:border-slate-700" />
                                        <form action={`/${locale}/auth/signout`} method="post">
                                            <button
                                                type="submit"
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                                            >
                                                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                <span className="text-sm font-medium text-red-600 dark:text-red-400">Sign Out</span>
                                            </button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        // Not logged in: Show Login and Sign Up buttons
                        <>
                            <Link
                                href={`/${locale}/auth/login`}
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                <span className="truncate">Log In</span>
                            </Link>
                            <Link
                                href={`/${locale}/auth/signup`}
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
                            >
                                <span className="truncate">Sign Up</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
