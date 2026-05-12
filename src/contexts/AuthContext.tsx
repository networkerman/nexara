import React, { createContext, useContext, useState } from 'react';

// Mock user always authenticated — auth bypassed for development
const MOCK_USER = {
  id: 'onextel-user',
  email: 'admin@onextel.com',
  user_metadata: { full_name: 'OneXtel Admin' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as any;

const MOCK_SESSION = {
  access_token: 'mock-token',
  refresh_token: 'mock-refresh',
  expires_in: 3600,
  expires_at: Date.now() + 3600000,
  token_type: 'bearer',
  user: MOCK_USER,
} as any;

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: null }>;
  signUp: (email: string, password: string) => Promise<{ error: null }>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState(MOCK_USER);
  const [session] = useState(MOCK_SESSION);

  const signIn = async () => ({ error: null });
  const signUp = async () => ({ error: null });
  const signOut = async () => {};

  return (
    <AuthContext.Provider value={{ user, session, loading: false, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
