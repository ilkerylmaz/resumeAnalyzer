"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload } from "lucide-react";
import { UploadCVDialog } from "@/components/upload-cv-dialog";
import { CreateCVButton } from "@/components/create-cv-button";

export function DashboardActions() {
    const t = useTranslations();
    const locale = useLocale();
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
                <CreateCVButton locale={locale} variant="primary">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t("dashboard.addNewResume")}
                </CreateCVButton>
            </div>

            <UploadCVDialog
                open={uploadDialogOpen}
                onOpenChange={setUploadDialogOpen}
            />
        </>
    );
}
