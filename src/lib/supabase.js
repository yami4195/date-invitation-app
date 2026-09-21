import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(rawUrl && rawKey);

// Fallback to prevent createClient from throwing on module initialization
const supabaseUrl = rawUrl || 'https://placeholder.supabase.co';
const supabaseKey = rawKey || 'placeholder-anon-key';

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY) are missing in production. Please add them in your Vercel Dashboard.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
