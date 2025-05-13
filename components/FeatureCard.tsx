"use client"
import { motion } from 'framer-motion'
import features from './feature'
import React from 'react'
import { BentoGrid, BentoCard } from './ui/bento-grid'
import { TextAnimate } from './ui/text-animate'

export default function FeatureCard() {
  return (
    <div className="w-full">
      <motion.div 
        className="mt-12 text-center items-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
      >
        <TextAnimate 
          animation="slideLeft" 
          by="character" 
          startOnView={true} 
          className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500"
        >
          Powerful Features
        </TextAnimate>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Everything you need to collaborate, learn, and grow as a developer
        </motion.p>
      </motion.div>

      {/* Feature Cards Grid */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.3
        }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <BentoGrid className="lg:grid-rows-3 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {features.map((feature: any, index: number) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
              viewport={{ once: true }}
            >
              <BentoCard {...feature} />
            </motion.div>
          ))}
        </BentoGrid>
      </motion.div>
    </div>
  )
}
