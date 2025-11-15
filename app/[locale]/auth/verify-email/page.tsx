import { useTranslations } from "next-intl";

export default function VerifyEmailPage() {
    const t = useTranslations("auth");

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md text-center space-y-4">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto">
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
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold">
                    {t("verify.title", { default: "Check Your Email" })}
                </h2>
                <p className="text-muted-foreground">
                    {t("verify.message", {
                        default:
                            "We've sent you a confirmation email. Please click the link to verify your account.",
                    })}
                </p>
            </div>
        </div>
    );
}
