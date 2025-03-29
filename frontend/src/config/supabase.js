import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gjjwdrxxioedptzmytto.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqandkcnh4aW9lZHB0em15dHRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyNjQwNDAsImV4cCI6MjA1Mzg0MDA0MH0.AjoldU8N7hYTiDgaNZXwDtqd03Ws5uR2oEnEpGBs3JI';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 