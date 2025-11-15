import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware({
    // A list of all locales that are supported
    locales: ["en", "tr"],

    // Used when no locale matches
    defaultLocale: "en",
});

export async function middleware(request: NextRequest) {
    // First, handle Supabase auth session
    const supabaseResponse = await updateSession(request);

    // If auth middleware returned a redirect, return it
    if (supabaseResponse.status === 307 || supabaseResponse.status === 308) {
        return supabaseResponse;
    }

    // Then handle i18n
    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames
    matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
