-- Clean up malformed embeddings
-- Run this in Supabase SQL Editor to reset embeddings

-- Clear all malformed embeddings from resumes table
UPDATE resumes
SET embedding = NULL
WHERE embedding IS NOT NULL;

-- Clear all malformed embeddings from jobs table
UPDATE jobs
SET embedding = NULL
WHERE embedding IS NOT NULL;

-- Now embeddings will be regenerated with correct format when CVs are saved
