import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Rocket, MessageSquare, Target, Shield, Zap } from 'lucide-react'
import { motion } from "framer-motion"

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
}

export function FeaturesSection() {
  const features = [
    { icon: Users, title: "Team Creation", description: "Create your dream team in minutes. Set roles, requirements, and goals.", color: "text-blue-500" },
    { icon: Rocket, title: "Smart Matching", description: "AI-powered team matching based on skills, experience, and compatibility.", color: "text-purple-500" },
    { icon: MessageSquare, title: "Real-time Chat", description: "Built-in messaging system for seamless team communication.", color: "text-green-500" },
    { icon: Target, title: "Goal Tracking", description: "Set and track team goals, milestones, and progress in real-time.", color: "text-red-500" },
    { icon: Shield, title: "Privacy Control", description: "Advanced privacy settings and member management controls.", color: "text-yellow-500" },
    { icon: Zap, title: "Quick Join", description: "Join teams instantly with our streamlined application process.", color: "text-orange-500" },
  ]

  return (
    <section id="features" className="container py-24 sm:py-32 max-w-[95%] mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 , scale: 0.9 , x:-50}}
        whileInView={{ opacity: 1, y: 0 , scale: 1 , x:0}}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Powerful Features for Seamless Collaboration
        </h2>
        <p className="mt-4 text-muted-foreground">
          Discover the tools that make TeamConnect the ultimate platform for team building and management.
        </p>
      </motion.div>
      <motion.div initial={{opacity:0,y:-20}} whileInView={{opacity:1,y:0}} transition={{duration:0.3}} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={featureVariants}
            initial={{ opacity: 0, y: 20 }}
            //@ts-ignore
            whileInView={(i) => featureVariants.visible(i)}
            custom={index}
            
          >
            <Card className="bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <feature.icon className={`h-10 w-10 mb-4 ${feature.color}`} />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

