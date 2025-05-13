"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Navbar } from "@/components/Navbar"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { BorderBeam } from "@/components/ui/border-beam"
import { MarqueeDemo } from "@/components/marqee-component"
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid"
import features from "@/components/feature"
import { TextAnimate } from "@/components/ui/text-animate"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { GridPatternDashed } from "@/components/ui/gridpatterndashed"
import Hero from "@/components/Hero"
import FeatureCard from "@/components/FeatureCard"
import { TeamsSection } from "@/components/TeamSection"
import { FeaturesSection } from "@/components/FeaturesSection"
import { CTASection } from "@/components/CtaSection"
import Footer from "@/components/Footer"

export default function Home() {
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white relative overflow-hidden">
      <Navbar />
      
      {/* Animated Background Elements */}
      <motion.div 
        className="fixed inset-0 -z-10"
        style={{ y: backgroundY }}
      >
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </motion.div>
      
      <main className="flex flex-col items-center w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section with Parallax Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.22, 1, 0.36, 1],
            delay: 0.2
          }}
          className="w-full"
        >
          <Hero />
        </motion.div>

        {/* Feature Card with Staggered Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1]
          }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mt-16"
        >
          <FeatureCard />
        </motion.div>

        {/* Features Section with Scroll Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ 
            duration: 1,
            ease: [0.22, 1, 0.36, 1]
          }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mt-24"
        >
          <FeaturesSection />
        </motion.div>

        {/* Teams Section with Scale Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mt-24"
        >
          <TeamsSection />
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mt-24"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <TextAnimate
                animation="slideLeft"
                by="character"
                startOnView={true}
                className="text-4xl font-bold text-center underline-offset-2"
              >
                What People Are Saying
              </TextAnimate>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-4 text-muted-foreground text-lg"
            >
              Join these active teams or create your own to start collaborating.
            </motion.p>
          </div>
        </motion.div>

        {/* Marquee with Fade Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ 
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mt-12"
        >
          <MarqueeDemo />
        </motion.div>

        {/* CTA Section with Slide Up Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1]
          }}
          viewport={{ once: true, margin: "-100px" }}
          className="w-full mt-24"
        >
          <CTASection />
        </motion.div>
      </main>

      {/* Footer with Fade In */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ 
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }}
        viewport={{ once: true, margin: "-100px" }}
        className="w-full mt-24"
      >
        <Footer />
      </motion.div>
    </div>
  )
}
