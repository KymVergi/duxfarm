import Link from 'next/link'
import Navbar from '../../components/Navbar'
import styles from '../../styles/Lore.module.css'

export const metadata = {
  title: 'Lore — Dux Farm',
  description: 'The ancient history of the Dux Realm.',
}

const TOC = [
  { href: '#origin',    label: 'I. The Origin' },
  { href: '#dux',       label: 'II. The Dux Accord' },
  { href: '#classes',   label: 'III. The Three Orders' },
  { href: '#factions',  label: 'IV. Factions of the Realm' },
  { href: '#lands',     label: 'V. Lands & Dungeons' },
  { href: '#farm',      label: 'VI. The Sacred Farm' },
  { href: '#token',     label: 'VII. The $FARM Covenant' },
  { href: '#prophecy',  label: 'VIII. The Prophecy' },
]

export default function LorePage() {
  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.pageHeader}>
        <div className={styles.eyebrow}>— CHRONICLES OF THE DUX REALM —</div>
        <h1 className={styles.pageTitle}>THE LORE OF<br />DUX FARM</h1>
        <p className={styles.pageSub}>
          Before the first seed was planted, before the first dungeon was cleared,
          there was only the Void — and within it, a single ember of golden light.
        </p>
      </div>

      <div className={styles.main}>

        {/* TOC */}
        <aside className={styles.toc}>
          <div className={styles.tocTitle}>CONTENTS</div>
          <ul className={styles.tocList}>
            {TOC.map(t => (
              <li key={t.href} className={styles.tocItem}>
                <a href={t.href}>{t.label}</a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content */}
        <article className={styles.content}>

          {/* I */}
          <section id="origin" className={styles.chapter}>
            <div className={styles.chapterNum}>CHAPTER I</div>
            <h2 className={styles.chapterTitle}>THE ORIGIN</h2>
            <p className={styles.para}>
              In the age before memory, when the stars were still learning their names,
              the goddess <em>Aurevara</em> wept. She had built a world of perfect stone
              and endless sky — but no hand to till its soil, no voice to name its rivers.
              Her tears fell as golden seeds across the barren earth.
            </p>
            <p className={styles.para}>
              From each seed rose a soul — nameless, formless, hungry. The first Lords of
              the Realm emerged blinking into a world of impossible abundance:
              ancient forests of black timber, mountains threaded with silver ore,
              rivers thick with enchanted fish, and below it all — the <strong>Dungeons</strong>,
              vast and humming with forgotten power.
            </p>

            <div className={styles.pullQuote}>
              <div className={styles.pullQuoteText}>
                "We were given an empty world and the tools to fill it.<br />
                What we built with our hands became legend.<br />
                What we built with our greed became ruin."
              </div>
              <div className={styles.pullQuoteAttr}>— FIRST INSCRIPTION, HALL OF ORIGINS</div>
            </div>

            <p className={styles.para}>
              For three hundred years the Lords warred over resources. The forests fell.
              The rivers ran red. The ore veins collapsed under unchecked mining.
              Aurevara, watching from the heavens, wept once more — but this time
              her tears were cold, and they fell as the <strong>Great Frost</strong>,
              sealing the dungeons and silencing the land for a generation.
            </p>
          </section>

          <div className={styles.divider}>· · · ✦ · · ·</div>

          {/* II */}
          <section id="dux" className={styles.chapter}>
            <div className={styles.chapterNum}>CHAPTER II</div>
            <h2 className={styles.chapterTitle}>THE DUX ACCORD</h2>
            <p className={styles.para}>
              When the Frost lifted, seven survivors emerged from the ruins.
              They called themselves the <em>Dux</em> — from the old tongue, meaning
              both <strong>"leader"</strong> and <strong>"one who endures."</strong>
              Around a single bonfire, with no food and no shelter, they made a pact
              that would define the Realm forever.
            </p>
            <p className={styles.para}>
              The Accord was simple: <em>no Lord shall take more than the land can give.</em>
              Resources would be farmed, not stripped. Dungeons would be explored,
              not detonated. Crafted items — every sword, every potion, every tool —
              would bear the mark of its maker, permanent and undeniable.
              These marks became the first <strong>NFTs of the Realm</strong>, etched
              into the living stone of the Aurevara Chain.
            </p>
            <p className={styles.para}>
              To enforce the Accord, the Dux created the <strong>$FARM Covenant</strong>:
              a token minted only through honest labor. You cannot buy more of it
              than the land produces. You cannot print it from nothing.
              Every coin is earned by hand, by deed, by daily devotion to the Realm.
            </p>
          </section>

          <div className={styles.divider}>· · · ✦ · · ·</div>

          {/* III */}
          <section id="classes" className={styles.chapter}>
            <div className={styles.chapterNum}>CHAPTER III</div>
            <h2 className={styles.chapterTitle}>THE THREE ORDERS</h2>
            <p className={styles.para}>
              Among the first Lords, three paths of mastery emerged naturally —
              as if the land itself called different souls to different callings.
              These became the <em>Three Orders</em>, the backbone of Dux society.
            </p>

            <div className={styles.factions}>
              <div className={styles.factionCard}>
                <div className={styles.factionIcon}>⚔️</div>
                <div className={styles.factionName}>ORDER OF THE IRON SHIELD — Knights</div>
                <div className={styles.factionDesc}>
                  The first defenders of the Accord. Knights patrol the borders,
                  clear dungeon paths for farmers, and carry the heaviest burdens
                  without complaint. They are slow to anger and slow to forget.
                  Their armor is forged in the Furnace of Vorn — a station only
                  a Knight can operate at full efficiency.
                  <br /><br />
                  <em style={{ color: 'var(--px-gold)' }}>
                    Bonus: +30% carry capacity, +25% damage to Orcs.
                  </em>
                </div>
              </div>
              <div className={styles.factionCard}>
                <div className={styles.factionIcon}>🗡️</div>
                <div className={styles.factionName}>BROTHERHOOD OF THE SILENT STEP — Rogues</div>
                <div className={styles.factionDesc}>
                  Born in the shadow of the Great Frost, Rogues learned to survive
                  by moving unseen. They find resources others miss, move faster
                  across every terrain, and have an uncanny nose for rare drops.
                  No Rogue has ever explained how they know where the silver veins are.
                  No Rogue has ever been asked twice.
                  <br /><br />
                  <em style={{ color: 'var(--px-purple)' }}>
                    Bonus: +40% movement speed, +50% rare resource chance.
                  </em>
                </div>
              </div>
              <div className={styles.factionCard}>
                <div className={styles.factionIcon}>🔮</div>
                <div className={styles.factionName}>CIRCLE OF THE AMBER FLAME — Wizards</div>
                <div className={styles.factionDesc}>
                  Keepers of Aurevara's original tears, Wizards study the golden
                  seeds that birthed the Realm. Their Alchemy tables hum with
                  arcane energy, producing potions of impossible potency.
                  They alone can brew the <strong>Elixir of Eternal Farm</strong>
                  — the rarest craftable item in the Realm.
                  <br /><br />
                  <em style={{ color: 'var(--px-teal)' }}>
                    Bonus: +60% craft speed, exclusive Alchemy recipes unlocked.
                  </em>
                </div>
              </div>
              <div className={styles.factionCard}>
                <div className={styles.factionIcon}>❓</div>
                <div className={styles.factionName}>THE UNBOUND — Coming in Season II</div>
                <div className={styles.factionDesc}>
                  Whispers in the dungeon speak of a fourth path — those who follow
                  no Order, pledge no allegiance, and answer to no Accord.
                  The Dux council has redacted all records of this class.
                  What is known: they were there before the Frost.
                  They may have caused it.
                  <br /><br />
                  <em style={{ color: 'var(--px-muted)' }}>
                    Details classified. Season II reveal incoming.
                  </em>
                </div>
              </div>
            </div>
          </section>

          <div className={styles.divider}>· · · ✦ · · ·</div>

          {/* IV */}
          <section id="factions" className={styles.chapter}>
            <div className={styles.chapterNum}>CHAPTER IV</div>
            <h2 className={styles.chapterTitle}>FACTIONS OF THE REALM</h2>
            <p className={styles.para}>
              Not all who wander the Realm serve the Accord. The dungeons are home
              to ancient creatures who predate the Lords — and they do not welcome
              intruders. Two great enemy factions have terrorized farmers for centuries.
            </p>

            <div className={styles.factions}>
              <div className={styles.factionCard}>
                <div className={styles.factionIcon}>👹</div>
                <div className={styles.factionName}>THE ORC CREW</div>
                <div className={styles.factionDesc}>
                  Orcs arrived from the Eastern Wastes three centuries ago, drawn
                  by the smell of fresh-tilled earth. They are opportunists —
                  they don't farm themselves, they take from those who do.
                  Orc Warriors are brute force. Orc Rogues are cunning thieves.
                  Orc Shamans cast curses that slow farmers for hours.
                  Defeating an Orc yields raw meat, stolen ore, and occasionally
                  a <strong>Bone Axe</strong> — the most brutal crafting material
                  available in the Realm.
                </div>
              </div>
              <div className={styles.factionCard}>
                <div className={styles.factionIcon}>💀</div>
                <div className={styles.factionName}>THE SKELETON CREW</div>
                <div className={styles.factionDesc}>
                  The animated remains of Lords who broke the Accord.
                  Aurevara's curse preserved them — not as punishment for them,
                  but as warning for the living. Skeleton Warriors haunt
                  the deep dungeon levels. Skeleton Mages cast debilitating spells.
                  Skeleton Rogues steal your $FARM tokens directly if they touch you.
                  Defeating them yields <strong>Bone Fragments</strong> and
                  <strong>Ancient Coins</strong> — rare currency from before the Frost.
                </div>
              </div>
            </div>
          </section>

          <div className={styles.divider}>· · · ✦ · · ·</div>

          {/* V */}
          <section id="lands" className={styles.chapter}>
            <div className={styles.chapterNum}>CHAPTER V</div>
            <h2 className={styles.chapterTitle}>LANDS & DUNGEONS</h2>
            <p className={styles.para}>
              The Realm is divided into seven known regions, each with its own
              resources, enemies, and secrets. Lords must progress through them
              in order — the deeper zones require better gear and higher levels.
            </p>

            <div className={styles.locations}>
              {[
                { name: 'THE VERDANT FIELDS', desc: 'Starting zone. Abundant wood and crops. Weak Orc scouts patrol the edges. Perfect for new Lords learning the Accord. The Sawmill and Workbench stations are found here.' },
                { name: 'THE STONE HILLS', desc: 'Rich iron and granite deposits. Orc Warriors begin appearing here. The Furnace station unlocks. First dungeon entrance is hidden beneath the Standing Stones.' },
                { name: 'THE EMBER MARSHES', desc: 'A volcanic wetland where rare fire-ore surfaces. Orc Shamans are dangerous here. Alchemy table unlocks. The water tiles hide submerged chests.' },
                { name: 'THE DARK FOREST', desc: 'Ancient black timber — the rarest crafting wood. Skeleton Warriors patrol between the trees. Legendary item recipes begin dropping here.' },
                { name: 'THE BONE PLAINS', desc: 'Former battlefield of the pre-Frost wars. Dominated by Skeleton Mages. Every surface is a crafting material. The Anvil station — needed for endgame weapons — is here.' },
                { name: 'THE CRYSTAL CAVERNS', desc: 'Deepest accessible zone. Crystals of pure $FARM energy grow from the walls. All enemy types appear. Boss encounters possible. The rarest NFT items drop only here.' },
                { name: 'THE VOID GATE', desc: 'Sealed. The Dux council does not discuss it. Three Lords who approached it did not return. Their $FARM was redistributed to the treasury. Do not approach the Void Gate.' },
              ].map(loc => (
                <div key={loc.name} className={styles.locationRow}>
                  <div className={styles.locationName}>{loc.name}</div>
                  <div className={styles.locationDesc}>{loc.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <div className={styles.divider}>· · · ✦ · · ·</div>

          {/* VI */}
          <section id="farm" className={styles.chapter}>
            <div className={styles.chapterNum}>CHAPTER VI</div>
            <h2 className={styles.chapterTitle}>THE SACRED FARM</h2>
            <p className={styles.para}>
              At the center of the Realm stands the <em>First Farm</em> — the plot
              of earth where Aurevara's first tear landed. Nothing planted here
              ever dies. The soil is warm even in winter. Lords who farm here
              for seven consecutive days receive the blessing of the goddess:
              a <strong>doubled $FARM yield</strong> for the following week.
            </p>
            <p className={styles.para}>
              The First Farm cannot be owned. It belongs to whoever farms it that day.
              Disputes over access have started more wars than dungeon politics ever did.
              The Dux council's only rule about the First Farm: <em>no Lord may hold
              it for more than three days without yielding to another.</em>
              Those who violate this rule find their streak timer reset to zero.
            </p>

            <div className={styles.pullQuote}>
              <div className={styles.pullQuoteText}>
                "The farm does not care who you are.<br />
                It only cares that you show up."
              </div>
              <div className={styles.pullQuoteAttr}>— DUX PROVERB, ORIGIN UNKNOWN</div>
            </div>
          </section>

          <div className={styles.divider}>· · · ✦ · · ·</div>

          {/* VII */}
          <section id="token" className={styles.chapter}>
            <div className={styles.chapterNum}>CHAPTER VII</div>
            <h2 className={styles.chapterTitle}>THE $FARM COVENANT</h2>
            <p className={styles.para}>
              The $FARM token is not currency — it is <em>testimony.</em>
              Every token in existence was produced by a Lord's labor, in a real
              session, on a real day. No $FARM has ever been minted by decree.
              No $FARM has ever been created from nothing.
            </p>
            <p className={styles.para}>
              The Covenant is enforced by the <strong>Aurevara Chain</strong> — a Ethereum
              program that verifies each claim before minting. Fake sessions are rejected.
              Bot activity is detected and burned. The supply is fixed at
              <strong> 50,000,000 $FARM</strong>. When the last token is minted, the Covenant
              closes. What happens after that is written in the Prophecy.
            </p>
          </section>

          <div className={styles.divider}>· · · ✦ · · ·</div>

          {/* VIII */}
          <section id="prophecy" className={styles.chapter}>
            <div className={styles.chapterNum}>CHAPTER VIII</div>
            <h2 className={styles.chapterTitle}>THE PROPHECY</h2>

            <div className={styles.pullQuote}>
              <div className={styles.pullQuoteText}>
                "When the last $FARM is minted and the Covenant closes,<br />
                the Void Gate will open for seven days.<br />
                Those who enter will face what the first Lords buried.<br />
                Those who survive will inherit what the goddess intended.<br />
                The rest will become the next generation of Skeletons."
              </div>
              <div className={styles.pullQuoteAttr}>— THE SEALED SCROLL, RECOVERED FROM DUNGEON LEVEL 7</div>
            </div>

            <p className={styles.para}>
              The Dux council considers the Prophecy apocryphal.
              The Dux council also has not commented on why the Void Gate
              has begun glowing faintly gold in recent seasons.
              Farmers are advised to continue their daily sessions and
              not read too much into ambient dungeon luminescence.
            </p>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <Link href="/play">
                <button style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '9px',
                  background: 'var(--px-gold)',
                  color: '#1a1200',
                  border: 'none',
                  padding: '14px 24px',
                  cursor: 'pointer',
                  letterSpacing: '1px',
                }}>
                  [ BEGIN YOUR LEGEND ]
                </button>
              </Link>
            </div>
          </section>

        </article>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>DUX FARM © 2025 — The Chronicles are ongoing</span>
        <span className={styles.footerText} style={{ color: 'var(--px-teal)' }}>
          Lore expands with each Season
        </span>
      </footer>
    </div>
  )
}
