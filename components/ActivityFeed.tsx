'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient, getRecentActivity, type ActivityEvent, type PlayerClass } from '../lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'
import styles from '../styles/ActivityFeed.module.css'

const CLASS_COLORS: Record<PlayerClass, string> = {
  Knight: 'var(--px-gold)',
  Rogue:  'var(--px-purple)',
  Wizard: 'var(--px-teal)',
}

const EVENT_ICONS: Record<ActivityEvent['event_type'], string> = {
  craft:  '⚔',
  farm:   '🌲',
  kill:   '💀',
  sell:   '💰',
  streak: '🔥',
  mint:   '✨',
}

const SEED_EVENTS: ActivityEvent[] = [
  { id:'1', player_id:'a', username:'CryptoKnight',  class:'Knight', event_type:'craft',  description:'crafted a Legendary Bone Axe NFT',        created_at: new Date(Date.now()-120000).toISOString() },
  { id:'2', player_id:'b', username:'ShadowRogue',   class:'Rogue',  event_type:'farm',   description:'farmed +340 Wood in Forest Zone',          created_at: new Date(Date.now()-300000).toISOString() },
  { id:'3', player_id:'c', username:'OrcSlayer99',   class:'Knight', event_type:'kill',   description:'defeated an Orc Warrior Boss',             created_at: new Date(Date.now()-540000).toISOString() },
  { id:'4', player_id:'d', username:'ArcaneWizzard', class:'Wizard', event_type:'sell',   description:'sold Health Potion x20 for 12 SOL',        created_at: new Date(Date.now()-660000).toISOString() },
  { id:'5', player_id:'e', username:'BoneCollector', class:'Rogue',  event_type:'streak', description:'reached a 47-day streak! 2x bonus claimed', created_at: new Date(Date.now()-900000).toISOString() },
]

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

export default function ActivityFeed() {
  const [events, setEvents] = useState<ActivityEvent[]>(SEED_EVENTS)

  useEffect(() => {
    getRecentActivity(10).then(data => {
      if (data.length > 0) setEvents(data)
    })

    let channel: RealtimeChannel | null = null
    try {
      const client = getSupabaseClient()
      channel = client
        .channel('activity_feed')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'activity_events' },
          (payload) => {
            setEvents(prev => [payload.new as ActivityEvent, ...prev.slice(0, 9)])
          }
        )
        .subscribe()
    } catch {
      // Supabase not configured yet — seed data stays
    }

    return () => {
      if (channel) {
        try { getSupabaseClient().removeChannel(channel) } catch {}
      }
    }
  }, [])

  return (
    <div className={styles.feed}>
      <div className={styles.header}>
        <span className={styles.dot} />
        LIVE ACTIVITY
      </div>
      <div className={styles.list}>
        {events.map((ev) => (
          <div key={ev.id} className={styles.item}>
            <div className={styles.icon}>{EVENT_ICONS[ev.event_type]}</div>
            <div className={styles.content}>
              <span style={{ color: CLASS_COLORS[ev.class] }}>{ev.username}</span>
              {' '}{ev.description}
              <div className={styles.time}>{timeAgo(ev.created_at)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
