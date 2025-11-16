"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCVStore, type Interest } from "@/stores/cv-store";
import { interestSchema, type InterestInput } from "@/lib/schemas/cv-schemas";
import { useState } from "react";
import { nanoid } from "nanoid";

export function InterestsForm() {
    const { interests, addInterest, updateInterest, removeInterest } = useCVStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const t = useTranslations("cvBuilder.interests");
    const tActions = useTranslations("cvBuilder.actions");
    const tVal = useTranslations("cvBuilder.validation");

    const resolver = zodResolver(interestSchema) as Resolver<InterestInput, any>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<InterestInput>({
        resolver,
        defaultValues: {
            id: "",
            name: "",
        },
        mode: "onBlur",
    });

    const onSubmit = (data: InterestInput) => {
        if (editingId) {
            updateInterest(editingId, data);
            setEditingId(null);
        } else {
            const newInterest: Interest = {
                ...data,
                id: nanoid(),
            };
            addInterest(newInterest);
            setIsAdding(false);
        }
        reset();
    };

    const handleEdit = (interest: Interest) => {
        setEditingId(interest.id);
        setIsAdding(true);
        reset(interest);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        reset();
    };

    const handleDelete = (id: string) => {
        if (confirm(t("deleteConfirm"))) {
            removeInterest(id);
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
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                placeholder={t("placeholders.name")}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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

            {/* Interests List */}
            {!isAdding && interests.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                        <div
                            key={interest.id}
                            className="group relative inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2"
                        >
                            <span className="font-medium">{interest.name}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(interest)}
                                    className="p-1 hover:bg-primary/20 rounded"
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
                                    onClick={() => handleDelete(interest.id)}
                                    className="p-1 hover:bg-red-100 hover:text-red-600 rounded"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
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
