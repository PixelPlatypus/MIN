"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export const MathCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [currentSymbol, setCurrentSymbol] = useState("π")

  const symbols = ["π", "∑", "∫"]

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => {
      setIsHovering(true)
      setCurrentSymbol(symbols[Math.floor(Math.random() * symbols.length)])
    }
    const handleMouseLeave = () => setIsHovering(false)

    window.addEventListener("mousemove", updateMousePosition)

    const hoverElements = document.querySelectorAll('[data-hover="true"]')
    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      hoverElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [])

  return (
    <>
      {/* Main cursor dot - MIN theme colors */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-[#cdaa72] rounded-full pointer-events-none z-[9999] shadow-lg shadow-[#cdaa72]/30"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovering ? 0.5 : 1,
        }}
        transition={{
          type: "tween",
          duration: 0.1,
          ease: "easeOut",
        }}
      />

      {/* Outer ring - follows slower for trail effect */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-[#16556d] rounded-full pointer-events-none z-[9998] opacity-60"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "tween",
          duration: 0.15,
          ease: "easeOut",
        }}
      />

      {/* Mathematical symbol on hover */}
      {isHovering && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] text-[#356a72] text-xl font-serif font-bold"
          animate={{
            x: mousePosition.x - 10,
            y: mousePosition.y - 25,
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            scale: { duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            x: { type: "tween", duration: 0.1, ease: "easeOut" },
            y: { type: "tween", duration: 0.1, ease: "easeOut" },
          }}
        >
          {currentSymbol}
        </motion.div>
      )}
    </>
  )
}
