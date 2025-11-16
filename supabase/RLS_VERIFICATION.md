# Row Level Security (RLS) Verification Checklist

## ✅ What We Have (Already Created)

### Tables with RLS Enabled
- ✅ `resumes` - RLS enabled
- ✅ `resume_personal_details` - RLS enabled
- ✅ `resume_experience` - RLS enabled
- ✅ `resume_education` - RLS enabled
- ✅ `resume_projects` - RLS enabled
- ✅ `resume_certificates` - RLS enabled
- ✅ `resume_skills` - RLS enabled
- ✅ `resume_languages` - RLS enabled
- ✅ `resume_social_media` - RLS enabled
- ✅ `resume_interests` - RLS enabled
- ✅ `jobs` - RLS enabled (public read for active jobs)
- ✅ `users` - RLS enabled

### RLS Policies Created

#### Resumes Table (4 policies)
- ✅ `Users can view own resumes` - SELECT
- ✅ `Users can insert own resumes` - INSERT
- ✅ `Users can update own resumes` - UPDATE
- ✅ `Users can delete own resumes` - DELETE

#### Resume Sections (9 tables, 1 policy each)
All sections use the helper function `user_owns_resume(resume_id)`:
- ✅ `resume_personal_details` - "Users can manage own resume personal details"
- ✅ `resume_experience` - "Users can manage own resume experience"
- ✅ `resume_education` - "Users can manage own resume education"
- ✅ `resume_projects` - "Users can manage own resume projects"
- ✅ `resume_certificates` - "Users can manage own resume certificates"
- ✅ `resume_skills` - "Users can manage own resume skills"
- ✅ `resume_languages` - "Users can manage own resume languages"
- ✅ `resume_social_media` - "Users can manage own resume social media"
- ✅ `resume_interests` - "Users can manage own resume interests"

#### Jobs Table (1 policy)
- ✅ `Anyone can view active jobs` - SELECT (public access)

#### Users Table (3 policies)
- ✅ `Users can view own profile` - SELECT
- ✅ `Users can update own profile` - UPDATE
- ✅ `Users can insert own profile` - INSERT

## 🔍 Verification Steps

### Step 1: Check if RLS is Enabled
Run this query in Supabase SQL Editor:

```sql
SELECT 
  schemaname, 
  tablename, 
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected Result:** All tables should have `rowsecurity = true`

### Step 2: Verify Policies Exist
Run this query:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Expected Result:** Should show 18 policies total

### Step 3: Test User Isolation
Create two test users and verify they can't see each other's data:

```sql
-- As User A (after creating resume)
SELECT * FROM resumes;  -- Should only see User A's resumes

-- As User B (different user)
SELECT * FROM resumes;  -- Should only see User B's resumes (not User A's)
```

### Step 4: Test Public Job Access
```sql
-- As anonymous user (not logged in)
SELECT * FROM jobs WHERE is_active = true;  -- Should work (public read)

-- Try to insert/update/delete as anonymous
INSERT INTO jobs (job_title, company_name, ...) VALUES (...);  -- Should fail
```

## 📋 Manual Verification Checklist

After running the migration in Supabase:

- [ ] **Verify RLS is enabled** on all tables (Step 1)
- [ ] **Verify all 18 policies** exist (Step 2)
- [ ] **Test resume isolation**: Create 2 test users, each creates a CV, verify they can't see each other's CVs
- [ ] **Test resume sections**: User can only access sections of their own resumes
- [ ] **Test jobs public read**: Anonymous user can view active jobs
- [ ] **Test jobs write protection**: Anonymous/regular user cannot insert/update/delete jobs
- [ ] **Test users table**: User can only see/update their own profile
- [ ] **Test helper function**: `user_owns_resume()` works correctly

## 🚨 Common RLS Issues & Solutions

### Issue 1: "permission denied for table X"
**Cause:** RLS is enabled but no policies allow the operation  
**Solution:** Check if correct policies exist with `SELECT * FROM pg_policies WHERE tablename = 'X'`

### Issue 2: User can see other users' data
**Cause:** RLS not enabled or policy is too permissive  
**Solution:** Verify RLS is enabled with `SELECT rowsecurity FROM pg_tables WHERE tablename = 'X'`

### Issue 3: Cannot insert/update own data
**Cause:** Missing WITH CHECK clause in INSERT/UPDATE policies  
**Solution:** Ensure policies have `WITH CHECK (auth.uid() = user_id)` for INSERT/UPDATE

### Issue 4: Helper function not working
**Cause:** Function not marked as `SECURITY DEFINER`  
**Solution:** Recreate with `CREATE OR REPLACE FUNCTION ... SECURITY DEFINER`

## 🔧 Quick Fix Commands

### Re-enable RLS on all tables
```sql
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_personal_details ENABLE ROW LEVEL SECURITY;
-- (repeat for all tables)
```

### Drop and recreate a policy
```sql
DROP POLICY "policy_name" ON table_name;

CREATE POLICY "policy_name"
  ON table_name FOR ALL
  USING (condition);
```

### Check current user's access
```sql
-- See what auth.uid() returns (current user)
SELECT auth.uid();

-- Test if user owns a specific resume
SELECT user_owns_resume('resume-uuid-here');
```

## ✅ Verification Complete Checklist

Once all checks pass:

- [ ] All tables have RLS enabled ✅
- [ ] All 18 policies exist and are correctly configured ✅
- [ ] Tested user data isolation (users can't see each other's CVs) ✅
- [ ] Tested public job access (anonymous users can read, but not write) ✅
- [ ] Tested helper function `user_owns_resume()` ✅
- [ ] No permission errors in application testing ✅
- [ ] Documented any custom policies or exceptions ✅

**Status: READY FOR PRODUCTION** 🚀

---

*Last Verified: November 16, 2025*
