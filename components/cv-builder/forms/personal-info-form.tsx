"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCVStore } from "@/stores/cv-store";
import { personalInfoSchema, type PersonalInfoInput } from "@/lib/schemas/cv-schemas";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

export function PersonalInfoForm() {
    const { personalInfo, updatePersonalInfo } = useCVStore();
    const isInitialMount = useRef(true);
    const t = useTranslations("cvBuilder.personalInfo");
    const tVal = useTranslations("cvBuilder.validation");

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        trigger,
    } = useForm<PersonalInfoInput>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: personalInfo,
        mode: "onChange", // Validate on every change
        reValidateMode: "onChange", // Re-validate on every change
    });

    // Watch all fields for real-time updates
    const formData = watch();
    
    // Track if there are validation errors
    const hasErrors = Object.keys(errors).length > 0;

    // Update store on any change (with debounce to prevent infinite loop)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const timeoutId = setTimeout(() => {
            // Only update if there are no errors
            if (!hasErrors) {
                updatePersonalInfo(formData);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(formData), hasErrors]);

    const onSubmit = (data: PersonalInfoInput) => {
        updatePersonalInfo(data);
        console.log("Personal info saved:", data);
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Row */}
                <div className="flex w-full flex-wrap items-end gap-4">
                    <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                            {t("firstName")} *
                        </p>
                        <input
                            type="text"
                            {...register("firstName")}
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                            placeholder={t("placeholders.firstName")}
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                    </label>

                    <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                            {t("lastName")} *
                        </p>
                        <input
                            type="text"
                            {...register("lastName")}
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                            placeholder={t("placeholders.lastName")}
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                    </label>
                </div>

                {/* Professional Title */}
                <div className="flex w-full flex-wrap items-end gap-4">
                    <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                            {t("jobTitle")} *
                        </p>
                        <input
                            type="text"
                            {...register("title")}
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                            placeholder={t("placeholders.jobTitle")}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                        )}
                    </label>
                </div>

                {/* Contact Row */}
                <div className="flex w-full flex-wrap items-end gap-4">
                    <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                            {t("email")} *
                        </p>
                        <input
                            type="email"
                            {...register("email")}
                            className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 border bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal ${
                                errors.email
                                    ? "border-red-500 focus:ring-red-500/50"
                                    : "border-[#dbe0e6] dark:border-gray-600 focus:ring-primary/50"
                            }`}
                            placeholder={t("placeholders.email")}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </label>

                    <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                            {t("phone")} *
                        </p>
                        <input
                            type="tel"
                            {...register("phone")}
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                            placeholder={t("placeholders.phone")}
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                        )}
                    </label>
                </div>

                {/* Location */}
                <div className="flex w-full flex-wrap items-end gap-4">
                    <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                            {t("location")} *
                        </p>
                        <input
                            type="text"
                            {...register("location")}
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                            placeholder={t("placeholders.location")}
                        />
                        {errors.location && (
                            <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                        )}
                    </label>
                </div>

                {/* Summary */}
                <label className="flex flex-col w-full flex-1">
                    <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                        {t("summary")}
                    </p>
                    <textarea
                        {...register("summary")}
                        rows={5}
                        className="form-textarea w-full resize-none rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                        placeholder={t("placeholders.summary")}
                    />
                    <p className="mt-1 text-sm text-[#617289] dark:text-gray-400">
                        {formData.summary?.length || 0}/500
                    </p>
                    {errors.summary && (
                        <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
                    )}
                </label>
            </form>
        </div>
    );
}
