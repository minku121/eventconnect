import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GridPatternDashed } from "@/components/ui/gridpatterndashed"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { motion } from "framer-motion"
import Image from "next/image"
import { BorderBeam } from "@/components/ui/border-beam"
import { TextAnimate } from "@/components/ui/text-animate"

const Hero = () => {
  return (
    <main className="flex flex-col items-center justify-center px-6 py-24 text-center relative">
      {/* Add GridPatternDashed in the Hero Section */}
      <GridPatternDashed
        width={40}
        height={40}
        className="absolute inset-0 h-screen opacity-50 transition-opacity duration-700 ease-in-out"
        style={{ animation: 'fadeInUp 1s forwards' }}
      />
      <div>
        <div className="flex justify-center">
         
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 px-4 py-1 text-sm text-muted-foreground border border-blue-600 rounded-full"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-100"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Now with AI-powered team matching
            </motion.div>
         
        </div>

        <motion.h1 initial={{opacity:0,y:-20}} whileInView={{opacity:1,y:0}} transition={{duration:0.5}} className="mt-6 max-w-4xl text-4xl font-medium tracking-tight sm:text-5xl md:text-7xl">
          Join events, teams, and
          <br />
          challenges seamlessly.
        </motion.h1>

        <motion.p initial={{opacity:0,y:-20}} whileInView={{opacity:1,y:0}} transition={{duration:0.7}} className="mt-6 max-w-2xl text-base sm:text-lg text-gray-400">
          TeamConnect is your gateway to a world of collaborative opportunities.
          Discover events, join teams, and participate in exciting online challenges.
        </motion.p>

        <motion.div initial={{y:-20,opacity:0}} whileInView={{y:0,opacity:1}} transition={{duration:0.85}}>
        <Button className="mt-8" size="lg" asChild>
          <Link href="/auth/signin">Get Started For Free  → </Link>
        </Button>
        </motion.div>
      </div>

      {/* Image Container */}
      <motion.div  initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative rounded-lg border border-gray-800 bg-gray-900/50  backdrop-blur-sm  mt-10">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8880ff] to-[#3916e8] opacity-50 blur-[150px] rounded-lg"></div>
        <Image
          src="https://res.cloudinary.com/dgjcyqrih/image/upload/v1737002095/Rectangle_2_zk9i2m.svg"
          width={1200}
          height={600}
          alt="TeamConnect Interface Preview"
          className="relative rounded-lg"
          priority
        />
        <BorderBeam size={220} duration={12} delay={3} anchor={120} colorFrom={"#3916e8"} colorTo={"#8880ff"} />
      </motion.div>
    </main>
  )
}

export default Hero;
