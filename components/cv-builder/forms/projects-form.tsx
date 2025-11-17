"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useCVStore, type Project } from "@/stores/cv-store";
import { projectSchema, type ProjectInput } from "@/lib/schemas/cv-schemas";
import { useState } from "react";
import { nanoid } from "nanoid";

export function ProjectsForm() {
    const { projects, addProject, updateProject, removeProject } = useCVStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [techInput, setTechInput] = useState("");
    const [technologies, setTechnologies] = useState<string[]>([]);
    const t = useTranslations("cvBuilder.projects");
    const tActions = useTranslations("cvBuilder.actions");
    const tVal = useTranslations("cvBuilder.validation");

    const resolver = zodResolver(projectSchema) as Resolver<ProjectInput, any>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<ProjectInput>({
        resolver,
        defaultValues: {
            id: "",
            name: "",
            description: "",
            technologies: [],
            startDate: "",
            endDate: "",
            current: false,
            url: "",
            github: "",
        },
        mode: "onBlur",
    });
    const isCurrent = watch("current");

    const onSubmit = (data: ProjectInput) => {
        if (technologies.length === 0) {
            // Scroll to technologies section
            const techSection = document.getElementById("tech-input-section");
            techSection?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        const projectData = { ...data, technologies };

        if (editingId) {
            updateProject(editingId, projectData);
            setEditingId(null);
        } else {
            const newProject: Project = {
                ...projectData,
                id: nanoid(),
            };
            addProject(newProject);
            setIsAdding(false);
        }
        reset();
        setTechnologies([]);
    };

    const handleEdit = (project: Project) => {
        setEditingId(project.id);
        setIsAdding(true);
        setTechnologies(project.technologies);
        reset(project);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setTechnologies([]);
        reset();
    };

    const handleDelete = (id: string) => {
        if (confirm(tActions("deleteConfirm"))) {
            removeProject(id);
        }
    };

    const addTechnology = () => {
        if (techInput.trim() && !technologies.includes(techInput.trim())) {
            const newTechs = [...technologies, techInput.trim()];
            setTechnologies(newTechs);
            setValue("technologies", newTechs); // ✅ Form'a bildir
            setTechInput("");
        }
    };

    const removeTechnology = (tech: string) => {
        const newTechs = technologies.filter((t) => t !== tech);
        setTechnologies(newTechs);
        setValue("technologies", newTechs); // ✅ Form'a bildir
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

                    <label className="flex flex-col w-full flex-1">
                        <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                            {t("description")} *
                        </p>
                        <textarea
                            {...register("description")}
                            rows={4}
                            className="form-textarea w-full resize-none rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                            placeholder={t("placeholders.description")}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                    </label>

                    {/* Technologies Tag Input */}
                    <div id="tech-input-section">
                        <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                            {t("technologies")} * (Press Enter or click {t("techAdd")})
                        </p>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addTechnology();
                                    }
                                }}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                placeholder={t("techPlaceholder")}
                            />
                            <button
                                type="button"
                                onClick={addTechnology}
                                className="rounded-full border border-primary text-primary px-4 py-2 text-sm font-medium hover:bg-primary/10"
                            >
                                {t("techAdd")}
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                >
                                    {tech}
                                    <button
                                        type="button"
                                        onClick={() => removeTechnology(tech)}
                                        className="hover:text-primary/70"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            ))}
                        </div>
                        {technologies.length === 0 && (
                            <p className="mt-2 text-sm text-red-600 font-medium animate-pulse">
                                ⚠️ {t("atLeastOneTech")}
                            </p>
                        )}
                    </div>

                    <div className="flex w-full flex-wrap items-end gap-4">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                {t("startDate")} *
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
                                {t("endDate")} {!isCurrent && "*"}
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
                            {t("current")}
                        </label>
                    </div>

                    <div className="flex w-full flex-wrap items-end gap-4">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                {t("url")} (Optional)
                            </p>
                            <input
                                type="url"
                                {...register("url")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                placeholder={t("placeholders.url")}
                            />
                            {errors.url && (
                                <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
                            )}
                        </label>
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                {t("github")} (Optional)
                            </p>
                            <input
                                type="url"
                                {...register("github")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                placeholder={t("placeholders.github")}
                            />
                            {errors.github && (
                                <p className="mt-1 text-sm text-red-600">{errors.github.message}</p>
                            )}
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90"
                        >
                            {editingId ? tActions("update") : tActions("addNew")} {t("title").slice(0, -1)}
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

            {/* Projects List */}
            {!isAdding && projects.length > 0 && (
                <div className="space-y-4">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white dark:bg-gray-700 border border-[#E9ECEF] dark:border-gray-600 rounded p-4"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-bold text-[#111418] dark:text-white text-lg">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-[#617289] dark:text-gray-400 mt-1">
                                        {project.startDate} - {project.current ? t("current") : project.endDate}
                                    </p>
                                    <p className="text-sm text-[#111418] dark:text-gray-300 mt-2">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {project.technologies.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    {(project.url || project.github) && (
                                        <div className="flex gap-3 mt-2 text-xs">
                                            {project.url && (
                                                <a
                                                    href={project.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    🔗 Live Demo
                                                </a>
                                            )}
                                            {project.github && (
                                                <a
                                                    href={project.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    💻 GitHub
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(project)}
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
                                        onClick={() => handleDelete(project.id)}
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
