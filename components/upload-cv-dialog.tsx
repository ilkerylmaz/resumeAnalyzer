"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, File, X, Loader2 } from "lucide-react";

interface UploadCVDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type UploadState = "idle" | "uploading" | "parsing" | "success" | "error";

export function UploadCVDialog({ open, onOpenChange }: UploadCVDialogProps) {
    const t = useTranslations();
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [uploadState, setUploadState] = useState<UploadState>("idle");
    const [error, setError] = useState<string>("");
    const [dragActive, setDragActive] = useState(false);

    // File validation
    const validateFile = useCallback(
        (file: File): string | null => {
            if (file.type !== "application/pdf") {
                return t("upload.errors.invalidType");
            }
            if (file.size > 5 * 1024 * 1024) {
                return t("upload.errors.tooLarge");
            }
            return null;
        },
        [t]
    );

    // Handle file selection
    const handleFileChange = useCallback(
        (selectedFile: File) => {
            const validationError = validateFile(selectedFile);
            if (validationError) {
                setError(validationError);
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError("");
        },
        [validateFile]
    );

    // Handle drag events
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileChange(e.dataTransfer.files[0]);
            }
        },
        [handleFileChange]
    );

    // Handle upload and parse
    const handleUpload = useCallback(async () => {
        if (!file) return;

        setUploadState("uploading");
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            setUploadState("parsing");

            const response = await fetch("/api/cv/parse", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || t("upload.errors.parseFailed"));
            }

            // Store parsed data in localStorage
            localStorage.setItem("cv-upload-draft", JSON.stringify(data.data));

            setUploadState("success");

            // Close modal and redirect
            onOpenChange(false);
            router.push("/cv/create?source=upload");
        } catch (err) {
            console.error("Upload error:", err);
            setUploadState("error");
            setError(
                err instanceof Error ? err.message : t("upload.errors.uploadFailed")
            );
        }
    }, [file, t, onOpenChange, router]);

    // Reset state when dialog closes
    const handleOpenChange = useCallback(
        (open: boolean) => {
            if (!open) {
                setFile(null);
                setUploadState("idle");
                setError("");
                setDragActive(false);
            }
            onOpenChange(open);
        },
        [onOpenChange]
    );

    const isLoading = uploadState === "uploading" || uploadState === "parsing";
    const canUpload = file && !isLoading;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("upload.title")}</DialogTitle>
                    <DialogDescription>{t("upload.description")}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Drop Zone */}
                    {!file && (
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-colors
                ${dragActive
                                    ? "border-primary bg-primary/5"
                                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                                }
              `}
                            onClick={() => document.getElementById("file-input")?.click()}
                        >
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-sm font-medium mb-1">
                                {t("upload.dropZone.title")}
                            </p>
                            <p className="text-xs text-muted-foreground mb-2">
                                {t("upload.dropZone.subtitle")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {t("upload.dropZone.fileTypes")}
                            </p>
                            <input
                                id="file-input"
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) =>
                                    e.target.files?.[0] && handleFileChange(e.target.files[0])
                                }
                            />
                        </div>
                    )}

                    {/* Selected File Info */}
                    {file && !isLoading && (
                        <div className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                    <File className="h-10 w-10 text-muted-foreground flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {t("upload.selected.size")}:{" "}
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setFile(null)}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="border rounded-lg p-6 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
                            <p className="text-sm font-medium mb-1">
                                {uploadState === "uploading"
                                    ? t("upload.progress.uploading")
                                    : t("upload.progress.parsing")}
                            </p>
                            {uploadState === "parsing" && (
                                <p className="text-xs text-muted-foreground">
                                    {t("upload.progress.finalizing")}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isLoading}
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button onClick={handleUpload} disabled={!canUpload}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {uploadState === "uploading"
                                        ? t("upload.button.uploading")
                                        : t("upload.button.parsing")}
                                </>
                            ) : (
                                t("upload.button.upload")
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
