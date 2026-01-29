
import { createClient } from '@supabase/supabase-js';

// 사용자가 제공한 Publishable Key
const supabaseKey = 'sb_publishable_HnscN7L9pgdbZrl7aUSAIw_UlhUrYLD';

// Supabase Project URL
const supabaseUrl = 'https://bebyagraajhrqkkfcocp.supabase.co';

export const supabase = createClient(supabaseUrl, supabaseKey);
