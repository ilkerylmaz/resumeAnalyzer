"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function SignupPage() {
    const t = useTranslations("auth");
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        // Validate name fields
        if (!firstName.trim() || !lastName.trim()) {
            setError("First name and last name are required");
            setLoading(false);
            return;
        }

        const supabase = createClient();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/${locale}/dashboard`,
                data: {
                    preferred_language: locale,
                    full_name: `${firstName.trim()} ${lastName.trim()}`,
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        // Check if email confirmation is required
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            setError("This email is already registered. Please log in instead.");
            setLoading(false);
            return;
        }

        // Insert or update user in users table
        if (data.user) {
            try {
                const { error: dbError } = await supabase.from("users").upsert(
                    {
                        id: data.user.id,
                        first_name: firstName.trim(),
                        last_name: lastName.trim(),
                        preferred_language: locale,
                    },
                    {
                        onConflict: "id",
                    }
                );

                if (dbError) {
                    console.error("Error saving user data:", dbError);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            }
        }

        if (data.session) {
            // Email confirmation disabled, user is logged in
            router.push(`/${locale}/dashboard`);
        } else {
            // Email confirmation enabled, redirect to verify page
            router.push(`/${locale}/auth/verify-email`);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">
                        {t("signup.title", { default: "Create Account" })}
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        {t("signup.subtitle", { default: "Start building your CV today" })}
                    </p>
                </div>

                <form onSubmit={handleSignup} className="mt-8 space-y-6">
                    {error && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="John"
                                />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                {t("email", { default: "Email" })}
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                {t("password.label", { default: "Password" })}
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="••••••••"
                                minLength={6}
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                                {t("password.hint", { default: "At least 6 characters" })}
                            </p>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                        {loading
                            ? t("signup.loading", { default: "Creating account..." })
                            : t("signup.button", { default: "Sign Up" })}
                    </button>

                    <p className="text-center text-sm text-muted-foreground">
                        {t("signup.hasAccount", { default: "Already have an account?" })}{" "}
                        <Link
                            href={`/${locale}/auth/login`}
                            className="font-medium text-primary hover:underline"
                        >
                            {t("login.link", { default: "Log in" })}
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
