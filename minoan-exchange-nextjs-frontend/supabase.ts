// supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://daazbenqnrozlftxdunx.supabase.co'
const SUPABASE_PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE||'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhYXpiZW5xbnJvemxmdHhkdW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM2NDYyMzksImV4cCI6MTk5OTIyMjIzOX0.yUuYMMr3NITOUrcAn87xYCS49yxRbjMaCo1Utrd37Ro';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
