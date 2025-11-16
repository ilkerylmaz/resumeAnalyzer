"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCVStore, type Skill } from "@/stores/cv-store";
import { skillSchema, type SkillInput } from "@/lib/schemas/cv-schemas";
import { useState } from "react";
import { nanoid } from "nanoid";

export function SkillsForm() {
    const { skills, addSkill, updateSkill, removeSkill } = useCVStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const resolver = zodResolver(skillSchema) as Resolver<SkillInput, any>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SkillInput>({
        resolver,
        defaultValues: {
            id: "",
            name: "",
            category: "",
            proficiency: "intermediate",
        },
        mode: "onBlur",
    });

    const onSubmit = (data: SkillInput) => {
        if (editingId) {
            updateSkill(editingId, data);
            setEditingId(null);
        } else {
            const newSkill: Skill = {
                ...data,
                id: nanoid(),
            };
            addSkill(newSkill);
            setIsAdding(false);
        }
        reset();
    };

    const handleEdit = (skill: Skill) => {
        setEditingId(skill.id);
        setIsAdding(true);
        reset(skill);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        reset();
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this skill?")) {
            removeSkill(id);
        }
    };

    const getProficiencyColor = (proficiency: string) => {
        switch (proficiency) {
            case "beginner":
                return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
            case "intermediate":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
            case "advanced":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
            case "expert":
                return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div>
            {/* Header with Add New Button */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white">Skills</h2>
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
                                Skill Name *
                            </p>
                            <input
                                type="text"
                                {...register("name")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                placeholder="React.js"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </label>
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                Category *
                            </p>
                            <input
                                type="text"
                                {...register("category")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                placeholder="Frontend Development"
                            />
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                            )}
                        </label>
                    </div>

                    <div className="flex w-full flex-wrap items-end gap-4">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                Proficiency Level *
                            </p>
                            <select
                                {...register("proficiency")}
                                className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 px-[15px] text-base font-normal leading-normal"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="expert">Expert</option>
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
                            {editingId ? "Update" : "Add"} Skill
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

            {/* Skills List - Grouped by Category */}
            {!isAdding && skills.length > 0 && (
                <div className="space-y-6">
                    {/* Group skills by category */}
                    {Object.entries(
                        skills.reduce((acc, skill) => {
                            if (!acc[skill.category]) {
                                acc[skill.category] = [];
                            }
                            acc[skill.category].push(skill);
                            return acc;
                        }, {} as Record<string, Skill[]>)
                    ).map(([category, categorySkills]) => (
                        <div key={category}>
                            <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-3">
                                {category}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {categorySkills.map((skill) => (
                                    <div
                                        key={skill.id}
                                        className={`group relative flex items-center gap-2 px-4 py-2 rounded-full ${getProficiencyColor(
                                            skill.proficiency
                                        )}`}
                                    >
                                        <span className="font-medium text-sm">{skill.name}</span>
                                        <span className="text-xs opacity-75 capitalize">
                                            ({skill.proficiency})
                                        </span>
                                        <div className="hidden group-hover:flex items-center gap-1 ml-2">
                                            <button
                                                onClick={() => handleEdit(skill)}
                                                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                                            >
                                                <svg
                                                    className="w-3 h-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(skill.id)}
                                                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                                            >
                                                <svg
                                                    className="w-3 h-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
