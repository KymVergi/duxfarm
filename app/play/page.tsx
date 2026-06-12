'use client'

import dynamic from 'next/dynamic'
import Navbar from '../../components/Navbar'
import styles from '../../styles/Game.module.css'

const GameCanvas = dynamic(() => import('../../components/game/GameCanvas'), {
  ssr: false,
  loading: () => (
    <div style={{
      width:'100%', height:'538px', background:'#08080f',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'"Press Start 2P"', fontSize:'9px', color:'#f0c040',
    }}>
      INITIALIZING ENGINE...
    </div>
  ),
})

export default function PlayPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.layout}>
        <GameCanvas />
        <aside className={styles.sidebar}>
          <div>
            <div className={styles.sideTitle}>SESSION INFO</div>
            {[['Zone','Verdant Fields'],['Season','I — Alpha'],['Network','Devnet'],['Status','Alpha']].map(([k,v]) => (
              <div key={k} className={styles.statRow}>
                <span className={styles.statRowLabel}>{k}</span>
                <span className={styles.statRowVal}>{v}</span>
              </div>
            ))}
          </div>
          <div className={styles.connectBox}>
            <div className={styles.connectTitle}>CONNECT WALLET</div>
            <div className={styles.connectDesc}>
              Connect Phantom or Backpack to save progress, mint NFTs and claim $FARM on-chain.
            </div>
            <button className={styles.connectBtn}>[ Connect Wallet ]</button>
          </div>
          <div>
            <div className={styles.sideTitle}>RESOURCES</div>
            {[
              ['🌲 Wood','Sawmill → Planks'],
              ['🪨 Stone','Furnace → Bricks'],
              ['🌾 Grain','Workbench → Bread'],
              ['⛏ Iron','Furnace → Ingots'],
              ['💀 Bone','Anvil → Bone Axe NFT'],
              ['🪙 Ancient Coin','Alchemy → Potions'],
            ].map(([r,c]) => (
              <div key={r} className={styles.statRow}>
                <span className={styles.statRowLabel}>{r}</span>
                <span className={styles.statRowVal} style={{color:'var(--px-teal)',fontSize:'5px'}}>{c}</span>
              </div>
            ))}
          </div>
          <div className={styles.tipBox}>
            <div className={styles.tipTitle}>💡 TIP</div>
            <div className={styles.tipText}>Walk near trees or rocks and press [E]. Orcs chase you — defeat them with [E] for loot.</div>
          </div>
        </aside>
      </div>
      <footer className={styles.footer}>
        <span className={styles.footerText}>DUX FARM © 2025 — Alpha</span>
        <span className={styles.footerText} style={{color:'var(--px-teal)'}}>Progress saved on-chain when wallet connected</span>
      </footer>
    </div>
  )
}
