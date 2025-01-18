"use client"
import { motion } from 'framer-motion'
import features from './feature'
import React from 'react'
import { BentoGrid, BentoCard } from './ui/bento-grid'
import { TextAnimate } from './ui/text-animate'

export default function FeatureCard() {
  return (
    <div>
         <div className="mt-12 text-center items-center">
        <TextAnimate animation="slideLeft" by="character" startOnView={true} className="text-5xl font-bold">
          Explore Features
        </TextAnimate>
      </div>

      {/* MagicUI Cards Section */}
      <motion.div
        className="mt-12"
        initial={{ y:-20, opacity: 0, scale: 0.8 }}
       whileInView={{ y:0,  opacity: 1, scale: 1 } }
      

        transition={{ duration: 0.5 }}
      >
        <BentoGrid className="lg:grid-rows-3 max-w-[95%] mx-auto">
          {features.map((feature: any) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </motion.div>
     
    </div>
  )
}
