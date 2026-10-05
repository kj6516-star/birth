import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; 
// (환경 변수 이름은 본인이 .env에 적어둔 이름에 맞추시면 됩니다)

export const supabase = createClient(supabaseUrl, supabaseKey);