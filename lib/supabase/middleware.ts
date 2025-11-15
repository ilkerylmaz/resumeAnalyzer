import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    // Ignore "refresh token not found" errors - this is normal for non-authenticated users
    if (error && error.message !== "Refresh Token Not Found") {
        console.error("Auth error:", error);
    }

    // Extract locale from pathname (e.g., /en/dashboard -> en)
    const pathSegments = request.nextUrl.pathname.split("/").filter(Boolean);
    const locale = pathSegments[0] || "en";

    // Public routes that don't require authentication
    const isAuthRoute = request.nextUrl.pathname.includes("/auth");
    const isPublicRoute =
        request.nextUrl.pathname === "/" ||
        request.nextUrl.pathname === `/${locale}` ||
        isAuthRoute;

    if (!user && !isPublicRoute) {
        // Redirect to login page with locale
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/auth/login`;
        return NextResponse.redirect(url);
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse;
}
