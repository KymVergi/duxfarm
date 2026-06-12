'use client'

import { useEffect, useRef } from 'react'
import styles from '../styles/Home.module.css'

// Uses the REAL idle_down spritesheet from the Pixel Crawler pack
// Sheet: 256x64px → 4 frames of 64x64
// Renders at 2x scale = 128x128 display, centered in the hero scene

const FRAME_COUNT  = 4
const FRAME_W      = 64
const FRAME_H      = 64
const DISPLAY_SCALE = 2.5
const FRAME_DELAY  = 180  // ms per frame

export default function HeroSprite() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef    = useRef<HTMLImageElement | null>(null)
  const frameRef  = useRef(0)
  const lastRef   = useRef(0)
  const rafRef    = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = Math.round(FRAME_W * DISPLAY_SCALE)
    const H = Math.round(FRAME_H * DISPLAY_SCALE)
    canvas.width  = W
    canvas.height = H

    const img = new Image()
    img.src = '/assets/characters/body_a/idle_down.png'
    imgRef.current = img

    function draw(now: number) {
      if (!ctx || !imgRef.current?.complete) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }
      if (now - lastRef.current > FRAME_DELAY) {
        lastRef.current = now
        frameRef.current = (frameRef.current + 1) % FRAME_COUNT
      }
      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(
        imgRef.current,
        frameRef.current * FRAME_W, 0,   // src x, y
        FRAME_W, FRAME_H,                 // src w, h
        0, 0,                             // dst x, y
        W, H                              // dst w, h
      )
      rafRef.current = requestAnimationFrame(draw)
    }

    img.onload = () => { rafRef.current = requestAnimationFrame(draw) }
    // also start loop before load (will wait inside)
    rafRef.current = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={styles.spriteCanvas}
      aria-label="Dux Farm hero character"
    />
  )
}
