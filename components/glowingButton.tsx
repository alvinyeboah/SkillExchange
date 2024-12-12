import React from 'react'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const GlowingButton: React.FC<ButtonProps> = ({ className, ...props }) => {
  return (
    <Button
      className={cn(
        "relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:scale-105",
        "before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-0 before:h-0 before:bg-white before:rounded-full before:opacity-0 before:transition-all before:duration-500 before:ease-out",
        "hover:before:w-[300px] hover:before:h-[300px] hover:before:opacity-20",
        className
      )}
      {...props}
    />
  )
}

