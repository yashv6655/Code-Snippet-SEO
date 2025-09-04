"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { trackEvent } from "@/lib/analytics";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id || 'no user');
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Track authentication events
        try {
          if (event === 'SIGNED_IN') {
            trackEvent('user_signed_in', {
              user_id: session?.user?.id,
              provider: session?.user?.app_metadata?.provider || 'email'
            });
          } else if (event === 'SIGNED_OUT') {
            trackEvent('user_signed_out');
          } else if (event === 'TOKEN_REFRESHED') {
            trackEvent('user_session_refreshed');
          }
        } catch (error) {
          console.warn('Error tracking auth event:', error);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const refreshUser = async () => {
    const { data: { user: refreshedUser } } = await supabase.auth.getUser();
    setUser(refreshedUser ?? null);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}