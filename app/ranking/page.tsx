import { getAllPlayers, type RankingRow } from '../../lib/supabase'
import Navbar from '../../components/Navbar'
import TokenTicker from '../../components/TokenTicker'
import RankingClient from '../../components/RankingClient'
import RankingFilters from '../../components/RankingFilters'
import styles from '../../styles/Ranking.module.css'

// Next.js 16: use cache directive instead of revalidate export
export const dynamic = 'force-dynamic'

export default async function RankingPage() {
  const players = await getAllPlayers()

  return (
    <div className={styles.page}>
      <Navbar />
      <TokenTicker />

      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>⚔ LEADERBOARD</h1>
        <p className={styles.pageSub}>
          The mightiest lords of the realm. Ranked by $FARM earned.
        </p>
      </div>

      <RankingFilters />
      <RankingClient initialPlayers={players} />

      <footer className={styles.footer}>
        <span className={styles.footerText}>DUX FARM © 2025 — Built on Solana</span>
        <span className={styles.footerText} style={{ color: 'var(--px-teal)' }}>
          Live data from Supabase
        </span>
      </footer>
    </div>
  )
}
