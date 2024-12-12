import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Users, Trophy, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Zap,
    title: "Earn SkillCoins",
    description: "Complete tasks and earn our platform's unique currency.",
  },
  {
    icon: Users,
    title: "Join Community",
    description: "Connect with skilled individuals and expand your network.",
  },
  {
    icon: Trophy,
    title: "Win Challenges",
    description: "Showcase your skills and compete in exciting challenges.",
  },
  {
    icon: TrendingUp,
    title: "Grow Skills",
    description: "Learn from others and improve your abilities continuously.",
  },
]

export const FeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <feature.icon className="w-6 h-6 mr-2" />
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
