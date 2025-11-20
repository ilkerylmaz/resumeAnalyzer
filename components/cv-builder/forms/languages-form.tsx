"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCVStore, type Language } from "@/stores/cv-store";
import { languageSchema, type LanguageInput } from "@/lib/schemas/cv-schemas";
import { useState } from "react";
import { nanoid } from "nanoid";

export function LanguagesForm() {
    const { languages, addLanguage, updateLanguage, removeLanguage } = useCVStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const t = useTranslations("cvBuilder.languages");
    const tActions = useTranslations("cvBuilder.actions");
    const tVal = useTranslations("cvBuilder.validation");

    const resolver = zodResolver(languageSchema) as Resolver<LanguageInput, any>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LanguageInput>({
        resolver,
        defaultValues: {
            id: "",
            name: "",
            proficiency: "elementary",
        },
        mode: "onBlur",
    });

    const onSubmit = (data: LanguageInput) => {
        if (editingId) {
            updateLanguage(editingId, data);
            setEditingId(null);
        } else {
            const newLang: Language = {
                ...data,
                id: nanoid(),
            };
            addLanguage(newLang);
            setIsAdding(false);
        }
        reset();
    };

    const handleEdit = (lang: Language) => {
        setEditingId(lang.id);
        setIsAdding(true);
        reset(lang);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        reset();
    };

    const handleDelete = (id: string) => {
        if (confirm(t("deleteConfirm"))) {
            removeLanguage(id);
        }
    };

    const getProficiencyColor = (proficiency: string) => {
        switch (proficiency) {
            case "elementary":
                return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
            case "limited":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
            case "professional":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
            case "native":
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getProficiencyLabel = (proficiency: string) => {
        switch (proficiency) {
            case "elementary":
                return t("levels.elementary");
            case "limited":
                return t("levels.limited");
            case "professional":
                return t("levels.professional");
            case "native":
                return t("levels.native");
            default:
                return proficiency;
        }
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
                                {t("name")} *
                            </p>
                            <input
                                type="text"
                                {...register("name")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 p-[15px] text-base font-normal leading-normal"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </label>
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                {t("proficiency")} *
                            </p>
                            <select
                                {...register("proficiency")}
                                className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-[15px] text-base font-normal leading-normal"
                            >
                                <option value="elementary">{t("levels.elementary")}</option>
                                <option value="limited">{t("levels.limited")}</option>
                                <option value="professional">{t("levels.professional")}</option>
                                <option value="native">{t("levels.native")}</option>
                            </select>
                            {errors.proficiency && (
                                <p className="mt-1 text-sm text-red-600">{errors.proficiency.message}</p>
                            )}
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90"
                        >
                            {editingId ? tActions("update") : tActions("addNew")} {t("name")}
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

            {/* Languages List */}
            {!isAdding && languages.length > 0 && (
                <div className="flex flex-wrap gap-3">
                    {languages.map((lang) => (
                        <div
                            key={lang.id}
                            className="group relative inline-flex items-center gap-2 bg-white dark:bg-gray-700 border border-[#E9ECEF] dark:border-gray-600 rounded-full px-4 py-2"
                        >
                            <div className="flex flex-col">
                                <span className="font-medium text-[#111418] dark:text-white">
                                    {lang.name}
                                </span>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${getProficiencyColor(
                                        lang.proficiency
                                    )}`}
                                >
                                    {getProficiencyLabel(lang.proficiency)}
                                </span>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                <button
                                    onClick={() => handleEdit(lang)}
                                    className="p-1 text-[#617289] dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                        />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(lang.id)}
                                    className="p-1 text-[#617289] dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
