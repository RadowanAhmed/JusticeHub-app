// apps/mobile/src/lib/supabase.ts
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/shared/types/database';
import { AppState } from 'react-native';

const supabaseUrl = "https://imeajikgrhlrbdulbirf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZWFqaWtncmhscmJkdWxiaXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3OTUxOTUsImV4cCI6MjA4MTM3MTE5NX0.3TCreBfk4gsuRUJ508b4M91GA0cr7HcmScyOis5bMxM";

// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});


// Handle app state changes
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});