import React, { createContext, useContext, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { auth, profile, AuthUser, UserProfile, handleOAuthCallback } from '../services/auth';

interface AuthContextType {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  markPreloaderSeen: () => Promise<void>;
  completeProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth - checking for stored session...');
        
        // First, try to restore session from storage
        await auth.restoreSession();
        
        // Then check current session
        const { data, error: sessionError } = await auth.getSession();
        if (sessionError) throw sessionError;

        if (data.session?.user) {
          console.log('✅ Session found for user:', data.session.user.email);
          const authUser: AuthUser = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            user_metadata: data.session.user.user_metadata,
          };
          setUser(authUser);

          // Fetch user profile from database
          console.log('📱 Fetching profile from database for user:', authUser.id);
          const { data: profileData, error: profileError } = await profile.getProfile(authUser.id);
          if (profileError && (profileError as any).code !== 'PGRST116') {
            throw profileError;
          }

          if (profileData) {
            console.log('✅ Profile loaded:', profileData);
            setUserProfile(profileData);
          } else {
            console.warn('⚠️ No profile found for existing user');
          }
        } else {
          console.log('ℹ️ No session found, user needs to log in');
        }
      } catch (err: any) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for OAuth deep link callback
    const handleDeepLink = async (event: { url: string }) => {
      console.log('🔗 Deep link received:', event.url);
      if (event.url.startsWith('tempo://auth/callback')) {
        console.log('✅ Processing OAuth callback...');
        const result = await handleOAuthCallback(event.url);
        console.log('✅ OAuth callback result:', result);
        if (result.error) {
          console.error('❌ OAuth callback error:', result.error);
          setError(typeof result.error === 'string' ? result.error : 'OAuth callback failed');
        } else {
          console.log('✅ OAuth callback successful, session should be set');
        }
        // Session will be set via onAuthStateChange listener
      }
    };

    // Check if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      console.log('🔗 Initial URL:', url);
      if (url && url.startsWith('tempo://auth/callback')) {
        console.log('✅ Processing initial URL...');
        handleDeepLink({ url });
      }
    });

    // Listen for deep links while app is running
    const linkingSubscription = Linking.addEventListener('url', handleDeepLink);

    // Subscribe to auth changes
    const { data: authListener } = auth.onAuthStateChange(async (event: any, session: any) => {
      console.log('Auth state changed:', event, session?.user?.email);
      if (session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          user_metadata: session.user.user_metadata,
        };
        setUser(authUser);

        // Fire profile creation in the background (don't block auth state change)
        (async () => {
          // For OAuth users, create profile after session is ready
          try {
            console.log('📝 [BG] Creating/updating profile for OAuth user:', authUser.id);
            console.log('📝 [BG] Session user ID:', session.user.id);
            console.log('📝 [BG] Auth user ID:', authUser.id);
            
            // Verify session is actually accessible by the client
            try {
              const { data: sessionData } = await auth.getSession();
              console.log('📝 [BG] Current session user ID:', sessionData.session?.user?.id);
              console.log('📝 [BG] Session tokens present:', !!sessionData.session?.access_token);
            } catch (sessionError) {
              console.error('❌ [BG] Error getting session:', sessionError);
            }
            
            // CRITICAL: Wait for session to propagate through the Supabase client
            // This ensures auth.uid() works in RLS policies
            console.log('⏳ [BG] Waiting 500ms for session to propagate...');
            await new Promise(resolve => setTimeout(() => resolve(undefined), 500));
            
            console.log('✅ [BG] 500ms wait complete, now creating profile');
            
            // Try to create profile (will fail if exists, that's ok)
            try {
              const { data: newProfile, error: createError } = await profile.createProfile(authUser.id, {
                handedness: null,
                unit_preference: 'imperial',
                profile_completed: false,
                has_seen_preloader: false,
              });
              
              console.log('✅ [BG] createProfile returned, data:', newProfile, 'error:', createError);
              
              if (createError) {
                // Profile might already exist, try to fetch it
                console.log('⚠️ [BG] Profile creation error:', (createError as any).message);
                console.log('⚠️ [BG] Error code:', (createError as any).code);
                const { data: existingProfile, error: fetchError } = await profile.getProfile(authUser.id);
                
                if (fetchError) {
                  console.error('❌ [BG] Failed to fetch existing profile:', fetchError);
                  console.error('❌ [BG] Fetch error message:', (fetchError as any).message);
                  // Create a minimal profile object to trigger navigation
                  setUserProfile({
                    id: '',
                    user_id: authUser.id,
                    handicap: null,
                    home_course_id: null,
                    home_course_name: null,
                    handedness: null,
                    unit_preference: 'imperial',
                    profile_completed: false,
                    has_seen_preloader: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  });
                } else if (existingProfile) {
                  console.log('✅ [BG] Using existing profile:', existingProfile);
                  setUserProfile(existingProfile);
                }
              } else if (newProfile) {
                console.log('✅ [BG] Profile created successfully:', newProfile);
                setUserProfile(newProfile);
              } else {
                console.warn('⚠️ [BG] Profile returned but data is empty - creating minimal profile');
                // Create a minimal profile object to trigger navigation
                setUserProfile({
                  id: '',
                  user_id: authUser.id,
                  handicap: null,
                  home_course_id: null,
                  home_course_name: null,
                  handedness: null,
                  unit_preference: 'imperial',
                  profile_completed: false,
                  has_seen_preloader: false,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                });
              }
            } catch (profileError: any) {
              console.error('❌ [BG] Profile creation caught exception:', profileError);
              console.error('❌ [BG] Exception message:', profileError.message);
              console.error('❌ [BG] Full exception:', JSON.stringify(profileError));
            }
          } catch (err: any) {
            console.error('❌ [BG] Outer profile operation exception:', err);
            console.error('❌ [BG] Outer exception message:', err.message);
            setError(`Profile error: ${err.message}`);
          }
        })().catch((err) => {
          console.error('❌ [BG] Unhandled error in background profile creation:', err);
        });
      } else {
        setUser(null);
        setUserProfile(null);
      }
    });

    return () => {
      linkingSubscription.remove();
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      console.log('🔐 SignUp context: Starting signup for', email);
      
      const { data, error: signUpError } = await auth.signUp(email, password);
      if (signUpError) throw signUpError;

      if (data && data.user) {
        console.log('✅ SignUp context: User created:', data.user.id);
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          user_metadata: data.user.user_metadata,
        };
        setUser(authUser);

        // Profile creation will happen via onAuthStateChange listener
        // Don't create it here - the listener will catch the auth state change
        console.log('📝 SignUp context: User created, profile will be created by auth listener');
      }
    } catch (err: any) {
      console.error('❌ SignUp context error:', err.message);
      setError(err.message);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error: signInError } = await auth.signIn(email, password);
      if (signInError) throw signInError;

      if (data && data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          user_metadata: data.user.user_metadata,
        };
        setUser(authUser);

        // Fetch profile
        const { data: profileData } = await profile.getProfile(authUser.id);
        if (profileData) {
          setUserProfile(profileData);
        }
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const result = await auth.signInWithGoogle();
      if (result.error) throw result.error;
      
      // Poll for session changes after OAuth (fallback if deep link doesn't work)
      console.log('🔄 Starting session poll after OAuth...');
      let attempts = 0;
      const maxAttempts = 60; // 30 seconds
      
      const pollInterval = setInterval(async () => {
        attempts++;
        const { data: { session }, error } = await auth.getSession();
        console.log(`Poll attempt ${attempts}:`, session?.user?.email);
        
        if (session?.user) {
          console.log('✅ Session found!');
          clearInterval(pollInterval);
        } else if (attempts >= maxAttempts) {
          console.log('❌ Poll timeout');
          clearInterval(pollInterval);
        }
      }, 500);
      
      return;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      console.log('🔐 Signing out...');
      const { error: signOutError } = await auth.signOut();
      if (signOutError) throw signOutError;
      console.log('✅ Sign out complete, clearing user and profile state');
      setUser(null);
      setUserProfile(null);
    } catch (err: any) {
      console.error('❌ Sign out error:', err.message);
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      setError(null);
      if (!user) throw new Error('No user logged in');

      const { data: updatedProfile, error: updateError } = await profile.updateProfile(user.id, data);
      if (updateError) throw updateError;

      if (updatedProfile) {
        setUserProfile(updatedProfile[0]);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const markPreloaderSeen = async () => {
    try {
      if (!user) throw new Error('No user logged in');
      await profile.markPreloaderSeen(user.id);
      if (userProfile) {
        setUserProfile({ ...userProfile, has_seen_preloader: true });
      }
    } catch (err: any) {
      console.error('Error marking preloader seen:', err);
    }
  };

  const completeProfile = async (data: Partial<UserProfile>) => {
    try {
      setError(null);
      if (!user) throw new Error('No user logged in');

      const { data: updatedProfile, error: updateError } = await profile.updateProfile(user.id, {
        ...data,
        profile_completed: true,
      });
      if (updateError) throw updateError;

      if (updatedProfile) {
        setUserProfile(updatedProfile[0]);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        updateProfile,
        markPreloaderSeen,
        completeProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
