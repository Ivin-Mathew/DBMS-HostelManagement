// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cktahfosepepxjmynuuz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrdGFoZm9zZXBlcHhqbXludXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0OTg0NjYsImV4cCI6MjA0MzA3NDQ2Nn0.2BxVl87IWm9Q1he5ByYBk3tY8RelUVfxMFsXajsyFFE';

export const supabase = createClient(supabaseUrl, supabaseKey);