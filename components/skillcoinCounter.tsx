import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface SkillCoinCounterProps {
  amount: number
  duration?: number
}

export const SkillCoinCounter: React.FC<SkillCoinCounterProps> = ({ amount, duration = 1 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = amount
    const incrementTime = (duration / end) * 1000

    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start === end) clearInterval(timer)
    }, incrementTime)

    return () => clearInterval(timer)
  }, [amount, duration])

  return (
    <motion.span
      className="text-2xl font-bold text-primary"
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.5 }}
    >
      {count} <span className="text-sm font-normal">SkillCoins</span>
    </motion.span>
  )
}

