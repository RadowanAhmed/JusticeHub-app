// lib/supabase-admin.ts
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://imeajikgrhlrbdulbirf.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZWFqaWtncmhscmJkdWxiaXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3OTUxOTUsImV4cCI6MjA4MTM3MTE5NX0.3TCreBfk4gsuRUJ508b4M91GA0cr7HcmScyOis5bMxM';
const supabaseServiceKey = Constants.expoConfig?.extra?.supabaseServiceKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZWFqaWtncmhscmJkdWxiaXJmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTc5NTE5NSwiZXhwIjoyMDgxMzcxMTk1fQ.UvdasZPzV8efO8krSTJR-8GX3YEKACKGE5UDfoyhSV0';



export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});