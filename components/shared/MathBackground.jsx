'use client'

import { useEffect, useRef } from 'react'

export default function MathBackground({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      ctx.strokeStyle = 'var(--color-primary)'
      ctx.lineWidth = 0.8

      // Three sine waves at different frequencies
      for (let wave = 0; wave < 3; wave++) {
        ctx.beginPath()
        const amplitude = 15 + wave * 10
        const frequency = 0.003 + wave * 0.001
        const speed = 0.0003 + wave * 0.0001
        const yOffset = h * (0.3 + wave * 0.2)

        for (let x = 0; x <= w; x += 2) {
          const y = yOffset + Math.sin(x * frequency + time * speed * 60) * amplitude
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.globalAlpha = 0.06 + wave * 0.02
        ctx.stroke()
      }

      time++
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  )
}
