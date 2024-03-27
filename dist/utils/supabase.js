import { createClient } from '@supabase/supabase-js';
const supabaseUrl = "https://csipyhzksqwfkwzjmjwd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzaXB5aHprc3F3Zmt3emptandkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAwOTEyMDEsImV4cCI6MjAyNTY2NzIwMX0.sxmLow56YtWzRYyC7k8EFsUikKHIK9flLuPBONe-fWc";
export const supabase = createClient(supabaseUrl, supabaseKey);
