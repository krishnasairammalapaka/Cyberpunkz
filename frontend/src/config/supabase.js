import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sutefagkbpgfdfndiynw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1dGVmYWdrYnBnZmRmbmRpeW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNDI1NjUsImV4cCI6MjA1ODcxODU2NX0.aYIR1R8B7KDqi2vzFNnMTEXl3TJjVvFVZ8meXj6uc7E';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 