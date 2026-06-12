import Navbar from '../../components/Navbar'
import styles from '../../styles/Home.module.css'

export default function MarketPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <div style={{ padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', color: 'var(--px-gold)', marginBottom: '16px' }}>
          💰 MARKET
        </div>
        <div style={{ fontSize: '7px', color: 'var(--px-muted)', lineHeight: '2.4' }}>
          NFT marketplace coming soon.<br />
          Trade your crafted items here.
        </div>
      </div>
    </div>
  )
}
