import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CVBuilder } from "@/components/cv-builder/cv-builder";
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
        <>
            <Navbar />
            <CVBuilder locale={locale} />
        </>
    );
}
