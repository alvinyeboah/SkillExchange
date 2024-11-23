"use client"

import { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useReminders } from '@/hooks/use-reminders-store'
import { toast } from 'sonner'

export function ReminderCheck() {
  const { user } = useAuth()
  const { fetchReminders } = useReminders()

  useEffect(() => {
    if (user?.id) {
      fetchReminders(user.id)
      const interval = setInterval(() => {
        fetchReminders(user.id) 
      }, 60000) 

      return () => clearInterval(interval)
    }
  }, [user?.id, fetchReminders])

  return null
} 