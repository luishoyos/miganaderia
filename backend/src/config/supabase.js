import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration');
}

// Cliente con anon key (para operaciones públicas)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Cliente con service role key (para operaciones administrativas)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
