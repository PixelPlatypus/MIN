"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface MinFloatingElementsProps {
  count?: number
}

export const MinFloatingElements = ({ count = 12 }: MinFloatingElementsProps) => {
  const [elements, setElements] = useState<any[]>([])

  useEffect(() => {
    const mathSymbols = ["π", "∫", "∑"]
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]

    const newElements = Array.from({ length: count }, (_, index) => {
      const isMathSymbol = index < count - 3
      const isNumber = index >= count - 3

      return {
        id: index,
        type: isMathSymbol ? "math" : "number",
        symbol: isMathSymbol ? mathSymbols[index % mathSymbols.length] : numbers[index % numbers.length],
        size: Math.random() * 60 + 40,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 8,
        duration: Math.random() * 20 + 25,
        opacity: Math.random() * 0.3 + 0.1,
      }
    })
    setElements(newElements)
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.left}%`,
            top: `${element.top}%`,
          }}
          animate={{
            y: [0, -200, 0],
            x: [0, Math.random() * 100 - 50, 0],
            rotate: [0, 360],
            opacity: [element.opacity, element.opacity * 1.8, element.opacity],
          }}
          transition={{
            duration: element.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: element.delay,
            ease: "easeInOut",
          }}
        >
          <div
              className="text-min-accent/20 font-serif font-bold select-none"
              style={{ fontSize: `${element.size}px` }}
            >
            {element.symbol}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
