"use client"

import { motion } from "framer-motion"

interface FloatingSymbolsProps {
  density?: number
  opacity?: number
}

export const FloatingSymbols = ({ density = 6, opacity = 0.05 }: FloatingSymbolsProps) => {
  const symbols = Array.from({ length: density }, (_, index) => ({
    symbol: ["∑", "∫", "π"][index % 3],
    size: ["text-3xl", "text-4xl", "text-5xl", "text-6xl", "text-7xl"][Math.floor(Math.random() * 5)],
    color: ["text-[#cdaa72]", "text-[#f6f094]"][Math.floor(Math.random() * 2)],
    delay: Math.random() * 6,
    left: Math.random() * 100,
    top: Math.random() * 100,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {symbols.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.size} ${item.color} font-serif select-none`}
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            rotate: [0, Math.random() * 10 - 5, 0],
            opacity: [opacity, opacity * 2, opacity],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Number.POSITIVE_INFINITY,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          {item.symbol}
        </motion.div>
      ))}
    </div>
  )
}
