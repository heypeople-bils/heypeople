
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://dnssuvvvsngmuntzniuo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuc3N1dnZ2c25nbXVudHpuaXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMzY3NzEsImV4cCI6MjA4OTcxMjc3MX0.JXBrFGZAhOn0sxc2efG4i5QLLVrGc9yiYT_qiS5Z1F0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Rendo supabase disponibile globalmente (per index.html)
window.supabase = supabase;