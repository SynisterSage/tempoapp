import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY, REACT_APP_SUPABASE_OAUTH_REDIRECT_URL } from '@env';
import { Linking } from 'react-native';
import { sessionStorage } from './sessionStorage';

const supabaseUrl = REACT_APP_SUPABASE_URL;
const supabaseAnonKey = REACT_APP_SUPABASE_ANON_KEY;
const oauthRedirectUrl = REACT_APP_SUPABASE_OAUTH_REDIRECT_URL;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables in .env file');
}

// Create Supabase client with proper options for React Native
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false, // Disable for now - will implement persistence separately
    detectSessionInUrl: false,
  },
});

// Handle deep link callback from OAuth
export const handleOAuthCallback = async (url: string) => {
  try {
    // Parse the URL to extract tokens from the fragment
    // URL format: tempo://auth/callback#access_token=...&refresh_token=...
    const hashIndex = url.indexOf('#');
    if (hashIndex === -1) return { error: 'No tokens in URL' };

    const fragment = url.substring(hashIndex + 1);
    
    // Parse fragment manually since URLSearchParams.get() may not work in RN
    const params: Record<string, string> = {};
    fragment.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key && value) {
        params[key] = decodeURIComponent(value);
      }
    });
    
    const access_token = params['access_token'];
    const refresh_token = params['refresh_token'];

    if (access_token && refresh_token) {
      console.log('🔑 Setting session with tokens...');
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      
      if (error) {
        console.error('❌ Failed to set session:', error);
        return { data, error };
      }
      
      // Critical: Wait for the session to propagate through the client
      // AND verify auth.uid() is now accessible in RLS policies
      await new Promise(resolve => setTimeout(() => resolve(undefined), 500));
      
      // Verify session is actually set
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.error('❌ Session not set after setSession call');
        return { data: null, error: { message: 'Session not established' } };
      }
      
      console.log('✅ Session verified for user:', sessionData.session.user.id);
      console.log('✅ Session access token present:', !!sessionData.session.access_token);
      
      // Save to session storage for later retrieval
      await sessionStorage.setSession({
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        userId: sessionData.session.user.id,
        email: sessionData.session.user.email || '',
      });
      
      return { data, error: null };
    }
    
    return { error: 'Missing tokens in callback URL' };
  } catch (error) {
    return { error };
  }
};

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: any;
}

export interface UserProfile {
  id: string;
  user_id: string;
  handicap: number | null;
  home_course_id: string | null;
  home_course_name: string | null;
  handedness: 'right' | 'left' | null;
  unit_preference: 'imperial' | 'metric';
  profile_completed: boolean;
  has_seen_preloader: boolean;
  created_at: string;
  updated_at: string;
}

// Auth functions
export const auth = {
  signUp: async (email: string, password: string) => {
    return supabase.auth.signUp({ email, password });
  },

  signIn: async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  },

  signInWithGoogle: async () => {
    try {
      // Generate OAuth URL with Supabase's callback
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: oauthRedirectUrl,
          skipBrowserRedirect: false, // Let Supabase handle the redirect
        },
      });

      console.log('OAuth URL:', data?.url);
      console.log('OAuth Error:', error);
      console.log('Redirect URL:', oauthRedirectUrl);

      if (error) throw error;
      if (!data?.url) throw new Error('No OAuth URL returned');

      // Open OAuth URL in system browser
      await Linking.openURL(data.url);

      return { data, error: null };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return { data: { provider: 'google', url: '' }, error };
    }
  },

  signOut: async () => {
    try {
      console.log('🚪 Signing out user...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Sign out error:', error);
        return { error };
      }
      // Clear from session storage
      await sessionStorage.clearSession();
      console.log('✅ Sign out successful, session cleared');
      return { error: null };
    } catch (err: any) {
      console.error('❌ Sign out exception:', err);
      return { error: err };
    }
  },

  getSession: async () => {
    return supabase.auth.getSession();
  },

  /**
   * Restore session from session storage on app startup
   */
  restoreSession: async () => {
    try {
      const storedSession = await sessionStorage.getSession();
      if (!storedSession) {
        console.log('ℹ️ No stored session found');
        return { data: null, error: null };
      }

      console.log('🔄 Attempting to restore session from storage...');
      const { data, error } = await supabase.auth.setSession({
        access_token: storedSession.accessToken,
        refresh_token: storedSession.refreshToken,
      });

      if (error) {
        console.error('❌ Failed to restore session:', error);
        await sessionStorage.clearSession();
        return { data: null, error };
      }

      console.log('✅ Session restored successfully');
      return { data, error: null };
    } catch (err: any) {
      console.error('❌ Error restoring session:', err);
      await sessionStorage.clearSession();
      return { data: null, error: err };
    }
  },

  getUser: async () => {
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback: any) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Profile functions
export const profile = {
  getProfile: async (userId: string) => {
    try {
      console.log('🔍 Querying profiles table for user_id:', userId);
      const result = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId);
      
      console.log('🔍 Query result:', result);
      
      if (result.error) {
        return { data: null, error: result.error };
      }
      
      if (result.data && result.data.length > 0) {
        return { data: result.data[0], error: null };
      }
      
      // No data found, return null but no error
      return { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
    } catch (err) {
      console.error('❌ Profile query exception:', err);
      return { data: null, error: err };
    }
  },

  createProfile: async (userId: string, data: Partial<UserProfile>) => {
    try {
      console.log('📝 Inserting profile for user:', userId);
      console.log('📝 Profile data:', data);
      
      // Wrap in timeout to catch hanging promises
      let timeoutId: ReturnType<typeof setTimeout>;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('Insert query timeout after 10 seconds'));
        }, 10000);
      });
      
      console.log('📝 Creating insert promise...');
      const insertPromise = supabase
        .from('profiles')
        .insert({
          user_id: userId,
          handedness: data.handedness || null,
          unit_preference: data.unit_preference || 'imperial',
          profile_completed: data.profile_completed || false,
          has_seen_preloader: data.has_seen_preloader || false,
        })
        .select();
      
      console.log('📝 Awaiting promise race...');
      const { data: result, error } = await Promise.race([
        insertPromise,
        timeoutPromise as any,
      ]);
      
      clearTimeout(timeoutId!);
      
      console.log('📝 Promise race complete, result:', result, 'error:', error);
      
      if (error) {
        console.error('❌ Insert error code:', (error as any).code);
        console.error('❌ Insert error message:', error.message);
        console.error('❌ Full error:', JSON.stringify(error));
        return { data: null, error };
      }
      
      console.log('✅ Profile inserted successfully:', result?.[0]);
      return { data: result?.[0], error: null };
    } catch (err: any) {
      console.error('❌ Insert exception caught:', err.message);
      console.error('❌ Full exception:', JSON.stringify(err));
      return { data: null, error: err };
    }
  },

  updateProfile: async (userId: string, data: Partial<UserProfile>) => {
    return supabase
      .from('profiles')
      .update(data)
      .eq('user_id', userId)
      .select();
  },

  markPreloaderSeen: async (userId: string) => {
    return supabase
      .from('profiles')
      .update({ has_seen_preloader: true })
      .eq('user_id', userId)
      .select();
  },

  completeProfile: async (userId: string) => {
    return supabase
      .from('profiles')
      .update({ profile_completed: true })
      .eq('user_id', userId)
      .select();
  },
};
