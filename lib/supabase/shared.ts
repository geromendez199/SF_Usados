const readEnv = (name: string) => {
  const value = process.env[name]
  if (!value || value.trim().length === 0) return null
  return value
}

export const getSupabaseUrl = () => readEnv('NEXT_PUBLIC_SUPABASE_URL')
export const getSupabaseAnonKey = () => readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
export const getSupabaseServiceRoleKey = () => readEnv('SUPABASE_SERVICE_ROLE_KEY')
