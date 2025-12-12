# Supabase RLS (Row-Level Security) Setup Guide

## Problem
The signup flow creates an auth user successfully, but fails to insert the profile record with error:
```
new row violates row-level security policy for table "profiles"
```

## Solution
Your `profiles` table RLS policies need to be configured to allow authenticated users to create and update their own profiles.

### Step 1: Go to Supabase Dashboard

1. Open [https://app.supabase.com](https://app.supabase.com)
2. Select your Tempo project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Create/Update RLS Policies

Run the following SQL commands to set up the correct RLS policies:

```sql
-- First, enable RLS on the profiles table (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (optional, only if you want to reset)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- Policy 1: Allow users to INSERT their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 2: Allow users to SELECT their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 3: Allow users to UPDATE their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Allow users to DELETE their own profile
CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE
  USING (auth.uid() = user_id);
```

### Step 3: Verify RLS is Enabled

1. Go to **Database** → **Tables** in the Supabase dashboard
2. Click on the `profiles` table
3. Click the **RLS** button in the top-right
4. Verify it shows **"RLS is ON"** in green
5. You should see 4 policies listed

### Why This Works

The RLS policies use `auth.uid()` to automatically get the currently authenticated user's ID from Supabase Auth. When you call:

```typescript
const { data: newProfile, error: createError } = await profile.createProfile(authUser.id, {...})
```

The `INSERT` succeeds because:
1. User is authenticated (has a session)
2. `auth.uid()` returns their user ID
3. The policy checks `auth.uid() = user_id` ✅ (matches)
4. Insert is allowed

### Troubleshooting

If you still get RLS errors after setting up these policies:

1. **Check Auth Session**: Verify the user has a valid session in the current request
   - The app should show `console.log` statements with session info
   - Look for `Session tokens present: true`

2. **Clear Browser Cache**: 
   - Close and reopen the app/simulator
   - The old session might be cached

3. **Check User ID Match**:
   - Verify `user_id` in your code matches the auth user's ID
   - Check the Supabase dashboard auth logs

4. **Test with SQL Editor**:
   - Go to SQL Editor and manually test:
   ```sql
   INSERT INTO profiles (user_id, handedness, unit_preference, profile_completed, has_seen_preloader)
   VALUES ('YOUR_USER_ID_HERE', null, 'imperial', false, false);
   ```
   - If this works, your policies are correct

### Expected Behavior After Fix

1. User signs up with email/password
2. Auth user is created in Supabase Auth
3. Profile record is inserted in `profiles` table (1000ms wait ensures session is ready)
4. `userProfile` state is set
5. Navigation routes to `ProfileSetupWizard`
6. User completes onboarding wizard
7. `completeProfile()` updates the profile with their data and sets `profile_completed = true`
8. Navigation routes to main app (Home screen)
9. Profile data is now saved in Supabase

