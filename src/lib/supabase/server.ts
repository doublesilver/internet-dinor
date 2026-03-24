import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function hasSupabaseAdminEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function hasSupabaseAnonEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

// Supabase JS 클라이언트는 stateless이므로 모듈 레벨 캐시 안전.
// Next.js 서버 환경에서 모듈은 프로세스당 한 번만 초기화되어 커넥션 풀이 재사용됨.
let cachedAdminClient: SupabaseClient | null = null;
let cachedAnonClient: SupabaseClient | null = null;

export function createSupabaseAdminClient() {
  if (cachedAdminClient) return cachedAdminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are missing.");
  }

  cachedAdminClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedAdminClient;
}

export function createSupabaseAnonClient() {
  if (cachedAnonClient) return cachedAnonClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase anon environment variables are missing.");
  }

  cachedAnonClient = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedAnonClient;
}
