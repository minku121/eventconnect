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
import { motion } from "framer-motion"
import { GridPatternDashed } from "@/components/ui/gridpatterndashed"
import Hero from "@/components/Hero"
import FeatureCard from "@/components/FeatureCard"
import { TeamsSection } from "@/components/TeamSection"
import { FeaturesSection } from "@/components/FeaturesSection"
import { CTASection } from "@/components/CtaSection"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white relative overflow-hidden grid grid-rows-[auto_1fr_auto]">
      <Navbar />
      
      {/* Glowing Blue Circle */}
      
      
      {/* Hero Section */}
      <Hero />
     

     <FeatureCard/>

     <div className="relative top-[100px] left-[5px] flex ">
        <div className="w-40 h-40 rounded-full bg-blue-700 blur-[120px] opacity-100 animate-pulse-fast z-10"></div>
      </div>
    <FeaturesSection/>
     
  
    <TeamsSection/>

     <div className="mt-8"></div>

      <TextAnimate
        animation="slideLeft"
        by="character"
        startOnView={true}
        className="text-4xl font-bold text-center underline-offset-2"
      >
       What Peoples are Saying
      </TextAnimate>
      <p className="max-w-[42rem]  leading-normal text-muted-foreground text-center sm:text-xl sm:leading-8 mx-auto mt-2">
          Join these active teams or create your own to start collaborating.
        </p>
   

      <MarqueeDemo />

      <div className="flex items-center justify-center w-full">
         <CTASection/>
      </div>

     <Footer/>
    </div>
  )
}
