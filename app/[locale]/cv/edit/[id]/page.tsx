import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CVBuilder } from "@/components/cv-builder/cv-builder";
import { Navbar } from "@/components/navbar";
import { fetchResume } from "@/lib/actions/resume-actions";

export default async function CVEditPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/${locale}/auth/login`);
    }

    // Fetch resume data from database
    const resumeData = await fetchResume(id);

    if (!resumeData) {
        redirect(`/${locale}/dashboard`);
    }

    return (
        <>
            <Navbar />
            <CVBuilder locale={locale} resumeId={id} initialData={resumeData} />
        </>
    );
}
