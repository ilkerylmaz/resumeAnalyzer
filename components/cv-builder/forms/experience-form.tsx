"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCVStore, type Experience } from "@/stores/cv-store";
import { experienceSchema, type ExperienceInput } from "@/lib/schemas/cv-schemas";
import { useState } from "react";
import { nanoid } from "nanoid";

export function ExperienceForm() {
    const { experiences, addExperience, updateExperience, removeExperience } = useCVStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const resolver = zodResolver(experienceSchema) as Resolver<ExperienceInput, any>;

    // sonra useForm:
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<ExperienceInput>({
        resolver,
        defaultValues: {
            id: "",
            company: "",
            position: "",
            location: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
        },
        mode: "onBlur",
    });
    const isCurrent = watch("current");

    const onSubmit = (data: ExperienceInput) => {
        if (editingId) {
            updateExperience(editingId, data);
            setEditingId(null);
        } else {
            const newExp: Experience = {
                ...data,
                id: nanoid(),
            };
            addExperience(newExp);
            setIsAdding(false);
        }
        reset();
    };

    const handleEdit = (exp: Experience) => {
        setEditingId(exp.id);
        setIsAdding(true);
        reset(exp);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        reset();
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this experience?")) {
            removeExperience(id);
        }
    };

    return (
        <div>
            {/* Header with Add New Button */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white">Work Experience</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 rounded-full border border-primary text-primary px-4 py-2 text-sm font-medium hover:bg-primary/10"
                >
                    <span className="material-symbols-outlined text-base">add</span>
                    Add new
                </button>
            </div>

            {/* Add/Edit Form */}
            {isAdding && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
                    <div className="flex w-full flex-wrap items-end gap-4">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                Job Title *
                            </p>
                            <input
                                type="text"
                                {...register("position")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                placeholder="Lead Product Designer"
                            />
                            {errors.position && (
                                <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                            )}
                        </label>
                    </div>

                    <div className="flex w-full flex-wrap items-end gap-4">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                Company *
                            </p>
                            <input
                                type="text"
                                {...register("company")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                placeholder="Stripe"
                            />
                            {errors.company && (
                                <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                            )}
                        </label>
                    </div>

                    <div className="flex w-full flex-wrap items-end gap-4">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                Start Date *
                            </p>
                            <input
                                type="month"
                                {...register("startDate")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                            />
                            {errors.startDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                            )}
                        </label>
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                End Date {!isCurrent && "*"}
                            </p>
                            <input
                                type="month"
                                {...register("endDate")}
                                disabled={isCurrent}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal disabled:opacity-50"
                            />
                            {errors.endDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                            )}
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            {...register("current")}
                            onChange={(e) => {
                                setValue("current", e.target.checked);
                                if (e.target.checked) {
                                    setValue("endDate", "");
                                }
                            }}
                            className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label className="ml-2 text-sm text-[#111418] dark:text-gray-300">
                            I currently work here
                        </label>
                    </div>

                    <label className="flex flex-col w-full flex-1">
                        <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                            Description
                        </p>
                        <textarea
                            {...register("description")}
                            rows={5}
                            className="form-textarea w-full resize-none rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                            placeholder="Led the design of a new mobile-first checkout experience, resulting in a 15% increase in conversion rates. Collaborated with cross-functional teams to define product strategy and roadmap."
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                    </label>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90"
                        >
                            {editingId ? "Update" : "Add"} Experience
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="rounded-full px-6 py-3 text-sm font-bold text-[#617289] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Experience List */}
            {!isAdding && experiences.length > 0 && (
                <div className="space-y-4">
                    {experiences.map((exp) => (
                        <div
                            key={exp.id}
                            className="bg-white dark:bg-gray-700 border border-[#E9ECEF] dark:border-gray-600 rounded p-4"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-bold text-[#111418] dark:text-white text-lg">
                                        {exp.position}
                                    </h3>
                                    <p className="text-primary font-medium">{exp.company}</p>
                                    <p className="text-sm text-[#617289] dark:text-gray-400 mt-1">
                                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                        {exp.location && ` • ${exp.location}`}
                                    </p>
                                    {exp.description && (
                                        <p className="text-sm text-[#111418] dark:text-gray-300 mt-2">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(exp)}
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
                                        onClick={() => handleDelete(exp.id)}
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
