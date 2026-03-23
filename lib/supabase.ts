import { createClient } from '@supabase/supabase-js'

const getEnv = (name: string) => {
  const value = process.env[name]
  return value && value.trim().length > 0 ? value : null
}

const getPublicClientConfig = () => {
  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL')
  const key = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  if (!url || !key) return null
  return { url, key }
}

const getServerClientConfig = () => {
  const url = getEnv('NEXT_PUBLIC_SUPABASE_URL')
  const key = getEnv('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !key) return null
  return { url, key }
}

export const getSupabaseClient = () => {
  const config = getPublicClientConfig()
  if (!config) return null
  return createClient(config.url, config.key)
}

export const createServerClient = () => {
  const config = getServerClientConfig()
  if (!config) return null
  return createClient(
    config.url,
    config.key
  )
}
