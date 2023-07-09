import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://daazbenqnrozlftxdunx.supabase.co'
const SUPABASE_PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE||'';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
