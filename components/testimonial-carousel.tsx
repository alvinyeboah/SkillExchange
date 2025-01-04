import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from 'framer-motion'

interface Testimonial {
  id: number
  name: string
  avatar: string
  content: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "https://avatar.iran.liara.run/public/girl",
    content: "SkillExchange has been a game-changer for my career. I've learned so much from the community!"
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "https://avatar.iran.liara.run/public/boy",
    content: "The challenges on this platform push me to improve my skills every day. Highly recommended!"
  },
  {
    id: 3,
    name: "Carol Williams",
    avatar: "https://avatar.iran.liara.run/public/girl",
    content: "I love how easy it is to connect with other skilled professionals. SkillExchange is the future of networking!"
  }
]

export const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative h-64 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Card className="h-full">
            <CardContent className="flex flex-col justify-between h-full p-6">
              <p className="text-lg italic">{testimonials[currentIndex].content}</p>
              <div className="flex items-center mt-4">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarImage src={testimonials[currentIndex].avatar} alt={testimonials[currentIndex].name} />
                  <AvatarFallback>{testimonials[currentIndex].name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonials[currentIndex].name}</p>
                  <p className="text-sm text-muted-foreground">SkillExchange User</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

