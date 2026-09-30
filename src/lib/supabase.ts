import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client (uses service role key)
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Types for uploads table
export interface UploadRecord {
  id?: string;
  user_session_id: string;
  cloudinary_public_id: string;
  original_url: string;
  platform_urls: {
    instagram: string;
    whatsapp: string;
    flipkart: string;
    amazon: string;
    facebook: string;
    meesho: string;
  };
  tags: string[];
  captions: {
    instagram: string[];
    whatsapp: string[];
    flipkart: string[];
    facebook: string[];
  };
  background_style?: string;
  created_at?: string;
}

/**
 * Save an upload record to Supabase.
 */
export async function saveUpload(data: Omit<UploadRecord, 'id' | 'created_at'>) {
  const adminClient = createAdminClient();
  const { data: record, error } = await adminClient
    .from('uploads')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Failed to save upload: ${error.message}`);
  }

  return record;
}

/**
 * Get all uploads for a session.
 */
export async function getUploadsForSession(sessionId: string): Promise<UploadRecord[]> {
  const { data, error } = await supabase
    .from('uploads')
    .select('*')
    .eq('user_session_id', sessionId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase fetch error:', error);
    return [];
  }

  return data || [];
}

/**
 * SQL to run in Supabase SQL editor to create the uploads table.
 *
 * create table uploads (
 *   id uuid primary key default gen_random_uuid(),
 *   user_session_id text not null,
 *   cloudinary_public_id text not null,
 *   original_url text,
 *   platform_urls jsonb,
 *   tags text[],
 *   captions jsonb,
 *   background_style text,
 *   created_at timestamptz default now()
 * );
 */
