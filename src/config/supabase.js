import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lkwncsxkepcljwbhutpx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd25jc3hrZXBjbGp3Ymh1dHB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5Mjc1NzQsImV4cCI6MjA5MzUwMzU3NH0.e-QZ4LmY2t4ZiPISFxFDbZ8s_V7xpA6fM3rvMyTO5Oc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
