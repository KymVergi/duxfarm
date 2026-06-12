'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '../styles/Navbar.module.css'

const NAV_LINKS = [
  { href: '/',        label: 'Home'    },
  { href: '/play',    label: 'Play'    },
  { href: '/ranking', label: 'Ranking' },
  { href: '/market',  label: 'Market'  },
  { href: '/lore',    label: 'Lore'    },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        <svg className={styles.logoIcon} viewBox="0 0 24 24">
          <rect x="10" y="1"  width="4"  height="2"  fill="#f0c040"/>
          <rect x="8"  y="3"  width="8"  height="2"  fill="#f0c040"/>
          <rect x="5"  y="5"  width="14" height="2"  fill="#c8962a"/>
          <rect x="5"  y="7"  width="14" height="10" fill="#f0c040"/>
          <rect x="7"  y="9"  width="4"  height="4"  fill="#c8962a"/>
          <rect x="13" y="9"  width="4"  height="4"  fill="#c8962a"/>
          <rect x="5"  y="17" width="4"  height="5"  fill="#5a3a1a"/>
          <rect x="15" y="17" width="4"  height="5"  fill="#5a3a1a"/>
          <rect x="9"  y="17" width="6"  height="2"  fill="#3ecfb2"/>
        </svg>
        DUX FARM
      </Link>

      <ul className={styles.links}>
        {NAV_LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className={pathname === href ? styles.active : ''}>
              [ {label} ]
            </Link>
          </li>
        ))}
      </ul>

      <button className={styles.walletBtn}>[ Connect Wallet ]</button>
    </nav>
  )
}
