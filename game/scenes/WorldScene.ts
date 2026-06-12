import Phaser from 'phaser'

// ── Inventory item ─────────────────────────────────────────────────────────
interface InventoryItem { name: string; qty: number }

// ── Resource node config ────────────────────────────────────────────────────
interface NodeConfig {
  x: number; y: number
  key: string        // texture key
  frame?: number
  resource: string
  respawnMs: number
}

// ── Mob config ──────────────────────────────────────────────────────────────
interface MobConfig {
  x: number; y: number
  textureIdle: string
  animIdle: string
  hp: number
  drop: string
  speed: number
}

export class WorldScene extends Phaser.Scene {

  // player
  private hero!: Phaser.GameObjects.Sprite
  private heroShadow!: Phaser.GameObjects.Ellipse
  private speed = 120
  private keys!: {
    W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key
    S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key
    UP: Phaser.Input.Keyboard.Key; LEFT: Phaser.Input.Keyboard.Key
    DOWN: Phaser.Input.Keyboard.Key; RIGHT: Phaser.Input.Keyboard.Key
    E: Phaser.Input.Keyboard.Key
  }
  private facing: 'down' | 'side' = 'down'
  private isCollecting = false

  // world
  private resourceNodes: Phaser.GameObjects.Sprite[] = []
  private nodeData: Map<Phaser.GameObjects.Sprite, { resource: string; depleted: boolean; respawnMs: number }> = new Map()
  private mobs: { sprite: Phaser.GameObjects.Sprite; hp: number; drop: string; speed: number; alive: boolean }[] = []

  // UI
  private hpBar!: Phaser.GameObjects.Rectangle
  private hpText!: Phaser.GameObjects.Text
  private farmText!: Phaser.GameObjects.Text
  private inventory: InventoryItem[] = []
  private inventoryTexts: Phaser.GameObjects.Text[] = []
  private interactPrompt!: Phaser.GameObjects.Text
  private nearNode: Phaser.GameObjects.Sprite | null = null

  private playerHp = 100
  private playerMaxHp = 100
  private farmEarned = 0
  private sessionTimer = 0

  constructor() { super({ key: 'WorldScene' }) }

  create() {
    const W = this.scale.width
    const H = this.scale.height

    // ── Background floor tiles (simple tinted rects as floor) ─────────────
    this.add.grid(0, 0, W * 2, H * 2, 32, 32, 0x1a1a28, 1, 0x2a2a3d, 0.5)
      .setOrigin(0, 0)

    // Ambient decorations — rocks and trees using real assets
    const treePositions = [
      [80,  80], [180, 60], [420, 90], [520, 70], [650, 100],
      [100, 380],[600, 360],[700, 200],[50, 250], [750, 320],
    ]
    treePositions.forEach(([x, y]) => {
      this.add.image(x, y, 'tree_md').setScale(0.6).setDepth(y)
    })

    // Rocks
    const rockPositions = [[200, 300],[350, 200],[500, 340],[650, 150],[130, 180]]
    rockPositions.forEach(([x, y]) => {
      this.add.image(x, y, 'props_rocks').setScale(0.5).setDepth(y).setFrame(0)
    })

    // ── Craft stations ──────────────────────────────────────────────────────
    const stations: [string, number, number][] = [
      ['station_sawmill',   120, 440],
      ['station_furnace',   220, 440],
      ['station_anvil',     320, 440],
      ['station_workbench', 420, 440],
      ['station_bonfire',   520, 440],
    ]
    stations.forEach(([key, x, y]) => {
      const s = this.add.image(x, y, key).setScale(0.9).setDepth(y)
      this.add.text(x, y + 24, key.replace('station_','').toUpperCase(), {
        fontFamily: '"Press Start 2P"', fontSize: '5px', color: '#7a7090',
      }).setOrigin(0.5).setDepth(y + 1)
    })

    // ── Resource nodes ──────────────────────────────────────────────────────
    const nodeDefs: NodeConfig[] = [
      { x: 280, y: 140, key: 'tree_md',        resource: 'Wood',  respawnMs: 20000 },
      { x: 380, y: 160, key: 'tree_md',        resource: 'Wood',  respawnMs: 20000 },
      { x: 460, y: 130, key: 'tree_lg',        resource: 'Wood',  respawnMs: 30000 },
      { x: 580, y: 250, key: 'props_rocks',    resource: 'Stone', respawnMs: 25000 },
      { x: 680, y: 270, key: 'props_rocks',    resource: 'Stone', respawnMs: 25000 },
      { x: 300, y: 320, key: 'props_farm',     resource: 'Grain', respawnMs: 15000 },
      { x: 400, y: 310, key: 'props_farm',     resource: 'Grain', respawnMs: 15000 },
      { x: 580, y: 180, key: 'props_resources',resource: 'Iron',  respawnMs: 35000 },
    ]

    nodeDefs.forEach(cfg => {
      const spr = this.add.sprite(cfg.x, cfg.y, cfg.key).setScale(0.7).setDepth(cfg.y)
      this.resourceNodes.push(spr)
      this.nodeData.set(spr, { resource: cfg.resource, depleted: false, respawnMs: cfg.respawnMs })
    })

    // ── Animations ──────────────────────────────────────────────────────────
    if (!this.anims.exists('hero_idle_anim')) {
      this.anims.create({ key: 'hero_idle_anim', frames: this.anims.generateFrameNumbers('hero_idle', { start:0, end:3 }), frameRate: 6, repeat: -1 })
      this.anims.create({ key: 'hero_walk_anim', frames: this.anims.generateFrameNumbers('hero_walk', { start:0, end:5 }), frameRate: 10, repeat: -1 })
      this.anims.create({ key: 'hero_walk_side_anim', frames: this.anims.generateFrameNumbers('hero_walk_side', { start:0, end:5 }), frameRate: 10, repeat: -1 })
      this.anims.create({ key: 'hero_run_anim',  frames: this.anims.generateFrameNumbers('hero_run',  { start:0, end:5 }), frameRate: 12, repeat: -1 })
      this.anims.create({ key: 'hero_collect_anim', frames: this.anims.generateFrameNumbers('hero_collect', { start:0, end:7 }), frameRate: 10, repeat: 0 })
      this.anims.create({ key: 'hero_death_anim',   frames: this.anims.generateFrameNumbers('hero_death',   { start:0, end:7 }), frameRate: 8,  repeat: 0 })

      // NPCs
      this.anims.create({ key: 'npc_knight_idle', frames: this.anims.generateFrameNumbers('npc_knight', { start:0, end:3 }), frameRate: 5, repeat: -1 })
      this.anims.create({ key: 'npc_rogue_idle',  frames: this.anims.generateFrameNumbers('npc_rogue',  { start:0, end:3 }), frameRate: 5, repeat: -1 })
      this.anims.create({ key: 'npc_wizard_idle', frames: this.anims.generateFrameNumbers('npc_wizard', { start:0, end:3 }), frameRate: 5, repeat: -1 })

      // Mobs
      this.anims.create({ key: 'orc_idle_anim',      frames: this.anims.generateFrameNumbers('orc_idle',      { start:0, end:3 }), frameRate: 5, repeat: -1 })
      this.anims.create({ key: 'skeleton_idle_anim', frames: this.anims.generateFrameNumbers('skeleton_idle', { start:0, end:3 }), frameRate: 5, repeat: -1 })
    }

    // ── NPCs (quest givers) ─────────────────────────────────────────────────
    const npcDefs: [string, string, number, number][] = [
      ['npc_knight', 'npc_knight_idle', 130, 300],
      ['npc_wizard', 'npc_wizard_idle', 680, 400],
      ['npc_rogue',  'npc_rogue_idle',  400, 400],
    ]
    npcDefs.forEach(([tex, anim, x, y]) => {
      const npc = this.add.sprite(x, y, tex).setScale(2).setDepth(y)
      npc.play(anim)
    })

    // ── Mobs ─────────────────────────────────────────────────────────────────
    const mobDefs: MobConfig[] = [
      { x: 620, y: 200, textureIdle: 'orc_idle',      animIdle: 'orc_idle_anim',      hp: 30, drop: 'Bone',    speed: 60 },
      { x: 700, y: 300, textureIdle: 'orc_idle',      animIdle: 'orc_idle_anim',      hp: 30, drop: 'Bone',    speed: 60 },
      { x: 200, y: 200, textureIdle: 'skeleton_idle', animIdle: 'skeleton_idle_anim', hp: 20, drop: 'Ancient Coin', speed: 80 },
      { x: 500, y: 280, textureIdle: 'skeleton_idle', animIdle: 'skeleton_idle_anim', hp: 20, drop: 'Ancient Coin', speed: 80 },
    ]

    mobDefs.forEach(cfg => {
      const spr = this.add.sprite(cfg.x, cfg.y, cfg.textureIdle).setScale(2).setDepth(cfg.y)
      spr.play(cfg.animIdle)
      this.mobs.push({ sprite: spr, hp: cfg.hp, drop: cfg.drop, speed: cfg.speed, alive: true })
    })

    // ── Hero ──────────────────────────────────────────────────────────────
    this.heroShadow = this.add.ellipse(350, 360, 40, 10, 0x000000, 0.35).setDepth(350)
    this.hero = this.add.sprite(350, 340, 'hero_idle').setScale(2.2).setDepth(340)
    this.hero.play('hero_idle_anim')

    // ── Input ─────────────────────────────────────────────────────────────
    const kb = this.input.keyboard!
    this.keys = {
      W: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      UP:    kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      LEFT:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      DOWN:  kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      RIGHT: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      E: kb.addKey(Phaser.Input.Keyboard.KeyCodes.E),
    }

    // ── HUD ───────────────────────────────────────────────────────────────
    this.createHUD()

    // ── Interact prompt ───────────────────────────────────────────────────
    this.interactPrompt = this.add.text(350, 280, '[ E ] Collect', {
      fontFamily: '"Press Start 2P"', fontSize: '7px', color: '#3ecfb2',
      backgroundColor: '#0a0a0f', padding: { x: 6, y: 4 },
    }).setOrigin(0.5).setDepth(999).setVisible(false)

    // Session $FARM drip — 1 $FARM every 10 seconds
    this.time.addEvent({
      delay: 10000, loop: true,
      callback: () => { this.farmEarned += 1; this.updateFarmText() },
    })
  }

  private createHUD() {
    const W = this.scale.width
    // HP bar background
    this.add.rectangle(14, 14, 104, 14, 0x1c1c28).setOrigin(0).setDepth(1000)
    this.add.rectangle(14, 14, 104, 14, 0x2a2a3d, 0).setStrokeStyle(1, 0x3a3a52).setOrigin(0).setDepth(1001)
    this.hpBar = this.add.rectangle(16, 16, 100, 10, 0xe05555).setOrigin(0).setDepth(1002)
    this.hpText = this.add.text(16, 30, `HP: ${this.playerHp}/${this.playerMaxHp}`, {
      fontFamily: '"Press Start 2P"', fontSize: '6px', color: '#e8e0d0',
    }).setDepth(1002)

    // $FARM counter
    this.farmText = this.add.text(16, 48, `$FARM: ${this.farmEarned}`, {
      fontFamily: '"Press Start 2P"', fontSize: '7px', color: '#f0c040',
    }).setDepth(1002)

    // Controls hint
    this.add.text(W - 8, 14, 'WASD / Arrows — Move\n[E] — Collect resource', {
      fontFamily: '"Press Start 2P"', fontSize: '5px', color: '#4a4560',
      align: 'right',
    }).setOrigin(1, 0).setDepth(1002)

    // Inventory label
    this.add.text(16, 72, 'INVENTORY:', {
      fontFamily: '"Press Start 2P"', fontSize: '6px', color: '#7a7090',
    }).setDepth(1002)
  }

  private updateFarmText() {
    this.farmText.setText(`$FARM: ${this.farmEarned}`)
  }

  private addInventory(item: string) {
    const existing = this.inventory.find(i => i.name === item)
    if (existing) {
      existing.qty++
    } else {
      this.inventory.push({ name: item, qty: 1 })
    }
    this.renderInventory()
  }

  private renderInventory() {
    this.inventoryTexts.forEach(t => t.destroy())
    this.inventoryTexts = []
    this.inventory.slice(0, 8).forEach((item, i) => {
      const t = this.add.text(16, 86 + i * 14, `${item.name}: ${item.qty}`, {
        fontFamily: '"Press Start 2P"', fontSize: '6px', color: '#b0a8c0',
      }).setDepth(1002)
      this.inventoryTexts.push(t)
    })
  }

  private collectNearestNode() {
    if (!this.nearNode || this.isCollecting) return
    const data = this.nodeData.get(this.nearNode)
    if (!data || data.depleted) return

    this.isCollecting = true
    data.depleted = true
    this.nearNode.setAlpha(0.3)
    this.hero.play('hero_collect_anim')

    const collectedResource = data.resource
    const node = this.nearNode

    // Show +Resource popup
    const popup = this.add.text(this.hero.x, this.hero.y - 40, `+1 ${collectedResource}`, {
      fontFamily: '"Press Start 2P"', fontSize: '7px', color: '#4caf50',
    }).setOrigin(0.5).setDepth(1100)

    this.tweens.add({
      targets: popup, y: this.hero.y - 80, alpha: 0, duration: 1200,
      onComplete: () => popup.destroy(),
    })

    this.hero.once('animationcomplete', () => {
      this.isCollecting = false
      this.addInventory(collectedResource)
      this.hero.play('hero_idle_anim')
      this.farmEarned += 1
      this.updateFarmText()

      // Respawn timer
      this.time.addEvent({
        delay: data.respawnMs,
        callback: () => {
          data.depleted = false
          node.setAlpha(1)
        },
      })
    })
  }

  update(_time: number, delta: number) {
    if (this.isCollecting) return

    const { W, A, S, D, UP, LEFT, DOWN, RIGHT, E } = this.keys
    let vx = 0; let vy = 0

    if (A.isDown || LEFT.isDown)  vx = -this.speed
    if (D.isDown || RIGHT.isDown) vx =  this.speed
    if (W.isDown || UP.isDown)    vy = -this.speed
    if (S.isDown || DOWN.isDown)  vy =  this.speed

    if (vx !== 0 || vy !== 0) {
      this.hero.x += vx * delta / 1000
      this.hero.y += vy * delta / 1000

      // Clamp to world bounds
      this.hero.x = Phaser.Math.Clamp(this.hero.x, 40, this.scale.width  - 40)
      this.hero.y = Phaser.Math.Clamp(this.hero.y, 40, this.scale.height - 60)

      this.heroShadow.x = this.hero.x
      this.heroShadow.y = this.hero.y + 28

      if (vx !== 0) {
        if (this.facing !== 'side') {
          this.facing = 'side'
          this.hero.play('hero_walk_side_anim', true)
        }
        this.hero.setFlipX(vx < 0)
      } else if (vy !== 0 && this.facing !== 'down') {
        this.facing = 'down'
        this.hero.setFlipX(false)
        this.hero.play('hero_walk_anim', true)
      }
    } else {
      if (this.hero.anims.currentAnim?.key !== 'hero_idle_anim') {
        this.hero.play('hero_idle_anim', true)
        this.hero.setFlipX(false)
        this.facing = 'down'
      }
    }

    // Update hero depth
    this.hero.setDepth(this.hero.y)
    this.heroShadow.setDepth(this.hero.y - 1)

    // ── Mob patrol AI ────────────────────────────────────────────────────
    this.mobs.forEach(mob => {
      if (!mob.alive) return
      const dist = Phaser.Math.Distance.Between(mob.sprite.x, mob.sprite.y, this.hero.x, this.hero.y)
      if (dist < 200) {
        // Chase player
        const angle = Phaser.Math.Angle.Between(mob.sprite.x, mob.sprite.y, this.hero.x, this.hero.y)
        mob.sprite.x += Math.cos(angle) * mob.speed * delta / 1000
        mob.sprite.y += Math.sin(angle) * mob.speed * delta / 1000
        mob.sprite.setFlipX(Math.cos(angle) < 0)
        mob.sprite.setDepth(mob.sprite.y)

        // Damage player on contact
        if (dist < 28) {
          this.playerHp = Math.max(0, this.playerHp - 0.1)
          this.hpBar.width = (this.playerHp / this.playerMaxHp) * 100
          this.hpText.setText(`HP: ${Math.ceil(this.playerHp)}/${this.playerMaxHp}`)
        }
      }

      // Player attack on E near mob
      if (Phaser.Input.Keyboard.JustDown(E) && dist < 60) {
        mob.hp -= 10
        const dmgText = this.add.text(mob.sprite.x, mob.sprite.y - 20, '-10', {
          fontFamily: '"Press Start 2P"', fontSize: '7px', color: '#e05555',
        }).setOrigin(0.5).setDepth(1100)
        this.tweens.add({
          targets: dmgText, y: mob.sprite.y - 50, alpha: 0, duration: 800,
          onComplete: () => dmgText.destroy(),
        })

        if (mob.hp <= 0) {
          mob.alive = false
          mob.sprite.play('hero_idle_anim')  // fallback
          this.tweens.add({
            targets: mob.sprite, alpha: 0, duration: 500,
            onComplete: () => mob.sprite.destroy(),
          })
          this.addInventory(mob.drop)
          this.farmEarned += 5
          this.updateFarmText()

          const lootText = this.add.text(mob.sprite.x, mob.sprite.y - 10, `+${mob.drop}  +5 $FARM`, {
            fontFamily: '"Press Start 2P"', fontSize: '6px', color: '#f0c040',
          }).setOrigin(0.5).setDepth(1100)
          this.tweens.add({
            targets: lootText, y: mob.sprite.y - 60, alpha: 0, duration: 1500,
            onComplete: () => lootText.destroy(),
          })
        }
      }
    })

    // ── Proximity detection for resource nodes ───────────────────────────
    this.nearNode = null
    let minDist = Infinity
    this.resourceNodes.forEach(node => {
      const data = this.nodeData.get(node)
      if (!data || data.depleted) return
      const dist = Phaser.Math.Distance.Between(node.x, node.y, this.hero.x, this.hero.y)
      if (dist < 70 && dist < minDist) {
        minDist = dist
        this.nearNode = node
      }
    })

    if (this.nearNode) {
      this.interactPrompt.setPosition(this.hero.x, this.hero.y - 60)
      this.interactPrompt.setText(`[ E ] Collect ${this.nodeData.get(this.nearNode)?.resource}`)
      this.interactPrompt.setVisible(true)

      if (Phaser.Input.Keyboard.JustDown(E)) {
        this.collectNearestNode()
      }
    } else {
      this.interactPrompt.setVisible(false)
    }

    // Session time ticker
    this.sessionTimer += delta
  }
}
