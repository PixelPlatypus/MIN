'use client'

import { useEffect, useRef } from 'react'

// Distance from point p to line segment v-w
function distToSegment(p, v, w) {
  const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y)
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2
  t = Math.max(0, Math.min(1, t))
  return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)))
}

export default function VoronoiCanvas({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let time = 0

    const points = []
    const numPoints = 25

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

      points.length = 0
      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          baseX: Math.random() * canvas.offsetWidth,
          baseY: Math.random() * canvas.offsetHeight,
        })
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      // Move points gently
      points.forEach((p) => {
        p.x = p.baseX + Math.sin(time * 0.001 + p.baseX) * 30
        p.y = p.baseY + Math.cos(time * 0.0015 + p.baseY) * 20
      })

      // Draw Delaunay-ish edges (connect nearby points)
      ctx.strokeStyle = 'var(--color-primary)'
      ctx.lineWidth = 0.5

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y)
          if (d < 200) {
            ctx.globalAlpha = (1 - d / 200) * 0.08
            ctx.beginPath()
            ctx.moveTo(points[i].x, points[i].y)
            ctx.lineTo(points[j].x, points[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw points as tiny dots
      ctx.globalAlpha = 0.15
      ctx.fillStyle = 'var(--color-primary)'
      points.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw distance field contours (Voronoi-ish)
      const step = 20
      ctx.globalAlpha = 0.04
      ctx.strokeStyle = 'var(--color-primary)'
      ctx.lineWidth = 0.5

      for (let x = 0; x < w; x += step) {
        for (let y = 0; y < h; y += step) {
          // Find nearest point
          let minDist = Infinity
          for (const p of points) {
            const d = Math.hypot(x - p.x, y - p.y)
            if (d < minDist) minDist = d
          }
          // Draw small circle if near edge (contour)
          if (minDist > 60 && minDist < 80) {
            ctx.beginPath()
            ctx.arc(x, y, 0.8, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      ctx.globalAlpha = 1
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
