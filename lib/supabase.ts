import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlayerClass = 'Knight' | 'Rogue' | 'Wizard'

export interface Player {
  id: string
  wallet_address: string
  username: string
  class: PlayerClass
  level: number
  xp: number
  farm_earned: number
  farm_balance: number
  nfts_minted: number
  daily_streak: number
  last_active: string
  created_at: string
}

export interface RankingRow extends Player {
  rank: number
}

export interface ActivityEvent {
  id: string
  player_id: string
  username: string
  class: PlayerClass
  event_type: 'craft' | 'farm' | 'kill' | 'sell' | 'streak' | 'mint'
  description: string
  value?: number
  created_at: string
}

// ─── Lazy client (safe for Next.js 16 build time) ────────────────────────────
// createClient is called only when a function is invoked, never at module load.
// This prevents "supabaseUrl is required" during static page collection.

let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
    )
  }

  _client = createClient(url, key)
  return _client
}

// ─── Exported query helpers ───────────────────────────────────────────────────
// Pages import these instead of the raw client.

export async function getTopPlayers(limit = 7): Promise<RankingRow[]> {
  try {
    const { data, error } = await getClient()
      .from('ranking')
      .select('*')
      .limit(limit)

    if (error || !data) return []
    return data as RankingRow[]
  } catch {
    return []
  }
}

export async function getAllPlayers(): Promise<RankingRow[]> {
  try {
    const { data, error } = await getClient()
      .from('ranking')
      .select('*')
      .order('farm_earned', { ascending: false })

    if (error || !data) return []
    return data as RankingRow[]
  } catch {
    return []
  }
}

export async function getRecentActivity(limit = 10): Promise<ActivityEvent[]> {
  try {
    const { data, error } = await getClient()
      .from('activity_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !data) return []
    return data as ActivityEvent[]
  } catch {
    return []
  }
}

// Raw client — for realtime subscriptions in client components
export function getSupabaseClient(): SupabaseClient {
  return getClient()
}
