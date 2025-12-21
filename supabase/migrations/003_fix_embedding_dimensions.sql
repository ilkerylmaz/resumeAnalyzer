-- Migration: Fix Embedding Dimensions (1024 → 768)
-- Date: December 21, 2025
-- Author: Cline
-- Description: Update all embedding columns to use correct dimension (768) for text-embedding-004 model
--
-- CRITICAL: text-embedding-004 produces 768-dimensional embeddings, NOT 1024
-- This migration fixes the incorrect dimension defined in 001_initial_schema.sql

-- ============================================
-- 1. ALTER RESUMES TABLE
-- ============================================
-- Drop existing index (required before changing column type)
DROP INDEX IF EXISTS idx_resumes_embedding;

-- Change embedding column dimension
ALTER TABLE resumes 
  ALTER COLUMN embedding TYPE vector(768);

-- Recreate index with new dimension
CREATE INDEX idx_resumes_embedding ON resumes 
  USING hnsw (embedding vector_cosine_ops);

-- ============================================
-- 2. ALTER JOBS TABLE
-- ============================================
-- Drop existing indexes (all 5 embedding indexes)
DROP INDEX IF EXISTS idx_jobs_embedding;
DROP INDEX IF EXISTS idx_jobs_title_embedding;
DROP INDEX IF EXISTS idx_jobs_skills_embedding;
DROP INDEX IF EXISTS idx_jobs_responsibilities_embedding;
DROP INDEX IF EXISTS idx_jobs_context_embedding;

-- Change main embedding column dimension (MVP - Phase 11)
ALTER TABLE jobs 
  ALTER COLUMN embedding TYPE vector(768);

-- Keep title_embedding as 384 (already correct)
-- Keep context_embedding as 384 (already correct)

-- Change skills_embedding dimension (Phase 12)
ALTER TABLE jobs 
  ALTER COLUMN skills_embedding TYPE vector(768);

-- Change responsibilities_embedding dimension (Phase 12)
ALTER TABLE jobs 
  ALTER COLUMN responsibilities_embedding TYPE vector(768);

-- Recreate all indexes with correct dimensions
CREATE INDEX idx_jobs_embedding ON jobs 
  USING hnsw (embedding vector_cosine_ops);

CREATE INDEX idx_jobs_title_embedding ON jobs 
  USING hnsw (title_embedding vector_cosine_ops);

CREATE INDEX idx_jobs_skills_embedding ON jobs 
  USING hnsw (skills_embedding vector_cosine_ops);

CREATE INDEX idx_jobs_responsibilities_embedding ON jobs 
  USING hnsw (responsibilities_embedding vector_cosine_ops);

CREATE INDEX idx_jobs_context_embedding ON jobs 
  USING hnsw (context_embedding vector_cosine_ops);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- All embedding columns now use correct dimensions:
-- - Main embeddings (CV, Job, Skills, Responsibilities): vector(768)
-- - Title and Context embeddings: vector(384) (unchanged)
-- - All HNSW indexes recreated successfully
