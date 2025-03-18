import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function CTASection() {
  return (
    <motion.section 
      className="container py-24 sm:py-32"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mx-auto max-w-5xl">
      <div className="absolute left-0 top-0 transform w-44 h-44 bg-blue-700 rounded-full blur-[100px] opacity-50"></div>
        <div className="bg-gradient-to-t from-background to-background/60 border rounded-3xl px-8 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Ready to Build Your Dream Team?
          </h2>
          <p className="max-w-[42rem] mx-auto leading-normal text-muted-foreground sm:text-xl sm:leading-8 mb-8">
            Join thousands of others who are already building amazing teams on TeamConnect.
          </p>
          <Button size="lg" className="gap-2">
            Get Started Now <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.section>
  )
}
