'use client'

import { useState, useMemo } from 'react'
import { type RankingRow, type PlayerClass } from '../lib/supabase'
import styles from '../styles/Ranking.module.css'

type SortKey = 'rank' | 'level' | 'farm_earned' | 'nfts_minted' | 'daily_streak'
type ClassFilter = 'All' | PlayerClass
type PeriodFilter = 'all' | '7d' | '30d'

const CLASS_BADGE: Record<PlayerClass, string> = {
  Knight: styles.badgeKnight,
  Rogue:  styles.badgeRogue,
  Wizard: styles.badgeWizard,
}

const CLASS_COLORS: Record<PlayerClass, string> = {
  Knight: 'var(--px-gold)',
  Rogue:  'var(--px-purple)',
  Wizard: 'var(--px-teal)',
}

function streakClass(streak: number) {
  if (streak >= 14) return styles.streakHigh
  if (streak >= 5)  return styles.streakMid
  return styles.streakLow
}

function xpPct(xp: number, level: number): number {
  const needed = level * 1400
  return Math.min(100, Math.round((xp % needed) / needed * 100))
}

const ROWS_PER_PAGE = 10

interface Props {
  initialPlayers: RankingRow[]
}

export default function RankingClient({ initialPlayers }: Props) {
  const [classFilter, setClassFilter] = useState<ClassFilter>('All')
  const [search, setSearch]           = useState('')
  const [sortKey, setSortKey]         = useState<SortKey>('rank')
  const [sortAsc, setSortAsc]         = useState(true)
  const [page, setPage]               = useState(1)

  // Filter + search
  const filtered = useMemo(() => {
    return initialPlayers.filter(p => {
      if (classFilter !== 'All' && p.class !== classFilter) return false
      if (search && !p.username.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [initialPlayers, classFilter, search])

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const va = a[sortKey] as number
      const vb = b[sortKey] as number
      return sortAsc ? va - vb : vb - va
    })
  }, [filtered, sortKey, sortAsc])

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / ROWS_PER_PAGE))
  const pageRows = sorted.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE)

  // Top 3 for podium (always from full rank list, not filtered)
  const top3 = initialPlayers.filter(p => p.rank <= 3).sort((a, b) => a.rank - b.rank)

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(p => !p)
    else { setSortKey(key); setSortAsc(false) }
    setPage(1)
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return ' ↕'
    return sortAsc ? ' ↑' : ' ↓'
  }

  // Class breakdown counts
  const classCounts = useMemo(() => {
    const total = initialPlayers.length || 1
    return (['Knight','Rogue','Wizard'] as PlayerClass[]).map(cls => ({
      cls,
      count: initialPlayers.filter(p => p.class === cls).length,
      pct: Math.round(initialPlayers.filter(p => p.class === cls).length / total * 100),
    }))
  }, [initialPlayers])

  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean)

  return (
    <div className={styles.main}>

      {/* ── Table panel ───────────────────────────────────────────── */}
      <div className={styles.tablePanel}>

        {/* Podium */}
        {top3.length > 0 && (
          <div className={styles.podium}>
            {podiumOrder.map((p) => {
              const cardClass = p.rank === 1 ? styles.first : p.rank === 2 ? styles.second : styles.third
              const rankEmoji = p.rank === 1 ? '👑' : p.rank === 2 ? '🥈' : '🥉'
              return (
                <div key={p.id} className={`${styles.podiumCard} ${cardClass}`}>
                  <div className={styles.podiumRank}>{rankEmoji}</div>
                  <div className={styles.podiumName}>{p.username}</div>
                  <div className={`${styles.podiumBadge} ${CLASS_BADGE[p.class]}`}>{p.class}</div>
                  <div className={styles.podiumFarm}>{p.farm_earned.toLocaleString()} $FARM</div>
                  <div className={styles.podiumLevel}>Lvl {p.level} · {p.nfts_minted} NFTs</div>
                </div>
              )
            })}
          </div>
        )}

        <div className={styles.tableHeader}>ALL LORDS — RANK #{(page - 1) * ROWS_PER_PAGE + 1} TO #{Math.min(page * ROWS_PER_PAGE, sorted.length)}</div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Lord</th>
              <th>Class</th>
              <th className={styles.sortable} onClick={() => toggleSort('level')}>Lvl{sortIndicator('level')}</th>
              <th className={styles.sortable} onClick={() => toggleSort('farm_earned')}>$FARM{sortIndicator('farm_earned')}</th>
              <th className={styles.sortable} onClick={() => toggleSort('nfts_minted')}>NFTs{sortIndicator('nfts_minted')}</th>
              <th className={styles.sortable} onClick={() => toggleSort('daily_streak')}>Streak{sortIndicator('daily_streak')}</th>
              <th>XP</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((p) => {
              const rc = p.rank === 1 ? styles.rank1 : p.rank === 2 ? styles.rank2 : p.rank === 3 ? styles.rank3 : styles.rankN
              return (
                <tr key={p.id}>
                  <td className={rc}>{String(p.rank).padStart(2,'0')}</td>
                  <td>
                    <span className={styles.avatar} />
                    {p.username}
                  </td>
                  <td>
                    <span className={`${styles.badge} ${CLASS_BADGE[p.class]}`}>{p.class}</span>
                  </td>
                  <td className={rc}>{p.level}</td>
                  <td className={rc}>{p.farm_earned.toLocaleString()}</td>
                  <td>{p.nfts_minted}</td>
                  <td className={streakClass(p.daily_streak)}>{p.daily_streak}d</td>
                  <td>
                    <div className={styles.xpBar}>
                      <div className={styles.xpFill} style={{ width: `${xpPct(p.xp, p.level)}%` }} />
                    </div>
                  </td>
                </tr>
              )
            })}

            {pageRows.length === 0 && (
              <tr>
                <td colSpan={8} className={styles.empty}>No lords match your search.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button className={styles.pageBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              ◀
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`${styles.pageBtn} ${n === page ? styles.pageBtnActive : ''}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button className={styles.pageBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              ▶
            </button>
          </div>
        )}
      </div>

      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <div className={styles.sidebar}>
        <div className={styles.sideTitle}>REALM STATS</div>

        <div className={styles.statCard}>
          <div className={styles.statCardLabel}>Total lords</div>
          <div className={`${styles.statCardVal} px-green`}>{initialPlayers.length.toLocaleString()}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardLabel}>$FARM distributed</div>
          <div className={`${styles.statCardVal} px-gold`}>
            {initialPlayers.reduce((s, p) => s + p.farm_earned, 0).toLocaleString()}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardLabel}>Total NFTs minted</div>
          <div className={`${styles.statCardVal} px-purple`}>
            {initialPlayers.reduce((s, p) => s + p.nfts_minted, 0).toLocaleString()}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardLabel}>Avg level</div>
          <div className={`${styles.statCardVal} px-teal`}>
            {initialPlayers.length > 0
              ? Math.round(initialPlayers.reduce((s, p) => s + p.level, 0) / initialPlayers.length)
              : 0}
          </div>
        </div>

        <div className={styles.classBreakdown}>
          <div className={styles.sideTitle}>CLASS BREAKDOWN</div>
          {classCounts.map(({ cls, count, pct }) => (
            <div key={cls} className={styles.classRow}>
              <span className={styles.classRowName} style={{ color: CLASS_COLORS[cls] }}>
                {cls}
              </span>
              <div className={styles.classBar}>
                <div className={styles.classBarFill} style={{ width: `${pct}%`, background: CLASS_COLORS[cls] }} />
              </div>
              <span className={styles.classRowPct}>{count} ({pct}%)</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
