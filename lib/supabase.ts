
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mfovqkdjybzpachpmgra.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mb3Zxa2RqeWJ6cGFjaHBtZ3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzI2ODYsImV4cCI6MjA3NTM0ODY4Nn0.NmtJ_rU3DUdR6qoGzw65jNJoDL7O4qLyE9nbeBmBfgM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
