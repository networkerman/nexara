import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for admin session first
    const adminSession = localStorage.getItem('adminSession');
    console.log('AuthContext: Checking admin session:', adminSession);
    
    if (adminSession === 'true') {
      // Create a mock user for admin session
      const mockUser = {
        id: 'admin-user',
        email: 'admin@gmail.com',
        user_metadata: {},
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User;
      
      console.log('AuthContext: Setting admin user:', mockUser);
      setUser(mockUser);
      setSession({
        access_token: 'mock-token',
        refresh_token: 'mock-refresh',
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
        token_type: 'bearer',
        user: mockUser,
      } as Session);
      setLoading(false);
      return;
    }

    console.log('AuthContext: No admin session, checking Supabase...');
    
    // Test Supabase connection first
    supabase.from('campaigns').select('count').limit(1).then(({ error }) => {
      if (error) {
        console.error('AuthContext: Supabase connection test failed:', error);
      } else {
        console.log('AuthContext: Supabase connection test successful');
      }
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('AuthContext: Supabase session:', session);
      if (error) {
        console.error('AuthContext: Error getting session:', error);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthContext: Auth state change:', _event, session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    // Clear admin session if it exists
    localStorage.removeItem('adminSession');
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
