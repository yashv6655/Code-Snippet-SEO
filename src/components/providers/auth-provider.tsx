"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { trackEvent } from "@/lib/analytics";
import { logEnvironmentStatus } from "@/lib/env-check";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
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
  
  // Check environment configuration
  const env = logEnvironmentStatus();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Error getting initial session:', error.message);
        }
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Failed to get initial session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
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

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      trackEvent('user_sign_in_failed', {
        error: error.message,
        email_domain: email.split('@')[1]
      });
      return { error: error.message };
    }
    
    // Success event will be tracked by auth state change listener
    return {};
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      trackEvent('user_sign_up_failed', {
        error: error.message,
        email_domain: email.split('@')[1]
      });
      return { error: error.message };
    }
    
    trackEvent('user_sign_up_success', {
      email_domain: email.split('@')[1]
    });
    
    return {};
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
      }
      // Force clear local state
      setUser(null);
      
      // Redirect to login page after logout
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('Failed to sign out:', error);
      // Force clear state even if logout fails
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}