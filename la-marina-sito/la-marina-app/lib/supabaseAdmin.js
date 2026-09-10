import { createClient } from '@supabase/supabase-js';

// Questo client usa la chiave "service_role": bypassa le regole di sicurezza (RLS)
// e va usato ESCLUSIVAMENTE dentro le API route (app/api/...), mai nel browser.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);
