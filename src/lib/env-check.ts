/**
 * Environment validation utilities
 */

export function validateEnvironment() {
  const requiredVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const missing = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  return {
    isValid: missing.length === 0,
    missing,
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  };
}

export function logEnvironmentStatus() {
  const env = validateEnvironment();
  
  if (!env.isValid) {
    console.warn('⚠️ Missing environment variables:', env.missing);
    if (env.isDevelopment) {
      console.warn('📝 Create a .env.local file with your Supabase credentials');
    }
  } else {
    console.log('✅ Environment variables configured correctly');
  }
  
  return env;
}
