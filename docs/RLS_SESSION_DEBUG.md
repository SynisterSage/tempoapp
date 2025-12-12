# RLS Session Issue - Diagnosis and Solutions

## Problem
After email signup, the session is `undefined` even in the `onAuthStateChange` listener, causing profile creation to fail with RLS error `42501`.

## Root Cause
Your Supabase Auth settings likely have **"Confirm email"** enabled, which means:
1. User signs up
2. Auth user is created BUT without a session
3. User receives confirmation email
4. Session only created AFTER email confirmation
5. RLS policies fail because `auth.uid()` is undefined

## Solution Options

### Option 1: Disable Email Confirmation (EASIEST FOR DEVELOPMENT)

1. Go to **Supabase Dashboard** → **Authentication** → **Providers** → **Email**
2. Uncheck **"Confirm email"** or set it to **"Confirm email with one-time password (OTP)"**
3. Save
4. Restart your app and try signup again

**Expected result:** Signup should now work end-to-end.

### Option 2: Create Profile via Database Function (PRODUCTION READY)

If you need email confirmation in production, use a PostgreSQL trigger to create the profile when the user is created:

```sql
-- Create a function to handle new user profile creation
CREATE OR REPLACE FUNCTION create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    handedness,
    unit_preference,
    profile_completed,
    has_seen_preloader
  )
  VALUES (
    NEW.id,
    null,
    'imperial',
    false,
    false
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS create_profile_on_new_user ON auth.users;
CREATE TRIGGER create_profile_on_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_profile_on_signup();
```

This way, profiles are created automatically when users sign up, regardless of email confirmation status.

### Option 3: Update RLS Policies to Allow Unauthenticated Profile Creation

Create a one-time policy that allows the initial profile insert with just the user_id (without requiring auth):

```sql
-- Allow unauthenticated inserts with valid user_id format
CREATE POLICY "allow_profile_creation_without_auth" ON profiles
  FOR INSERT
  TO anon
  WITH CHECK (
    -- Allow insert if user_id looks like a valid UUID
    user_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  );
```

**Note:** This is less secure but works for development.

## Recommended Approach

**For Development:** Use Option 1 (disable email confirmation)
**For Production:** Use Option 2 (database trigger) + keep email confirmation enabled

## Testing After Fix

1. Clear app cache/data
2. Sign up with a new email
3. Check console logs for:
   - `✅ Sign up successful`
   - `✅ Session set on Supabase client` OR `✅ Got session via getSession`
   - `✅ Profile created successfully`
4. Should navigate to ProfileSetupWizard
5. Complete wizard → should navigate to Home

