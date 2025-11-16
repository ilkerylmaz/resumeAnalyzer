"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCVStore, type Certificate } from "@/stores/cv-store";
import { certificateSchema, type CertificateInput } from "@/lib/schemas/cv-schemas";
import { useState } from "react";
import { nanoid } from "nanoid";

export function CertificatesForm() {
    const { certificates, addCertificate, updateCertificate, removeCertificate } = useCVStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const resolver = zodResolver(certificateSchema) as Resolver<CertificateInput, any>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CertificateInput>({
        resolver,
        defaultValues: {
            id: "",
            name: "",
            issuer: "",
            issueDate: "",
            expirationDate: "",
            credentialId: "",
            url: "",
        },
        mode: "onBlur",
    });

    const onSubmit = (data: CertificateInput) => {
        if (editingId) {
            updateCertificate(editingId, data);
            setEditingId(null);
        } else {
            const newCert: Certificate = {
                ...data,
                id: nanoid(),
            };
            addCertificate(newCert);
            setIsAdding(false);
        }
        reset();
    };

    const handleEdit = (cert: Certificate) => {
        setEditingId(cert.id);
        setIsAdding(true);
        reset(cert);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        reset();
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this certificate?")) {
            removeCertificate(id);
        }
    };

    return (
        <div>
            {/* Header with Add New Button */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#111418] dark:text-white">Certificates</h2>
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
                                Certificate Name *
                            </p>
                            <input
                                type="text"
                                {...register("name")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                placeholder="AWS Certified Solutions Architect"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </label>
                    </div>

                    <div className="flex w-full flex-wrap items-end gap-4">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                Issuing Organization *
                            </p>
                            <input
                                type="text"
                                {...register("issuer")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                placeholder="Amazon Web Services"
                            />
                            {errors.issuer && (
                                <p className="mt-1 text-sm text-red-600">{errors.issuer.message}</p>
                            )}
                        </label>
                    </div>

                    <div className="flex w-full flex-wrap items-end gap-4">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                Issue Date *
                            </p>
                            <input
                                type="month"
                                {...register("issueDate")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                            />
                            {errors.issueDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.issueDate.message}</p>
                            )}
                        </label>
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                Expiration Date (Optional)
                            </p>
                            <input
                                type="month"
                                {...register("expirationDate")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                            />
                            {errors.expirationDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.expirationDate.message}</p>
                            )}
                        </label>
                    </div>

                    <div className="flex w-full flex-wrap items-end gap-4">
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                Credential ID (Optional)
                            </p>
                            <input
                                type="text"
                                {...register("credentialId")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                placeholder="ABC123XYZ"
                            />
                            {errors.credentialId && (
                                <p className="mt-1 text-sm text-red-600">{errors.credentialId.message}</p>
                            )}
                        </label>
                        <label className="flex flex-col min-w-40 flex-1">
                            <p className="text-base font-medium leading-normal pb-2 text-[#111418] dark:text-gray-300">
                                Credential URL (Optional)
                            </p>
                            <input
                                type="url"
                                {...register("url")}
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-[#617289] dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                                placeholder="https://www.credly.com/badges/..."
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
                            {editingId ? "Update" : "Add"} Certificate
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

            {/* Certificates List */}
            {!isAdding && certificates.length > 0 && (
                <div className="space-y-4">
                    {certificates.map((cert) => (
                        <div
                            key={cert.id}
                            className="bg-white dark:bg-gray-700 border border-[#E9ECEF] dark:border-gray-600 rounded p-4"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-bold text-[#111418] dark:text-white text-lg">
                                        {cert.name}
                                    </h3>
                                    <p className="text-primary font-medium">{cert.issuer}</p>
                                    <p className="text-sm text-[#617289] dark:text-gray-400 mt-1">
                                        Issued: {cert.issueDate}
                                        {cert.expirationDate && ` • Expires: ${cert.expirationDate}`}
                                    </p>
                                    {cert.credentialId && (
                                        <p className="text-xs text-[#617289] dark:text-gray-400 mt-1">
                                            ID: {cert.credentialId}
                                        </p>
                                    )}
                                    {cert.url && (
                                        <a
                                            href={cert.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline text-xs mt-1 inline-block"
                                        >
                                            🔗 View Credential
                                        </a>
                                    )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(cert)}
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
                                        onClick={() => handleDelete(cert.id)}
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
