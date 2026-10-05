// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://njwswymridgvwchkdlgc.supabase.co';
const supabaseKey = 'sb_publishable_S50cvD7gtBqNq5kUIRhWLg_KfMvJZ74';

export const supabase = createClient(supabaseUrl, supabaseKey);