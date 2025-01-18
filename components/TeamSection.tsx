import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function TeamsSection() {
  return (
    <section id="teams" className="container py-24 sm:py-32 max-w-[95%] items-center mx-auto">
      <div className="flex flex-col items-center justify-center gap-4 text-center mb-12">

        
      <div className="relative items-center self-start left-[90%]">
        <div className="w-32 h-32 rounded-full bg-cyan-500 blur-[120px] opacity-100 mt-[-220px] visible"></div>
      </div>
     
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Featured Teams
        </h2>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Join these active teams or create your own to start collaborating.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((team) => (
          <motion.div 
            key={team} 
            className="bg-background/50 backdrop-blur-sm" 
            initial={{ opacity: 0 , x:20 , y:-20}} 
            whileInView={{ opacity: 1 , x:0 , y:0 }} 
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Tech Innovators</CardTitle>
                <CardDescription>Building the next big thing in tech</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge>React</Badge>
                  <Badge>Node.js</Badge>
                  <Badge>AI/ML</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Looking for passionate developers and designers to join our innovative project.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>3/5 members</span>
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  Join Team <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

