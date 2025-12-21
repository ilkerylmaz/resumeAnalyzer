/**
 * Gemini API Client Configuration
 * 
 * Centralized Google Generative AI client for:
 * - Embedding generation (text-embedding-004)
 * - CV parsing (gemini-pro)
 * - ATS scoring (post-MVP)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

function getAPIKey(): string {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    return apiKey;
}

// Initialize the Gemini API client (lazy initialization)
let genAIInstance: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
    if (!genAIInstance) {
        genAIInstance = new GoogleGenerativeAI(getAPIKey());
    }
    return genAIInstance;
}

/**
 * Model configurations
 */
export const MODELS = {
    // Embedding model for semantic search (1024 dimensions)
    EMBEDDING: "text-embedding-004",

    // Generative model for CV parsing and analysis
    GENERATIVE: "gemini-2.0-flash-exp", // Fast and cost-effective

    // Alternative: "gemini-1.5-pro" for higher accuracy (can be changed)
} as const;

/**
 * Get embedding model instance
 */
export function getEmbeddingModel() {
    return getGenAI().getGenerativeModel({ model: MODELS.EMBEDDING });
}

/**
 * Get generative model instance for text generation
 */
export function getGenerativeModel() {
    return getGenAI().getGenerativeModel({ model: MODELS.GENERATIVE });
}
