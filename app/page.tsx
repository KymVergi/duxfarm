import Link from 'next/link'
import { getTopPlayers, type RankingRow, type PlayerClass } from '../lib/supabase'
import Navbar from '../components/Navbar'
import TokenTicker from '../components/TokenTicker'
import ActivityFeed from '../components/ActivityFeed'
import HeroSprite from '../components/HeroSprite'
import styles from '../styles/Home.module.css'

const CLASS_BADGE: Record<PlayerClass, string> = {
  Knight: styles.badgeKnight,
  Rogue:  styles.badgeRogue,
  Wizard: styles.badgeWizard,
}

function rankClass(rank: number) {
  if (rank === 1) return styles.rank1
  if (rank === 2) return styles.rank2
  if (rank === 3) return styles.rank3
  return styles.rankN
}

export default async function HomePage() {
  const players = await getTopPlayers(7)

  return (
    <div className={styles.page}>
      <Navbar />
      <TokenTicker />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroEyebrow}>MEDIEVAL P2E RPG ON ETHEREUM</div>
          <h1 className={styles.heroTitle}>DUX<br />FARM</h1>
          <div className={styles.heroSubtitle}>FORGE YOUR LEGEND</div>
          <p className={styles.heroDesc}>
            Enter a pixel realm of dungeons, farms and ancient magic.<br />
            Farm resources, craft legendary items, and rise through<br />
            the ranks. Every item you forge is an NFT. Every session<br />
            earns you $FARM. Own your destiny on-chain.
          </p>
          <div className={styles.heroTags}>
            <span className={`${styles.heroTag} ${styles.tagEthereum}`}>Ethereum</span>
            <span className={`${styles.heroTag} ${styles.tagP2E}`}>P2E</span>
            <span className={`${styles.heroTag} ${styles.tagPixel}`}>Pixel RPG</span>
            <span className={`${styles.heroTag} ${styles.tagMedieval}`}>Medieval</span>
          </div>
          <div className={styles.heroActions}>
            <Link href="/play">
              <button className={styles.btnPrimary}>[ ENTER THE REALM ]</button>
            </Link>
            <Link href="/lore"><button className={styles.btnSecondary}>[ READ LORE ]</button></Link>
          </div>
        </div>

        <div className={styles.heroScene}>
          <div className={styles.heroSceneBg} />
          <div className={styles.heroSceneTitle}>— THE REALM —</div>
          <div className={styles.spriteBox}>
            <HeroSprite />
          </div>
          <div className={styles.heroSceneFloor} />
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>$FARM supply</div>
          <div className={`${styles.statVal} px-gold`}>50,000,000</div>
          <div className={styles.statChange}>Fixed supply</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Lords active</div>
          <div className={`${styles.statVal} px-green`}>8,412</div>
          <div className={styles.statChange}>+124 today</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>NFTs minted</div>
          <div className={`${styles.statVal} px-purple`}>14,820</div>
          <div className={styles.statChange}>+38 today</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>24h volume</div>
          <div className={`${styles.statVal} px-teal`}>824 SOL</div>
          <div className={styles.statChange}>+12.4%</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>$FARM price</div>
          <div className={`${styles.statVal} px-gold`}>0.084 SOL</div>
          <div className={styles.statChange}>+4.2%</div>
        </div>
      </div>

      {/* ── HOW TO PLAY ───────────────────────────────────────────── */}
      <section className={styles.howToPlay}>
        <div className={styles.sectionTitle}>HOW TO PLAY</div>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNum}>01</div>
            <div className={styles.stepIcon}>🌲</div>
            <div className={styles.stepTitle}>FARM</div>
            <div className={styles.stepDesc}>
              Explore the realm. Chop trees, mine rocks, fish rivers
              and harvest crops. Resources respawn over time.
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>02</div>
            <div className={styles.stepIcon}>⚒</div>
            <div className={styles.stepTitle}>CRAFT</div>
            <div className={styles.stepDesc}>
              Bring resources to craft stations — Sawmill, Furnace,
              Alchemy table, Anvil. Create weapons, potions and tools.
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>03</div>
            <div className={styles.stepIcon}>✨</div>
            <div className={styles.stepTitle}>MINT</div>
            <div className={styles.stepDesc}>
              Crafted items become NFTs on Ethereum. Each one unique,
              tradeable and permanently yours. Rare recipes = rare NFTs.
            </div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>04</div>
            <div className={styles.stepIcon}>💰</div>
            <div className={styles.stepTitle}>EARN</div>
            <div className={styles.stepDesc}>
              Daily sessions earn $FARM tokens. Sell NFTs in the
              marketplace. 7-day streaks grant 2x multipliers.
            </div>
          </div>
        </div>
      </section>

      {/* ── CLASSES ───────────────────────────────────────────────── */}
      <section className={styles.classes}>
        <div className={styles.sectionTitle}>CHOOSE YOUR CLASS</div>
        <div className={styles.classCards}>

          <div className={`${styles.classCard} ${styles.classCardKnight}`}>
            <div className={styles.classCardBg} />
            <div className={styles.classSprite}>⚔️</div>
            <div className={styles.className}>KNIGHT</div>
            <div className={styles.classDesc}>
              Masters of melee combat and heavy armor.
              Knights deal maximum damage to Orcs and Skeletons,
              and can carry more resources per trip.
            </div>
            <div className={styles.classStats}>
              {[
                { name: 'Strength', val: 90, color: 'var(--px-gold)' },
                { name: 'Speed',    val: 50, color: 'var(--px-gold)' },
                { name: 'Magic',    val: 20, color: 'var(--px-gold)' },
                { name: 'Farming',  val: 70, color: 'var(--px-gold)' },
              ].map(s => (
                <div key={s.name} className={styles.classStat}>
                  <span className={styles.classStatName}>{s.name}</span>
                  <div className={styles.classStatBar}>
                    <div className={styles.classStatFill} style={{ width: `${s.val}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.classCard} ${styles.classCardRogue}`}>
            <div className={styles.classCardBg} />
            <div className={styles.classSprite}>🗡️</div>
            <div className={styles.className}>ROGUE</div>
            <div className={styles.classDesc}>
              Swift and stealthy. Rogues move faster, find
              rare resources more often, and get bonus loot
              from defeated enemies.
            </div>
            <div className={styles.classStats}>
              {[
                { name: 'Strength', val: 55, color: 'var(--px-purple)' },
                { name: 'Speed',    val: 95, color: 'var(--px-purple)' },
                { name: 'Magic',    val: 40, color: 'var(--px-purple)' },
                { name: 'Farming',  val: 75, color: 'var(--px-purple)' },
              ].map(s => (
                <div key={s.name} className={styles.classStat}>
                  <span className={styles.classStatName}>{s.name}</span>
                  <div className={styles.classStatBar}>
                    <div className={styles.classStatFill} style={{ width: `${s.val}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.classCard} ${styles.classCardWizard}`}>
            <div className={styles.classCardBg} />
            <div className={styles.classSprite}>🔮</div>
            <div className={styles.className}>WIZARD</div>
            <div className={styles.classDesc}>
              Wielders of arcane power. Wizards craft potions
              and magical items faster, unlock exclusive Alchemy
              recipes and deal AoE damage.
            </div>
            <div className={styles.classStats}>
              {[
                { name: 'Strength', val: 30, color: 'var(--px-teal)' },
                { name: 'Speed',    val: 60, color: 'var(--px-teal)' },
                { name: 'Magic',    val: 98, color: 'var(--px-teal)' },
                { name: 'Farming',  val: 65, color: 'var(--px-teal)' },
              ].map(s => (
                <div key={s.name} className={styles.classStat}>
                  <span className={styles.classStatName}>{s.name}</span>
                  <div className={styles.classStatBar}>
                    <div className={styles.classStatFill} style={{ width: `${s.val}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── RANKING + ACTIVITY ────────────────────────────────────── */}
      <div className={styles.main}>
        <div className={styles.rankingPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>
              <svg className={styles.panelTitleIcon} viewBox="0 0 14 14">
                <rect x="5" y="0" width="4" height="2" fill="#f0c040"/>
                <rect x="3" y="2" width="8" height="6" fill="#f0c040"/>
                <rect x="1" y="4" width="2" height="4" fill="#c8962a"/>
                <rect x="11" y="4" width="2" height="4" fill="#c8962a"/>
                <rect x="5" y="8" width="4" height="2" fill="#c8962a"/>
                <rect x="4" y="10" width="6" height="2" fill="#5a3a1a"/>
                <rect x="3" y="12" width="8" height="2" fill="#5a3a1a"/>
              </svg>
              TOP LORDS
            </div>
            <Link href="/ranking">
              <button className={styles.viewAllBtn}>[ FULL RANKING ]</button>
            </Link>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Lord</th>
                <th>Class</th>
                <th>Lvl</th>
                <th>$FARM</th>
                <th>NFTs</th>
                <th>Streak</th>
              </tr>
            </thead>
            <tbody>
              {players.length > 0 ? players.map((p: RankingRow) => (
                <tr key={p.id}>
                  <td className={rankClass(p.rank)}>{String(p.rank).padStart(2,'0')}</td>
                  <td><span className={styles.avatar} />{p.username}</td>
                  <td><span className={`${styles.badge} ${CLASS_BADGE[p.class]}`}>{p.class}</span></td>
                  <td className={rankClass(p.rank)}>{p.level}</td>
                  <td className={rankClass(p.rank)}>{p.farm_earned.toLocaleString()}</td>
                  <td>{p.nfts_minted}</td>
                  <td className={p.daily_streak >= 7 ? styles.streak : styles.streakLow}>{p.daily_streak}d</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} style={{ textAlign:'center', color:'var(--px-muted)', padding:'24px' }}>
                    No lords yet — be the first!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ActivityFeed />
      </div>

      {/* ── TOKEN ─────────────────────────────────────────────────── */}
      <section className={styles.tokenSection}>
        <div className={styles.tokenInfo}>
          <div className={styles.tokenTitle}>$FARM TOKEN</div>
          <p className={styles.tokenDesc}>
            The lifeblood of the realm. $FARM is earned through gameplay,
            spent on crafting, and traded freely on Ethereum DEXs.
            Fixed supply — no inflation, no team minting.
          </p>
          <div className={styles.tokenomicsGrid}>
            {[
              { label: 'Total supply',    val: '50,000,000' },
              { label: 'Play rewards',    val: '40%' },
              { label: 'Liquidity pool',  val: '30%' },
              { label: 'Team (2yr lock)', val: '15%' },
              { label: 'Treasury',        val: '10%' },
              { label: 'Airdrop',         val: '5%' },
            ].map(t => (
              <div key={t.label} className={styles.tokenomicsItem}>
                <div className={styles.tokenomicsLabel}>{t.label}</div>
                <div className={styles.tokenomicsVal}>{t.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.useCases}>
          {[
            { icon: '⚒', title: 'Craft rare items', desc: 'Burn $FARM to unlock legendary crafting recipes not available otherwise.' },
            { icon: '🏰', title: 'Upgrade stations', desc: 'Spend $FARM to upgrade your Sawmill, Furnace and Alchemy table for faster crafting.' },
            { icon: '🛒', title: 'Marketplace fees', desc: 'Pay marketplace listing fees in $FARM. Holding 1000+ $FARM gets you zero fees.' },
            { icon: '🗳', title: 'Governance', desc: 'Vote on new game content, item drops, seasonal events and protocol changes.' },
          ].map(u => (
            <div key={u.title} className={styles.useCase}>
              <div className={styles.useCaseIcon}>{u.icon}</div>
              <div>
                <div className={styles.useCaseTitle}>{u.title}</div>
                <div className={styles.useCaseText}>{u.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <span className={styles.footerText}>DUX FARM © 2026 — Built on Ethereum</span>
        <span className={styles.footerText} style={{ color: 'var(--px-teal)' }}>$FARM contract: coming soon</span>
      </footer>
    </div>
  )
}
