"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCVStore, type SocialMedia } from "@/stores/cv-store";
import { socialMediaSchema, type SocialMediaInput } from "@/lib/schemas/cv-schemas";
import { useState } from "react";
import { nanoid } from "nanoid";

export function SocialMediaForm() {
    const { socialMedia, addSocialMedia, updateSocialMedia, removeSocialMedia } = useCVStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const t = useTranslations("cvBuilder.socialMedia");
    const tActions = useTranslations("cvBuilder.actions");
    const tVal = useTranslations("cvBuilder.validation");

    const resolver = zodResolver(socialMediaSchema) as Resolver<SocialMediaInput, any>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SocialMediaInput>({
        resolver,
        defaultValues: {
            id: "",
            platform: "",
            url: "",
        },
        mode: "onBlur",
    });

    const onSubmit = (data: SocialMediaInput) => {
        if (editingId) {
            updateSocialMedia(editingId, data);
            setEditingId(null);
        } else {
            const newSocial: SocialMedia = {
                ...data,
                id: nanoid(),
            };
            addSocialMedia(newSocial);
            setIsAdding(false);
        }
        reset();
    };

    const handleEdit = (social: SocialMedia) => {
        setEditingId(social.id);
        setIsAdding(true);
        reset(social);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        reset();
    };

    const handleDelete = (id: string) => {
        if (confirm(t("deleteConfirm"))) {
            removeSocialMedia(id);
        }
    };

    const getPlatformIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes("linkedin")) return "💼";
        if (p.includes("github")) return "💻";
        if (p.includes("twitter") || p.includes("x.com")) return "🐦";
        if (p.includes("facebook")) return "📘";
        if (p.includes("instagram")) return "📷";
        if (p.includes("youtube")) return "📹";
        if (p.includes("medium")) return "✍️";
        if (p.includes("dev.to") || p.includes("hashnode")) return "📝";
        return "🔗";
    };

    return (
        <div>
            {/* Header with Add New Button */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white">{t("title")}</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 rounded-full border border-primary text-primary px-4 py-2 text-sm font-medium hover:bg-primary/10"
                >
                    <span className="material-symbols-outlined text-base">add</span>
                    {tActions("addNew")}
                </button>
            </div>

            {/* Add/Edit Form */}
            {isAdding && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
                    <div className="flex w-full flex-wrap items-end gap-4">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                {t("platform")} *
                            </p>
                            <input
                                type="text"
                                {...register("platform")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 p-[15px] text-base font-normal leading-normal"
                            />
                            {errors.platform && (
                                <p className="mt-1 text-sm text-red-600">{errors.platform.message}</p>
                            )}
                        </label>
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                {t("url")} *
                            </p>
                            <input
                                type="url"
                                {...register("url")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 p-[15px] text-base font-normal leading-normal"
                            />
                            {errors.url && (
                                <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
                            )}
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90"
                        >
                            {editingId ? tActions("update") : tActions("addNew")} {t("platform")}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="rounded-full px-6 py-3 text-sm font-bold text-[#617289] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {tActions("cancel")}
                        </button>
                    </div>
                </form>
            )}

            {/* Social Media List */}
            {!isAdding && socialMedia.length > 0 && (
                <div className="space-y-3">
                    {socialMedia.map((social) => (
                        <div
                            key={social.id}
                            className="group flex items-center justify-between bg-white dark:bg-gray-700 border border-[#E9ECEF] dark:border-gray-600 rounded p-3"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{getPlatformIcon(social.platform)}</span>
                                <div>
                                    <p className="font-medium text-[#111418] dark:text-white">
                                        {social.platform}
                                    </p>
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {social.url}
                                    </a>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(social)}
                                    className="p-2 text-[#617289] dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                        />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(social.id)}
                                    className="p-2 text-[#617289] dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
