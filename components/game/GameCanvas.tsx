'use client'
import { useEffect, useRef } from 'react'
import styles from '../../styles/Game.module.css'

function rng32(s:number){return()=>{let t=(s+=0x6d2b79f5);t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const MAP_W=52,MAP_H=40,TILE=32,SEED=42
type TT=0|1|2|3|4

function buildMap(){
  const r=rng32(SEED),raw=Array.from({length:MAP_H},()=>Array.from({length:MAP_W},()=>r()))
  for(let i=0;i<5;i++) for(let y=1;y<MAP_H-1;y++) for(let x=1;x<MAP_W-1;x++){let s=0;for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) s+=raw[y+dy][x+dx];raw[y][x]=s/9}
  return raw.map((row,y)=>row.map((v,x):TT=>(!x||!y||x===MAP_W-1||y===MAP_H-1?3:v<0.18?3:v<0.34?2:v<0.60?0:v<0.76?1:4)))
}
const MAP=buildMap()

interface Obj{x:number;y:number;tex:string;res:string;sx:number;sy:number;anchor:number;colW:number;colH:number}
function buildObjects():Obj[]{
  const r=rng32(SEED+7),cx=Math.floor(MAP_W/2),cy=Math.floor(MAP_H/2),out:Obj[]=[]
  for(let y=2;y<MAP_H-2;y++) for(let x=2;x<MAP_W-2;x++){
    if(MAP[y][x]===3) continue
    if(Math.abs(x-cx)<10&&Math.abs(y-cy)<8) continue
    if(r()>0.09) continue
    const v=r(),t=MAP[y][x],rv=r()
    if(t===0||t===2){
      if(v>0.62)      out.push({x,y,tex:'tree_m01_size_03',res:'Wood',    sx:0.55,sy:0.55,anchor:0.85,colW:20,colH:16})
      else if(v>0.52) out.push({x,y,tex:'tree_m02_size_03',res:'Wood',    sx:0.70,sy:0.70,anchor:0.85,colW:18,colH:14})
      else if(v>0.44) out.push({x,y,tex:'tree_m01_size_04',res:'Wood',    sx:0.30,sy:0.30,anchor:0.85,colW:22,colH:18})
      else if(v>0.36) out.push({x,y,tex:'prop_farm_1_'+Math.floor(rv*4), res:'Grain',sx:1.4,sy:1.4,anchor:0.9,colW:20,colH:16})
      else            out.push({x,y,tex:'prop_rock_1_'+Math.floor(rv*5), res:'Stone',sx:1.6,sy:1.6,anchor:0.9,colW:24,colH:20})
    } else if(t===1){
      out.push({x,y,tex:v>0.6?'prop_rock_2_'+Math.floor(rv*4):'prop_res_0_'+Math.floor(rv*3),res:v>0.6?'Stone':'Iron',sx:1.6,sy:1.6,anchor:0.9,colW:24,colH:20})
    } else if(t===4){
      out.push({x,y,tex:'prop_res_1_'+Math.floor(rv*4+1),res:'Dark Ore',sx:1.5,sy:1.5,anchor:0.9,colW:20,colH:16})
    }
  }
  return out
}
const WORLD_OBJS=buildObjects()
interface RNode{spr:Phaser.GameObjects.Sprite;body:Phaser.GameObjects.Rectangle;res:string;depleted:boolean;ms:number;isTree:boolean}

export default function GameCanvas(){
  const divRef=useRef<HTMLDivElement>(null)
  const gameRef=useRef<{destroy:(b:boolean)=>void}|null>(null)

  useEffect(()=>{
    if(gameRef.current||!divRef.current) return
    async function init(){
      const PM=await import('phaser')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const P=(PM as any).default??PM
      const VW=800,VH=500,WW=MAP_W*TILE,WH=MAP_H*TILE

      class PreloadScene extends P.Scene{
        constructor(){super({key:'PreloadScene'})}
        preload(this:Phaser.Scene){
          const cx=VW/2,cy=VH/2
          this.add.rectangle(cx,cy,380,22,0x0e0e18)
          this.add.rectangle(cx,cy,380,22,0).setStrokeStyle(1,0x2a2a3d)
          const bar=this.add.rectangle(cx-188,cy,2,16,0xf0c040).setOrigin(0,0.5)
          this.add.text(cx,cy-32,'LOADING THE REALM...',{fontFamily:'"Press Start 2P"',fontSize:'9px',color:'#f0c040'}).setOrigin(0.5)
          this.add.text(cx,cy+30,'DUX FARM · Season I',{fontFamily:'"Press Start 2P"',fontSize:'6px',color:'#4a4560'}).setOrigin(0.5)
          this.load.on('progress',(v:number)=>{bar.width=Math.max(2,376*v)})

          // Floor tiles
          ;['g1','g2','g3','g4','g5','g6','g7','g8'].forEach(n=>this.load.image('tg_'+n,'/assets/tiles/t_grass_'+n+'.png'))
          ;['s1','s2','s3','s4','s5','s6'].forEach(n=>this.load.image('ts_'+n,'/assets/tiles/t_stone_'+n+'.png'))
          ;['d1','d2','d3','d4','d5','d6'].forEach(n=>this.load.image('td_'+n,'/assets/tiles/t_dirt_'+n+'.png'))
          ;['dk1','dk2','dk3'].forEach(n=>this.load.image('tdk_'+n,'/assets/tiles/t_dark_'+n+'.png'))
          ;['w1','w2','w3'].forEach(n=>this.load.image('tw_'+n,'/assets/tiles/t_water_'+n+'.png'))

          // Trees & props
          ;['tree_m01_size_03','tree_m01_size_04','tree_m02_size_03','tree_m02_size_04','tree_m03_size_03'].forEach(n=>this.load.image(n,`/assets/tiles/${n}.png`))
          for(let r=0;r<4;r++) for(let c=0;c<6;c++) this.load.image(`prop_rock_${r}_${c}`,`/assets/tiles/prop_rock_${r}_${c}.png`)
          for(let r=0;r<2;r++) for(let c=0;c<8;c++) this.load.image(`prop_res_${r}_${c}`,`/assets/tiles/prop_res_${r}_${c}.png`)
          for(let r=0;r<3;r++) for(let c=0;c<6;c++) this.load.image(`prop_farm_${r}_${c}`,`/assets/tiles/prop_farm_${r}_${c}.png`)
          for(let r=0;r<3;r++) for(let c=0;c<8;c++) this.load.image(`prop_veg_${r}_${c}`,`/assets/tiles/prop_veg_${r}_${c}.png`)
          for(let r=3;r<6;r++) for(let c=0;c<10;c++) this.load.image(`deco_veg_${r}_${c}`,`/assets/tiles/deco_veg_${r}_${c}.png`)

          // Station BASE sprites (static)
          this.load.image('st_sawmill',  '/assets/stations/Sawmill_Base.png')
          this.load.image('st_anvil',    '/assets/stations/Anvil_Anvil.png')
          this.load.image('st_workbench','/assets/stations/Workbench_Workbench.png')
          this.load.image('st_furnace',  '/assets/stations/Furnace_Furnace.png')
          this.load.image('st_bonfire',  '/assets/stations/Bonfire_Bonfire.png')

          // Station ANIMATED effects
          // Bonfire fire: 128x48 = 4 frames of 32x48
          this.load.spritesheet('fx_fire',  '/assets/stations/fire_anim.png',    {frameWidth:32,frameHeight:48})
          // Bonfire: 128x32 = 4 frames of 32x32
          this.load.spritesheet('fx_bonfire','/assets/stations/bonfire_anim.png',{frameWidth:32,frameHeight:32})
          // Smoke: 128x48 = 4 frames of 32x48
          this.load.spritesheet('fx_smoke', '/assets/stations/smoke_anim.png',   {frameWidth:32,frameHeight:48})
          // Furnace glow: 96x128 = 3 frames of 32x128
          this.load.spritesheet('fx_furnace_glow','/assets/stations/furnace_glow.png',{frameWidth:32,frameHeight:128})

          // Hero — Pixel Crawler Body_A (64x64 frames)
          const hp='/assets/characters/body_a'
          ;[['h_idle_d','idle_down',4],['h_idle_u','idle_up',4],['h_idle_s','idle_side',4],
            ['h_walk_d','walk_down',6],['h_walk_u','walk_up',6],['h_walk_s','walk_side',6],
            ['h_run_d','run_down',6],  ['h_run_u','run_up',6],  ['h_run_s','run_side',6],
            ['h_col_d','collect_down',8],['h_col_u','collect_up',8],['h_col_s','collect_side',8],
            ['h_crush_d','crush_down',8],['h_crush_s','crush_side',8],
            ['h_slice_d','slice_down',8],['h_slice_u','slice_up',8],['h_slice_s','slice_side',8],
          ].forEach(([k,f])=>this.load.spritesheet(k as string,`${hp}/${f}.png`,{frameWidth:64,frameHeight:64}))

          ;['knight','rogue','wizard'].forEach(n=>this.load.spritesheet('npc_'+n,`/assets/npcs/${n==='wizard'?'wizzard':n}_idle_sheet.png`,{frameWidth:32,frameHeight:32}))
          ;['cyclope','bat','bear'].forEach(n=>this.load.spritesheet('mob_'+n,`/assets/tiles/nj_mob_${n}.png`,{frameWidth:32,frameHeight:32}))
        }
        create(this:Phaser.Scene){this.scene.start('WorldScene')}
      }

      class WorldScene extends P.Scene{
        hero!:Phaser.GameObjects.Sprite
        shadow!:Phaser.GameObjects.Ellipse
        nameTag!:Phaser.GameObjects.Text
        heroHpBg!:Phaser.GameObjects.Rectangle
        heroHpFill!:Phaser.GameObjects.Rectangle
        facing='down';collecting=false;atkCd=0
        cursors!:Phaser.Types.Input.Keyboard.CursorKeys
        kW!:Phaser.Input.Keyboard.Key;kA!:Phaser.Input.Keyboard.Key
        kS!:Phaser.Input.Keyboard.Key;kD!:Phaser.Input.Keyboard.Key
        kE!:Phaser.Input.Keyboard.Key;kShift!:Phaser.Input.Keyboard.Key

        nodes:RNode[]=[]; nearNode:RNode|null=null
        // Collision bodies for static objects
        colliders:Phaser.GameObjects.Rectangle[]=[]

        mobs:{spr:Phaser.GameObjects.Sprite;hp:number;maxHp:number;drop:string;spd:number;alive:boolean;hpBg:Phaser.GameObjects.Rectangle;hpBar:Phaser.GameObjects.Rectangle}[]=[]

        farmTxt!:Phaser.GameObjects.Text
        invIcons:Phaser.GameObjects.Text[]=[]; invCounts:Phaser.GameObjects.Text[]=[]
        miniGfx!:Phaser.GameObjects.Graphics; prompt!:Phaser.GameObjects.Text
        hp=100; farm=0; inv:{name:string;qty:number}[]=[]
        otherPlayers=new Map<string,Phaser.GameObjects.Sprite>()
        pid=`lord_${Math.random().toString(36).slice(2,7)}`
        constructor(){super({key:'WorldScene'})}

        // ── Check hero collision against all solid rects ──────────────
        wouldCollide(this:WorldScene,nx:number,ny:number):boolean{
          const hw=14, hh=12 // hero half-width/height for feet box
          for(const col of this.colliders){
            if(!col.active) continue
            const cx=col.x,cy=col.y,cw=col.width/2,ch=col.height/2
            if(nx+hw>cx-cw&&nx-hw<cx+cw&&ny+hh>cy-ch&&ny-hh<cy+ch) return true
          }
          return false
        }

        addCollider(this:WorldScene,x:number,y:number,w:number,h:number):Phaser.GameObjects.Rectangle{
          const r=this.add.rectangle(x,y,w,h,0xff0000,0).setDepth(0) // invisible
          this.colliders.push(r)
          return r
        }

        create(this:WorldScene){
          const r=rng32(SEED+1)
          const gk=['tg_g1','tg_g1','tg_g2','tg_g3','tg_g4','tg_g5','tg_g6','tg_g7','tg_g8']
          const sk=['ts_s1','ts_s1','ts_s2','ts_s3','ts_s4','ts_s5','ts_s6']
          const dk=['td_d1','td_d1','td_d2','td_d3','td_d4','td_d5','td_d6']
          const drk=['tdk_dk1','tdk_dk1','tdk_dk2','tdk_dk3']
          const wk=['tw_w1','tw_w1','tw_w2','tw_w3']

          // ── Tilemap ───────────────────────────────────────────────────
          for(let y=0;y<MAP_H;y++) for(let x=0;x<MAP_W;x++){
            const t=MAP[y][x],pool=t===0?gk:t===1?sk:t===2?dk:t===3?wk:drk
            this.add.image(x*TILE+TILE/2,y*TILE+TILE/2,pool[Math.floor(r()*pool.length)]).setDisplaySize(TILE+1,TILE+1).setDepth(0)
          }

          // Water edge + shimmer
          for(let y=1;y<MAP_H-1;y++) for(let x=1;x<MAP_W-1;x++){
            if(MAP[y][x]!==3) continue
            if([[-1,0],[1,0],[0,-1],[0,1]].some(([dx,dy])=>MAP[y+dy]?.[x+dx]!==3))
              this.add.rectangle(x*TILE+TILE/2,y*TILE+TILE/2,TILE,TILE,0x0a2a4a,0.3).setDepth(0.1)
            if(r()>0.3) continue
            const rect=this.add.rectangle(x*TILE+TILE/2+r()*8-4,y*TILE+TILE/2,TILE/3,TILE/4,0x66aaff,0.1).setDepth(0.2)
            this.tweens.add({targets:rect,alpha:0.28,x:'+=5',duration:2200+r()*1200,yoyo:true,repeat:-1})
          }

          // ── Village stone plaza ────────────────────────────────────
          const vcx=Math.floor(MAP_W/2),vcy=Math.floor(MAP_H/2)
          for(let dy=-7;dy<=7;dy++) for(let dx=-10;dx<=10;dx++){
            const tx=vcx+dx,ty=vcy+dy
            if(tx<0||ty<0||tx>=MAP_W||ty>=MAP_H) continue
            const blend=Math.abs(dx)+Math.abs(dy)>14?sk[1]:sk[Math.floor(r()*sk.length)]
            this.add.image(tx*TILE+TILE/2,ty*TILE+TILE/2,blend).setDisplaySize(TILE+1,TILE+1).setDepth(0.5)
          }

          // ── Resource nodes (trees, rocks, plants) ─────────────────
          WORLD_OBJS.forEach(obj=>{
            const px=obj.x*TILE+TILE/2, py=obj.y*TILE+TILE/2
            const spr=this.add.sprite(px,py,obj.tex).setScale(obj.sx,obj.sy).setOrigin(0.5,obj.anchor).setDepth(py+5)
            // Collision rectangle at base of object
            const body=this.addCollider(px,py+4,obj.colW,obj.colH)
            const ms:Record<string,number>={Wood:22000,Iron:40000,Grain:15000,Stone:20000,Herb:12000,'Dark Ore':50000}
            this.nodes.push({spr,body,res:obj.res,depleted:false,ms:ms[obj.res]??20000,isTree:obj.tex.startsWith('tree')})
          })

          // ── Decorative vegetation ──────────────────────────────────
          const dr=rng32(SEED+99)
          const decoKeys=['deco_veg_3_0','deco_veg_3_1','deco_veg_3_2','deco_veg_4_0','prop_veg_2_0','prop_veg_2_1','prop_veg_2_2']
          for(let y=1;y<MAP_H-1;y++) for(let x=1;x<MAP_W-1;x++){
            if(MAP[y][x]!==0&&MAP[y][x]!==2) continue
            if(Math.abs(x-vcx)<13&&Math.abs(y-vcy)<11) continue
            if(dr()>0.04) continue
            const k=decoKeys[Math.floor(dr()*decoKeys.length)]
            this.add.image(x*TILE+TILE/2,y*TILE+TILE/2,k).setScale(1.2).setDepth(y*TILE+10)
          }

          // ── Craft stations — spaced layout with animated FX ────────
          const vx=vcx*TILE, vy=vcy*TILE

          // Station layout: 2 rows, widely spaced
          // Row 1 (north): Sawmill(left), Workbench(centre-left), Anvil(centre-right), Furnace(right)
          // Row 2 (south): Bonfire(centre)
          const stDefs:[string,number,number,string,number,number,number,number][]=[
            //  key         x           y          label        cW  cH  cOffX cOffY
            ['st_sawmill',  vx-220, vy-110, 'Sawmill',    80, 40,  0,  10],
            ['st_workbench',vx-70,  vy-110, 'Workbench',  60, 30,  0,  10],
            ['st_anvil',    vx+90,  vy-110, 'Anvil',      60, 30,  0,  5],
            ['st_furnace',  vx+240, vy-110, 'Furnace',    70, 40,  0,  20],
            ['st_bonfire',  vx,     vy+110, 'Bonfire',    40, 30,  0,  5],
          ]
          stDefs.forEach(([k,x,y,label,cw,ch])=>{
            this.add.image(x,y,k).setScale(0.82).setDepth(y+5)
            this.add.text(x,y+36,label,{fontFamily:'"Press Start 2P"',fontSize:'5px',color:'#c8962a',backgroundColor:'#00000088',padding:{x:3,y:1}}).setOrigin(0.5).setDepth(y+7)
            // Collision body for station
            this.addCollider(x,y+ch/2,cw,ch)
          })

          // ── Animated FX: fire on bonfire ──────────────────────────
          const bfX=vx, bfY=vy+110
          // Fire sprite floating above bonfire base
          const fire=this.add.sprite(bfX,bfY-24,'fx_fire').setScale(2).setDepth(bfY+8)
          fire.play('fx_fire_anim')
          // Smoke above fire
          const smoke=this.add.sprite(bfX,bfY-52,'fx_smoke').setScale(1.5).setDepth(bfY+9).setAlpha(0.6)
          smoke.play('fx_smoke_anim')

          // ── Animated FX: furnace glow ─────────────────────────────
          const furnX=vx+240, furnY=vy-110
          // Glow overlay on furnace
          const glow=this.add.sprite(furnX,furnY,'fx_furnace_glow').setScale(1.2).setDepth(furnY+8).setAlpha(0.7)
          glow.play('fx_furnace_anim')
          // Particle-like ember tweens
          for(let i=0;i<6;i++){
            const ember=this.add.rectangle(furnX+(Math.random()-0.5)*20,furnY-20,3,3,0xff6600,0.9).setDepth(furnY+9)
            this.tweens.add({targets:ember,y:ember.y-30-Math.random()*20,alpha:0,duration:800+Math.random()*600,repeat:-1,delay:Math.random()*800,
              onRepeat:()=>{ember.x=furnX+(Math.random()-0.5)*20;ember.y=furnY-10}})
          }

          // ── Anvil sparks ──────────────────────────────────────────
          const anvilX=vx+90, anvilY=vy-110
          for(let i=0;i<4;i++){
            const spark=this.add.rectangle(anvilX,anvilY-10,2,2,0xffcc00,1).setDepth(anvilY+9)
            this.tweens.add({targets:spark,x:spark.x+(Math.random()-0.5)*24,y:spark.y-16-Math.random()*10,alpha:0,duration:400+Math.random()*300,
              repeat:-1,delay:i*300+Math.random()*200,
              onRepeat:()=>{spark.x=anvilX+(Math.random()-0.5)*8;spark.y=anvilY-10;spark.alpha=1}})
          }

          // ── Sawmill spinning dust ─────────────────────────────────
          const sawX=vx-220, sawY=vy-110
          for(let i=0;i<5;i++){
            const dust=this.add.rectangle(sawX+(Math.random()-0.5)*30,sawY+5,2,2,0xc8a060,0.8).setDepth(sawY+9)
            this.tweens.add({targets:dust,x:'+='+((Math.random()-0.5)*20),y:dust.y+10+Math.random()*8,alpha:0,duration:600+Math.random()*400,
              repeat:-1,delay:i*200+Math.random()*300,
              onRepeat:()=>{dust.x=sawX+(Math.random()-0.5)*30;dust.y=sawY+5;dust.alpha=0.8}})
          }

          // ── NPCs ──────────────────────────────────────────────────
          ;([
            ['npc_knight','na_k',vx-280,vy+50,'Sir Aldric'],
            ['npc_wizard', 'na_w',vx+280,vy+50,'Sylva'],
            ['npc_rogue',  'na_r',vx,    vy+170,'Shade'],
          ] as [string,string,number,number,string][]).forEach(([tex,anim,x,y,name])=>{
            this.add.sprite(x,y,tex).setScale(1.8).setDepth(y+1).play(anim)
            this.add.text(x,y-22,name,{fontFamily:'"Press Start 2P"',fontSize:'5px',color:'#3ecfb2',backgroundColor:'#08080fcc',padding:{x:3,y:2}}).setOrigin(0.5).setDepth(y+2)
            this.addCollider(x,y+8,28,20)
          })

          // ── Mobs ──────────────────────────────────────────────────
          const mr=rng32(SEED+33); let mc=0
          const md=[
            {tex:'mob_cyclope',anim:'mob_c',hp:30,drop:'Bone',    spd:55,col:0xff4444},
            {tex:'mob_bat',    anim:'mob_b',hp:15,drop:'Coin',     spd:90,col:0xaa44ff},
            {tex:'mob_bear',   anim:'mob_r',hp:50,drop:'Bear Fur', spd:38,col:0xff8800},
          ]
          for(let y=2;y<MAP_H-2&&mc<22;y++) for(let x=2;x<MAP_W-2&&mc<22;x++){
            if(MAP[y][x]!==1&&MAP[y][x]!==4) continue
            if(mr()>0.026) continue
            if(Math.abs(x-vcx)<12&&Math.abs(y-vcy)<10) continue
            const px=x*TILE+TILE/2,py=y*TILE+TILE/2
            const m=md[Math.floor(mr()*md.length)]
            const spr=this.add.sprite(px,py,m.tex).setScale(2).setDepth(py).play(m.anim)
            const hpBg=this.add.rectangle(px,py-28,30,5,0x1a1a28).setDepth(py+1)
            const hpBar=this.add.rectangle(px-15,py-28,30,5,m.col).setOrigin(0,0.5).setDepth(py+2)
            this.mobs.push({spr,hp:m.hp,maxHp:m.hp,drop:m.drop,spd:m.spd,alive:true,hpBg,hpBar})
            mc++
          }

          // ── Animations ────────────────────────────────────────────
          if(!this.anims.exists('h_idle_d')){
            const a=this.anims
            ;[['h_idle_d',4,6,-1],['h_idle_u',4,6,-1],['h_idle_s',4,6,-1],
              ['h_walk_d',6,9,-1],['h_walk_u',6,9,-1],['h_walk_s',6,9,-1],
              ['h_run_d', 6,12,-1],['h_run_u',6,12,-1],['h_run_s',6,12,-1],
              ['h_col_d', 8,10,0],['h_col_u',8,10,0],['h_col_s',8,10,0],
              ['h_crush_d',8,10,0],['h_crush_s',8,10,0],
              ['h_slice_d',8,12,0],['h_slice_u',8,12,0],['h_slice_s',8,12,0],
            ].forEach(([k,end,fps,rep])=>a.create({key:k as string,frames:a.generateFrameNumbers(k as string,{start:0,end:end as number-1}),frameRate:fps as number,repeat:rep as number}))
            a.create({key:'na_k',frames:a.generateFrameNumbers('npc_knight',{start:0,end:3}),frameRate:5,repeat:-1})
            a.create({key:'na_r',frames:a.generateFrameNumbers('npc_rogue', {start:0,end:3}),frameRate:5,repeat:-1})
            a.create({key:'na_w',frames:a.generateFrameNumbers('npc_wizard',{start:0,end:3}),frameRate:5,repeat:-1})
            a.create({key:'mob_c',frames:a.generateFrameNumbers('mob_cyclope',{start:0,end:3}),frameRate:6,repeat:-1})
            a.create({key:'mob_b',frames:a.generateFrameNumbers('mob_bat',    {start:0,end:3}),frameRate:8,repeat:-1})
            a.create({key:'mob_r',frames:a.generateFrameNumbers('mob_bear',   {start:0,end:3}),frameRate:5,repeat:-1})
            // Station FX animations
            a.create({key:'fx_fire_anim',   frames:a.generateFrameNumbers('fx_fire',   {start:0,end:3}),frameRate:8,repeat:-1})
            a.create({key:'fx_smoke_anim',  frames:a.generateFrameNumbers('fx_smoke',  {start:0,end:3}),frameRate:5,repeat:-1})
            a.create({key:'fx_bonfire_anim',frames:a.generateFrameNumbers('fx_bonfire',{start:0,end:3}),frameRate:8,repeat:-1})
            a.create({key:'fx_furnace_anim',frames:a.generateFrameNumbers('fx_furnace_glow',{start:0,end:2}),frameRate:4,repeat:-1})
          }

          // ── Hero ──────────────────────────────────────────────────
          const spX=vcx*TILE, spY=vcy*TILE+70
          this.shadow=this.add.ellipse(spX,spY+22,28,9,0,0.4).setDepth(spY-1)
          this.hero=this.add.sprite(spX,spY,'h_idle_d').setScale(1.6).setDepth(spY)
          this.hero.play('h_idle_d')
          this.heroHpBg=this.add.rectangle(spX,spY-28,38,5,0x1a1a28).setDepth(spY+3)
          this.heroHpFill=this.add.rectangle(spX-19,spY-28,38,5,0x4caf50).setOrigin(0,0.5).setDepth(spY+4)
          this.nameTag=this.add.text(spX,spY-38,'Lord',{fontFamily:'"Press Start 2P"',fontSize:'5px',color:'#f0c040',backgroundColor:'#00000099',padding:{x:3,y:2}}).setOrigin(0.5).setDepth(spY+5)

          this.cameras.main.setBounds(0,0,WW,WH).startFollow(this.hero,true,0.08,0.08).setZoom(1.15)

          this.cursors=this.input.keyboard!.createCursorKeys()
          this.kW=this.input.keyboard!.addKey(P.Input.Keyboard.KeyCodes.W)
          this.kA=this.input.keyboard!.addKey(P.Input.Keyboard.KeyCodes.A)
          this.kS=this.input.keyboard!.addKey(P.Input.Keyboard.KeyCodes.S)
          this.kD=this.input.keyboard!.addKey(P.Input.Keyboard.KeyCodes.D)
          this.kE=this.input.keyboard!.addKey(P.Input.Keyboard.KeyCodes.E)
          this.kShift=this.input.keyboard!.addKey(P.Input.Keyboard.KeyCodes.SHIFT)

          this.buildHUD()
          this.miniGfx=this.add.graphics().setScrollFactor(0).setDepth(1000)
          this.drawMinimap()
          this.prompt=this.add.text(0,0,'',{fontFamily:'"Press Start 2P"',fontSize:'6px',color:'#3ecfb2',backgroundColor:'#08080fee',padding:{x:5,y:3}}).setOrigin(0.5).setDepth(1100).setVisible(false)
          this.time.addEvent({delay:10000,loop:true,callback:()=>{this.farm++;this.farmTxt.setText('$FARM: '+this.farm)}})
          this.initMultiplayer()
        }

        buildHUD(this:WorldScene){
          this.add.rectangle(8,8,130,40,0x06060e,0.9).setOrigin(0).setScrollFactor(0).setDepth(999)
          this.add.rectangle(8,8,130,40,0).setStrokeStyle(1,0x2a2a3d).setOrigin(0).setScrollFactor(0).setDepth(1000)
          this.farmTxt=this.add.text(14,14,'$FARM: 0',{fontFamily:'"Press Start 2P"',fontSize:'7px',color:'#f0c040'}).setScrollFactor(0).setDepth(1001)
          this.add.text(14,30,'Season I · Online',{fontFamily:'"Press Start 2P"',fontSize:'5px',color:'#3a3a52'}).setScrollFactor(0).setDepth(1001)
          const SLOTS=7,SW=34,GAP=3,tw=SLOTS*(SW+GAP)-GAP,sx=(VW-tw)/2,by=VH-SW-10
          this.add.rectangle(sx-8,by-7,tw+16,SW+16,0x06060e,0.9).setOrigin(0).setScrollFactor(0).setDepth(999)
          this.add.rectangle(sx-8,by-7,tw+16,SW+16,0).setStrokeStyle(1,0x2a2a3d).setOrigin(0).setScrollFactor(0).setDepth(1000)
          for(let i=0;i<SLOTS;i++){
            const x=sx+i*(SW+GAP)
            this.add.rectangle(x+SW/2,by+SW/2,SW,SW,0x111120).setStrokeStyle(1,0x3a3a52).setScrollFactor(0).setDepth(1001)
            this.invIcons.push(this.add.text(x+SW/2,by+SW/2-2,'',{fontFamily:'"Press Start 2P"',fontSize:'11px'}).setOrigin(0.5).setScrollFactor(0).setDepth(1002))
            this.invCounts.push(this.add.text(x+SW-2,by+SW-2,'',{fontFamily:'"Press Start 2P"',fontSize:'5px',color:'#b0a8c0'}).setOrigin(1).setScrollFactor(0).setDepth(1002))
          }
          this.add.text(VW-10,VH-8,'WASD  move  SHIFT  run  E  collect/attack',{fontFamily:'"Press Start 2P"',fontSize:'5px',color:'#2a2a40'}).setOrigin(1,1).setScrollFactor(0).setDepth(1000)
        }

        updateHotbar(this:WorldScene){
          const IC:Record<string,string>={Wood:'🌲',Stone:'🪨',Grain:'🌾',Iron:'⛏',Bone:'💀',Coin:'🪙','Bear Fur':'🐻',Herb:'🌿','Dark Ore':'💎'}
          this.inv.slice(0,7).forEach((it,i)=>{this.invIcons[i]?.setText(IC[it.name]??'?');this.invCounts[i]?.setText(String(it.qty))})
          for(let i=this.inv.length;i<7;i++){this.invIcons[i]?.setText('');this.invCounts[i]?.setText('')}
        }

        drawMinimap(this:WorldScene){
          const MM={x:VW-86,y:VH-70,w:78,h:62},sx=MM.w/MAP_W,sy=MM.h/MAP_H,g=this.miniGfx; g.clear()
          g.fillStyle(0x04040c,0.95);g.fillRect(MM.x-3,MM.y-3,MM.w+6,MM.h+6)
          g.lineStyle(1,0x2a2a3d);g.strokeRect(MM.x-3,MM.y-3,MM.w+6,MM.h+6)
          const cm:Record<number,number>={0:0x2a5c18,1:0x4a4a5a,2:0x5a3e20,3:0x0e2e50,4:0x1e1e2e}
          for(let y=0;y<MAP_H;y++) for(let x=0;x<MAP_W;x++){g.fillStyle(cm[MAP[y][x]]??0x2a5c18);g.fillRect(MM.x+x*sx,MM.y+y*sy,Math.ceil(sx),Math.ceil(sy))}
          g.fillStyle(0xf0c040,0.8);g.fillRect(MM.x+(MAP_W/2)*sx-2,MM.y+(MAP_H/2)*sy-2,4,4)
          if(this.hero){g.fillStyle(0xffffff);g.fillRect(MM.x+(this.hero.x/WW)*MM.w-1,MM.y+(this.hero.y/WH)*MM.h-1,3,3)}
          this.otherPlayers.forEach(s=>{g.fillStyle(0x9b6dff);g.fillRect(MM.x+(s.x/WW)*MM.w-1,MM.y+(s.y/WH)*MM.h-1,2,2)})
        }

        addInv(this:WorldScene,item:string){const e=this.inv.find(i=>i.name===item);if(e)e.qty++;else this.inv.push({name:item,qty:1});this.updateHotbar()}

        pop(this:WorldScene,x:number,y:number,msg:string,col:string){
          const t=this.add.text(x,y-16,msg,{fontFamily:'"Press Start 2P"',fontSize:'7px',color:col,stroke:'#000',strokeThickness:2}).setOrigin(0.5).setDepth(1200)
          this.tweens.add({targets:t,y:y-52,alpha:0,duration:1000,onComplete:()=>t.destroy()})
        }

        atkAnim(this:WorldScene,type:'col'|'crush'|'slice'):string{
          const f=this.facing
          if(type==='col')   return f==='up'?'h_col_u':f==='left'||f==='right'?'h_col_s':'h_col_d'
          if(type==='crush') return f==='left'||f==='right'?'h_crush_s':'h_crush_d'
          return f==='up'?'h_slice_u':f==='left'||f==='right'?'h_slice_s':'h_slice_d'
        }
        idleAnim(this:WorldScene):string{return this.facing==='up'?'h_idle_u':this.facing==='left'||this.facing==='right'?'h_idle_s':'h_idle_d'}

        doCollect(this:WorldScene){
          const n=this.nearNode; if(!n||this.collecting||n.depleted) return
          this.collecting=true; n.depleted=true; n.spr.setAlpha(0.3); n.body.setActive(false)
          this.hero.play(this.atkAnim(n.isTree?'crush':'col'))
          this.pop(this.hero.x,this.hero.y,'+1 '+n.res,'#4caf50')
          this.hero.once('animationcomplete',()=>{
            this.collecting=false; this.addInv(n.res); this.farm++; this.farmTxt.setText('$FARM: '+this.farm)
            this.hero.play(this.idleAnim())
            this.time.addEvent({delay:n.ms,callback:()=>{n.depleted=false;n.spr.setAlpha(1);n.body.setActive(true)}})
          })
        }

        async initMultiplayer(this:WorldScene){
          try{
            const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            if(!url||!key) return
            const {createClient}=await import('@supabase/supabase-js')
            const sb=createClient(url,key)
            const ch=sb.channel('realm_v6',{config:{presence:{key:this.pid}}})
            ch.on('presence',{event:'sync'},()=>{
              const st=ch.presenceState<{pid:string;x:number;y:number}>()
              Object.entries(st).forEach(([k,arr])=>{
                const p=arr[0]; if(!p||p.pid===this.pid) return
                if(!this.otherPlayers.has(k)){const s=this.add.sprite(p.x,p.y,'h_idle_d').setScale(1.6).setAlpha(0.8).setDepth(p.y);s.play('h_idle_d');this.otherPlayers.set(k,s)}
                else this.otherPlayers.get(k)!.setPosition(p.x,p.y).setDepth(p.y)
              })
            }).on('presence',{event:'leave'},({key:k})=>{this.otherPlayers.get(k)?.destroy();this.otherPlayers.delete(k)})
            .subscribe(async s=>{if(s==='SUBSCRIBED') await ch.track({pid:this.pid,x:Math.round(this.hero.x),y:Math.round(this.hero.y)})})
            this.time.addEvent({delay:500,loop:true,callback:()=>ch.track({pid:this.pid,x:Math.round(this.hero.x),y:Math.round(this.hero.y)})})
          }catch{/* solo */}
        }

        update(this:WorldScene,_t:number,dt:number){
          if(this.collecting) return
          if(this.atkCd>0) this.atkCd-=dt
          const {left,right,up,down}=this.cursors
          const running=this.kShift.isDown, SPD=running?230:150
          let vx=0,vy=0
          if(this.kA.isDown||left.isDown)  vx=-SPD
          if(this.kD.isDown||right.isDown) vx= SPD
          if(this.kW.isDown||up.isDown)    vy=-SPD
          if(this.kS.isDown||down.isDown)  vy= SPD
          if(vx&&vy){vx*=0.707;vy*=0.707}

          if(vx||vy){
            const nx=P.Math.Clamp(this.hero.x+vx*dt/1000,TILE,WW-TILE)
            const ny=P.Math.Clamp(this.hero.y+vy*dt/1000,TILE,WH-TILE)
            // Water collision
            const waterBlocked=MAP[Math.floor(ny/TILE)]?.[Math.floor(nx/TILE)]===3
            // Object collision
            const objBlocked=this.wouldCollide(nx,ny)

            if(!waterBlocked&&!objBlocked){this.hero.x=nx;this.hero.y=ny}
            else if(!waterBlocked&&!this.wouldCollide(this.hero.x,ny)){this.hero.y=ny} // slide Y
            else if(!waterBlocked&&!this.wouldCollide(nx,this.hero.y)){this.hero.x=nx} // slide X

            const pre=running?'h_run_':'h_walk_'
            if(Math.abs(vy)>Math.abs(vx)){
              if(vy<0&&this.facing!=='up')   {this.facing='up';   this.hero.play(pre+'u',true);this.hero.setFlipX(false)}
              if(vy>0&&this.facing!=='down')  {this.facing='down'; this.hero.play(pre+'d',true);this.hero.setFlipX(false)}
            }else{
              if(vx<0&&this.facing!=='left')  {this.facing='left'; this.hero.play(pre+'s',true);this.hero.setFlipX(true)}
              if(vx>0&&this.facing!=='right') {this.facing='right';this.hero.play(pre+'s',true);this.hero.setFlipX(false)}
            }
          } else {
            const ck=this.hero.anims.currentAnim?.key??''
            if(!ck.includes('idle')&&!ck.includes('col')&&!ck.includes('crush')&&!ck.includes('slice'))
              this.hero.play(this.idleAnim(),true)
          }

          const hx=this.hero.x,hy=this.hero.y
          this.hero.setDepth(hy)
          this.shadow.setPosition(hx,hy+22).setDepth(hy-1)
          this.nameTag.setPosition(hx,hy-38).setDepth(hy+5)
          this.heroHpBg.setPosition(hx,hy-28).setDepth(hy+3)
          this.heroHpFill.setPosition(hx-19,hy-28).setDepth(hy+4)

          this.mobs.forEach(m=>{
            if(!m.alive) return
            const dx=hx-m.spr.x,dy=hy-m.spr.y,dist=Math.sqrt(dx*dx+dy*dy)
            if(dist<300){
              const nx2=m.spr.x+(dx/dist)*m.spd*dt/1000,ny2=m.spr.y+(dy/dist)*m.spd*dt/1000
              if(MAP[Math.floor(ny2/TILE)]?.[Math.floor(nx2/TILE)]!==3) m.spr.setPosition(nx2,ny2)
              m.spr.setFlipX(dx<0).setDepth(m.spr.y)
              m.hpBg.setPosition(m.spr.x,m.spr.y-28).setDepth(m.spr.y+1)
              m.hpBar.setPosition(m.spr.x-15,m.spr.y-28).setDepth(m.spr.y+2)
              if(dist<28){this.hp=Math.max(0,this.hp-0.04*dt/16);this.heroHpFill.width=Math.max(0,(this.hp/100)*38)}
            }
            if(P.Input.Keyboard.JustDown(this.kE)&&dist<80&&this.atkCd<=0){
              this.atkCd=350; this.hero.play(this.atkAnim('slice'),true)
              this.hero.once('animationcomplete',()=>this.hero.play(this.idleAnim(),true))
              m.hp-=10; this.pop(m.spr.x,m.spr.y,'-10','#ff4444')
              m.hpBar.width=Math.max(0,(m.hp/m.maxHp)*30)
              if(m.hp<=0){
                m.alive=false; m.hpBg.destroy(); m.hpBar.destroy()
                this.tweens.add({targets:m.spr,alpha:0,duration:500,onComplete:()=>m.spr.destroy()})
                this.addInv(m.drop); this.farm+=5; this.farmTxt.setText('$FARM: '+this.farm)
                this.pop(m.spr.x,m.spr.y-8,'+'+m.drop+'  +5$FARM','#f0c040')
              }
            }
          })

          let found:RNode|null=null; let minD=Infinity
          this.nodes.forEach((n:RNode)=>{
            if(n.depleted) return
            const dx=n.spr.x-hx,dy=n.spr.y-hy,d=Math.sqrt(dx*dx+dy*dy)
            if(d<90&&d<minD){minD=d;found=n}
          })
          this.nearNode=found
          const near=this.nearNode as RNode|null
          if(near!==null){
            this.prompt.setText('[E] '+(near.isTree?'Chop':'Harvest')+' '+near.res).setPosition(hx,hy-56).setVisible(true)
            if(P.Input.Keyboard.JustDown(this.kE)&&this.atkCd<=0) this.doCollect()
          } else this.prompt.setVisible(false)

          if(Math.floor(_t/200)%1===0) this.drawMinimap()
        }
      }

      gameRef.current=new P.Game({
        type:P.CANVAS,width:VW,height:VH,backgroundColor:'#0a0a12',pixelArt:true,antialias:false,
        parent:divRef.current!,scene:[PreloadScene,WorldScene],scale:{mode:P.Scale.NONE},
      }) as {destroy:(b:boolean)=>void}
    }
    init()
    return ()=>{gameRef.current?.destroy(true);gameRef.current=null}
  },[])

  return(
    <div className={styles.canvasWrapper}>
      <div className={styles.canvasHeader}>
        <div className={styles.canvasTitle}>⚔ THE REALM — VERDANT FIELDS</div>
        <div className={styles.canvasMeta}>Season I · Alpha · 🟢 Online</div>
      </div>
      <div ref={divRef} className={styles.canvas}/>
    </div>
  )
}
