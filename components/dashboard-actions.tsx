"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload } from "lucide-react";
import Link from "next/link";
import { UploadCVDialog } from "@/components/upload-cv-dialog";

export function DashboardActions() {
    const t = useTranslations();
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    onClick={() => setUploadDialogOpen(true)}
                >
                    <Upload className="mr-2 h-4 w-4" />
                    {t("dashboard.uploadCV")}
                </Button>
                <Button asChild className="flex-1 sm:flex-none">
                    <Link href="/cv/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t("dashboard.addNewResume")}
                    </Link>
                </Button>
            </div>

            <UploadCVDialog
                open={uploadDialogOpen}
                onOpenChange={setUploadDialogOpen}
            />
        </>
    );
}
