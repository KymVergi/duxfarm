'use client'

import styles from '../styles/TokenTicker.module.css'

// Static for now — wire CoinGecko or Jupiter price API later
const TICKER_DATA = [
  { name: '$FARM',           price: '0.0842 SOL', change: '+4.2%',   up: true },
  { name: 'SOL',             price: '$178.40',    change: '+1.8%',   up: true },
  { name: 'Items minted',    price: '14,820',     change: null,      up: null },
  { name: 'Players online',  price: '342',        change: null,      up: null },
  { name: '24h vol',         price: '824 SOL',    change: '+12.4%',  up: true },
]

export default function TokenTicker() {
  return (
    <div className={styles.ticker}>
      <span className={styles.dot} title="live" />
      {TICKER_DATA.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className={styles.item}>
            <span className={styles.name}>{item.name}</span>
            <span className={styles.price}>{item.price}</span>
            {item.change !== null && (
              <span className={item.up ? styles.up : styles.down}>
                {item.change}
              </span>
            )}
          </div>
          {i < TICKER_DATA.length - 1 && <span className={styles.sep}>|</span>}
        </div>
      ))}
    </div>
  )
}
