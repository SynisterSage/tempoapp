-- ⚠️ IMPORTANT: This script will REPLACE your existing policies with correct ones
-- Run this in Supabase SQL Editor to fix RLS issues

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "insert_own" ON profiles;
DROP POLICY IF EXISTS "select_own" ON profiles;
DROP POLICY IF EXISTS "update_own" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies with CORRECT definitions
-- ✅ INSERT: User can create their own profile
CREATE POLICY "insert_own" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ✅ SELECT: User can view their own profile
CREATE POLICY "select_own" ON profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- ✅ UPDATE: User can update their own profile
CREATE POLICY "update_own" ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ✅ DELETE: User can delete their own profile (optional but good to have)
CREATE POLICY "delete_own" ON profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Verify the policies are created
SELECT * FROM pg_policies WHERE tablename = 'profiles';
