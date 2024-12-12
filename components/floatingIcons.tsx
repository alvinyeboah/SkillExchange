import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Users, Trophy, TrendingUp } from 'lucide-react'

export const FloatingIcons: React.FC = () => {
  const icons = [
    { Icon: Zap, top: '10%', left: '10%', delay: 0 },
    { Icon: Users, top: '10%', right: '10%', delay: 0.2 },
    { Icon: Trophy, bottom: '10%', left: '10%', delay: 0.4 },
    { Icon: TrendingUp, bottom: '10%', right: '10%', delay: 0.6 },
  ]

  return (
    <div className="relative w-64 h-64">
      {icons.map(({ Icon, top, left, right, bottom, delay }, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 2,
          }}
          style={{ top, left, right, bottom }}
        >
          <Icon className="w-12 h-12 text-primary" />
        </motion.div>
      ))}
    </div>
  )
}

