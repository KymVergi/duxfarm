'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import styles from '../styles/Ranking.module.css'

const CLASSES = ['All', 'Knight', 'Rogue', 'Wizard'] as const
const PERIODS  = [
  { key: 'all', label: 'All time' },
  { key: '30d', label: '30 days' },
  { key: '7d',  label: '7 days'  },
] as const

export default function RankingFilters() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const cls    = searchParams.get('class')  || 'All'
  const period = searchParams.get('period') || 'all'
  const q      = searchParams.get('q')      || ''

  const update = useCallback((key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, val)
    if (key !== 'q') params.delete('page')
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [searchParams, pathname, router])

  return (
    <div className={styles.filters}>
      <span className={styles.filterLabel}>CLASS</span>
      <div className={styles.filterGroup}>
        {CLASSES.map(c => (
          <button
            key={c}
            className={`${styles.filterBtn} ${cls === c ? styles.filterBtnActive : ''}`}
            onClick={() => update('class', c)}
          >
            {c}
          </button>
        ))}
      </div>

      <span className={styles.filterLabel}>PERIOD</span>
      <div className={styles.filterGroup}>
        {PERIODS.map(p => (
          <button
            key={p.key}
            className={`${styles.filterBtn} ${period === p.key ? styles.filterBtnActive : ''}`}
            onClick={() => update('period', p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <input
        className={styles.searchBox}
        placeholder="[ Search lord... ]"
        value={q}
        onChange={e => update('q', e.target.value)}
      />
    </div>
  )
}
