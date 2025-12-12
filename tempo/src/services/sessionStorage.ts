/**
 * Persistent session storage using React Native AsyncStorage
 * Persists session tokens across app restarts
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_STORAGE_KEY = '@tempo_auth_session';

interface StoredSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
  email: string;
}

class SessionStorage {
  private session: StoredSession | null = null;
  private isInitialized = false;

  /**
   * Initialize storage by loading stored session from AsyncStorage
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      const storedData = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
      if (storedData) {
        this.session = JSON.parse(storedData);
        console.log('✅ Session loaded from AsyncStorage');
      } else {
        console.log('ℹ️ No stored session found in AsyncStorage');
      }
    } catch (err: any) {
      console.warn('⚠️ Could not load stored session from AsyncStorage:', err.message);
    }
    
    this.isInitialized = true;
  }

  /**
   * Save session to AsyncStorage
   */
  async setSession(session: StoredSession): Promise<void> {
    try {
      this.session = session;
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      console.log('💾 Session saved to AsyncStorage');
    } catch (err: any) {
      console.error('❌ Failed to save session to AsyncStorage:', err.message);
      throw err;
    }
  }

  /**
   * Get session from storage
   */
  async getSession(): Promise<StoredSession | null> {
    await this.initialize();
    
    if (this.session) {
      console.log('📂 Session retrieved from memory cache');
      return this.session;
    }
    
    // Try to load from AsyncStorage again if not in memory
    try {
      const storedData = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
      if (storedData) {
        this.session = JSON.parse(storedData);
        console.log('📂 Session retrieved from AsyncStorage');
        return this.session;
      }
    } catch (err: any) {
      console.warn('⚠️ Could not retrieve session from AsyncStorage:', err.message);
    }
    
    console.log('ℹ️ No stored session available');
    return null;
  }

  /**
   * Clear session from storage
   */
  async clearSession(): Promise<void> {
    try {
      this.session = null;
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      console.log('🗑️ Session cleared from AsyncStorage');
    } catch (err: any) {
      console.error('❌ Failed to clear session from AsyncStorage:', err.message);
      throw err;
    }
  }

  /**
   * Check if session is still valid
   */
  async isSessionValid(): Promise<boolean> {
    const session = await this.getSession();
    if (!session) return false;
    
    // Check if token hasn't expired
    const now = Math.floor(Date.now() / 1000);
    return session.expiresAt > now;
  }
}

export const sessionStorage = new SessionStorage();
