/**
 * ASSET MANIFEST — Dux Farm
 * All paths are relative to /public/assets/
 * Use as Phaser preload keys.
 */

export const ASSETS = {
  // ── Characters (Body_A) ─────────────────────────────────────────────────
  character: {
    idle:        '/assets/characters/body_a/Idle_Base_Idle_Down-Sheet.png',
    walk_down:   '/assets/characters/body_a/Walk_Base_Walk_Down-Sheet.png',
    walk_up:     '/assets/characters/body_a/Walk_Base_Walk_Up-Sheet.png',
    walk_side:   '/assets/characters/body_a/Walk_Base_Walk_Side-Sheet.png',
    run_down:    '/assets/characters/body_a/Run_Base_Run_Down-Sheet.png',
    run_up:      '/assets/characters/body_a/Run_Base_Run_Up-Sheet.png',
    run_side:    '/assets/characters/body_a/Run_Base_Run_Side-Sheet.png',
    collect:     '/assets/characters/body_a/Collect_Base_Collect_Down-Sheet.png',
    fish:        '/assets/characters/body_a/Fishing_Base_Fishing_Side-Sheet.png',
    carry_idle:  '/assets/characters/body_a/Carry_Idle_Carry_Idle_Down-Sheet.png',
    carry_walk:  '/assets/characters/body_a/Carry_Walk_Carry_Walk_Down-Sheet.png',
    death:       '/assets/characters/body_a/Death_Base_Death_Down-Sheet.png',
    hit:         '/assets/characters/body_a/Hit_Base_Hit_Down-Sheet.png',
    slice:       '/assets/characters/body_a/Slice_Base_Slice_Down-Sheet.png',
    crush:       '/assets/characters/body_a/Crush_Base_Crush_Down-Sheet.png',
    water:       '/assets/characters/body_a/Watering_Base_Watering_Down-Sheet.png',
  },

  // ── NPCs ────────────────────────────────────────────────────────────────
  npcs: {
    knight_idle:  '/assets/npcs/knight_idle.png',
    knight_run:   '/assets/npcs/knight_run.png',
    knight_death: '/assets/npcs/knight_death.png',
    rogue_idle:   '/assets/npcs/rogue_idle.png',
    rogue_run:    '/assets/npcs/rogue_run.png',
    rogue_death:  '/assets/npcs/rogue_death.png',
    wizard_idle:  '/assets/npcs/wizzard_idle.png',
    wizard_run:   '/assets/npcs/wizzard_run.png',
    wizard_death: '/assets/npcs/wizzard_death.png',
  },

  // ── Mobs ─────────────────────────────────────────────────────────────────
  mobs: {
    orc_idle:              '/assets/mobs/orc_idle.png',
    orc_run:               '/assets/mobs/orc_run.png',
    orc_death:             '/assets/mobs/orc_death.png',
    orc_warrior_idle:      '/assets/mobs/orc_-_warrior_idle.png',
    orc_warrior_run:       '/assets/mobs/orc_-_warrior_run.png',
    orc_warrior_death:     '/assets/mobs/orc_-_warrior_death.png',
    orc_rogue_idle:        '/assets/mobs/orc_-_rogue_idle.png',
    orc_rogue_run:         '/assets/mobs/orc_-_rogue_run.png',
    orc_shaman_idle:       '/assets/mobs/orc_-_shaman_idle.png',
    skeleton_idle:         '/assets/mobs/skeleton_-_base_idle.png',
    skeleton_run:          '/assets/mobs/skeleton_-_base_run.png',
    skeleton_death:        '/assets/mobs/skeleton_-_base_death.png',
    skeleton_mage_idle:    '/assets/mobs/skeleton_-_mage_idle.png',
    skeleton_warrior_idle: '/assets/mobs/skeleton_-_warrior_idle.png',
    skeleton_rogue_idle:   '/assets/mobs/skeleton_-_rogue_idle.png',
  },

  // ── Environment props ───────────────────────────────────────────────────
  props: {
    farm:       '/assets/props/Farm.png',
    resources:  '/assets/props/Resources.png',
    rocks:      '/assets/props/Rocks.png',
    tools:      '/assets/props/Tools.png',
    furniture:  '/assets/props/Furniture.png',
    vegetation: '/assets/props/Vegetation.png',
    dungeon:    '/assets/props/Dungeon_Props.png',
    esoteric:   '/assets/props/Esoteric.png',
    shadows:    '/assets/props/Shadows.png',
    meat:       '/assets/props/Meat.png',
    trees: {
      model1_sm: '/assets/props/trees/model_01_Size_02.png',
      model1_md: '/assets/props/trees/model_01_Size_03.png',
      model1_lg: '/assets/props/trees/model_01_Size_04.png',
      model1_xl: '/assets/props/trees/model_01_Size_05.png',
      model2_sm: '/assets/props/trees/model_02_Size_02.png',
      model2_md: '/assets/props/trees/model_02_Size_03.png',
      model2_lg: '/assets/props/trees/model_02_Size_04.png',
      model3_sm: '/assets/props/trees/model_03_Size_02.png',
      model3_md: '/assets/props/trees/model_03_Size_03.png',
    },
  },

  // ── Tilesets ─────────────────────────────────────────────────────────────
  tilesets: {
    dungeon:    '/assets/tilesets/Dungeon_Tiles.png',
    floors:     '/assets/tilesets/Floors_Tiles.png',
    walls:      '/assets/tilesets/Wall_Tiles.png',
    variations: '/assets/tilesets/Wall_Variations.png',
    water:      '/assets/tilesets/Water_tiles.png',
  },

  // ── Stations (craft) ─────────────────────────────────────────────────────
  stations: {
    anvil:       '/assets/stations/Anvil_Anvil.png',
    bonfire:     '/assets/stations/Bonfire_Bonfire.png',
    furnace:     '/assets/stations/Furnace_Furnace.png',
    sawmill:     '/assets/stations/Sawmill_Base.png',
    workbench:   '/assets/stations/Workbench_Workbench.png',
    alchemy_1:   '/assets/stations/Alchemy_Alchemy_Table_01-Sheet.png',
    alchemy_2:   '/assets/stations/Alchemy_Alchemy_Table_02-Sheet.png',
    alchemy_3:   '/assets/stations/Alchemy_Alchemy_Table_03-Sheet.png',
  },

  // ── Buildings ────────────────────────────────────────────────────────────
  buildings: {
    floors:  '/assets/buildings/Floors.png',
    walls:   '/assets/buildings/Walls.png',
    roofs:   '/assets/buildings/Roofs.png',
    props:   '/assets/buildings/Props.png',
    shadows: '/assets/buildings/Shadows.png',
  },

  // ── Weapons ──────────────────────────────────────────────────────────────
  weapons: {
    bone: '/assets/weapons/bone_Bone.png',
    wood: '/assets/weapons/wood_Wood.png',
    hand: '/assets/weapons/hands_Hands.png',
  },
} as const
