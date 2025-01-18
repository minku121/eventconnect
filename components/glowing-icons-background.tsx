"use client"

import { motion } from "framer-motion"
import { Rss, Heart, Globe, BarChart, FileText, Shield } from 'lucide-react'
import { useEffect, useState } from "react"

const icons = [
  { icon: Rss, color: "rose" },
  { icon: Heart, color: "pink" },
  { icon: Globe, color: "blue" },
  { icon: BarChart, color: "gray" },
  { icon: FileText, color: "green" },
  { icon: Shield, color: "amber" },
]

const createIconGrid = (rows: number, cols: number) => {
  const grid = []
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const iconIndex = (i + j) % icons.length
      grid.push({
        ...icons[iconIndex],
        id: `${i}-${j}`,
        x: j,
        y: i,
      })
    }
  }
  return grid
}

export function GlowingIconsBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const iconGrid = createIconGrid(4, 7)

  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <div className="relative h-full w-full overflow-hidden">
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, -100, 0] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 grid grid-cols-7 gap-8 p-8"
        >
          {iconGrid.map(({ icon: Icon, color, id, x, y }) => (
            <motion.div
              key={id}
              className={`relative aspect-square rounded-2xl bg-gray-900/50 p-4 backdrop-blur-sm
                ${x % 2 === 0 ? 'translate-y-8' : ''}
              `}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: (x + y) * 0.1,
              }}
            >
              <div className={`absolute inset-0 -z-10 blur-2xl bg-${color}-500/20`} />
              <Icon 
                className={`h-full w-full text-${color}-500`}
                strokeWidth={1.5}
              />
            </motion.div>
          ))}
        </motion.div>
        {/* Duplicate grid for seamless scrolling */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: [100, 0, 100] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 grid grid-cols-7 gap-8 p-8"
        >
          {iconGrid.map(({ icon: Icon, color, id, x, y }) => (
            <motion.div
              key={`duplicate-${id}`}
              className={`relative aspect-square rounded-2xl bg-gray-900/50 p-4 backdrop-blur-sm
                ${x % 2 === 0 ? 'translate-y-8' : ''}
              `}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: (x + y) * 0.1,
              }}
            >
              <div className={`absolute inset-0 -z-10 blur-2xl bg-${color}-500/20`} />
              <Icon 
                className={`h-full w-full text-${color}-500`}
                strokeWidth={1.5}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

