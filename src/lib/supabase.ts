import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function hasSupabaseServiceEnv(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
    _supabase = createClient(supabaseUrl, supabaseServiceKey);
  }
  return _supabase;
}
