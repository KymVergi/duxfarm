import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    // ── Loading bar ──────────────────────────────────────────────────────
    const { width, height } = this.scale
    const barBg  = this.add.rectangle(width / 2, height / 2, 300, 12, 0x2a2a3d)
    const bar    = this.add.rectangle(width / 2 - 150, height / 2, 0, 8, 0xf0c040)
    const label  = this.add.text(width / 2, height / 2 - 30, 'LOADING REALM...', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#f0c040',
    }).setOrigin(0.5)

    bar.setOrigin(0, 0.5)

    this.load.on('progress', (v: number) => {
      bar.width = 300 * v
    })

    this.load.on('complete', () => {
      label.setText('REALM READY')
    })

    // ── Character spritesheets ───────────────────────────────────────────
    // Idle: 256x64 → 4 frames of 64x64
    this.load.spritesheet('hero_idle',    '/assets/characters/body_a/idle_down.png',    { frameWidth: 64, frameHeight: 64 })
    // Walk: 384x64 → 6 frames of 64x64
    this.load.spritesheet('hero_walk',    '/assets/characters/body_a/walk_down.png',    { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('hero_walk_side','/assets/characters/body_a/walk_side.png',   { frameWidth: 64, frameHeight: 64 })
    // Run: 384x64 → 6 frames of 64x64
    this.load.spritesheet('hero_run',     '/assets/characters/body_a/run_down.png',     { frameWidth: 64, frameHeight: 64 })
    // Collect: 512x64 → 8 frames
    this.load.spritesheet('hero_collect', '/assets/characters/body_a/collect_down.png', { frameWidth: 64, frameHeight: 64 })
    // Death
    this.load.spritesheet('hero_death',   '/assets/characters/body_a/death_down.png',   { frameWidth: 64, frameHeight: 64 })

    // ── NPCs: 128x32 → 4 frames of 32x32 ───────────────────────────────
    this.load.spritesheet('npc_knight',  '/assets/npcs/knight_idle_sheet.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('npc_rogue',   '/assets/npcs/rogue_idle_sheet.png',  { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('npc_wizard',  '/assets/npcs/wizard_idle_sheet.png', { frameWidth: 32, frameHeight: 32 })

    // ── Mobs ─────────────────────────────────────────────────────────────
    this.load.spritesheet('orc_idle',      '/assets/mobs/orc_idle.png',               { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('orc_run',       '/assets/mobs/orc_run_sheet.png',           { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('skeleton_idle', '/assets/mobs/skeleton_-_base_idle.png',    { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('skeleton_run',  '/assets/mobs/skeleton_run_sheet.png',      { frameWidth: 64, frameHeight: 64 })

    // ── Environment ───────────────────────────────────────────────────────
    this.load.image('tileset_floors', '/assets/tilesets/Floors_Tiles.png')
    this.load.image('tileset_walls',  '/assets/tilesets/Wall_Tiles.png')
    this.load.image('tileset_dungeon','/assets/tilesets/Dungeon_Tiles.png')
    this.load.image('tileset_water',  '/assets/tilesets/Water_tiles.png')

    // Props
    this.load.image('props_resources','/assets/props/Resources.png')
    this.load.image('props_rocks',    '/assets/props/Rocks.png')
    this.load.image('props_farm',     '/assets/props/Farm.png')
    this.load.image('tree_md',        '/assets/props/trees/model_01_Size_03.png')
    this.load.image('tree_lg',        '/assets/props/trees/model_01_Size_04.png')

    // Stations
    this.load.image('station_anvil',     '/assets/stations/Anvil_Anvil.png')
    this.load.image('station_bonfire',   '/assets/stations/Bonfire_Bonfire.png')
    this.load.image('station_furnace',   '/assets/stations/Furnace_Furnace.png')
    this.load.image('station_sawmill',   '/assets/stations/Sawmill_Base.png')
    this.load.image('station_workbench', '/assets/stations/Workbench_Workbench.png')
  }

  create() {
    this.scene.start('WorldScene')
  }
}
