"use client"

import { useTheme } from "next-themes"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Zap, Search, Sun, Moon, Menu } from 'lucide-react'
import { Input } from './ui/input'
import { useAuth } from "@/hooks/use-auth"
import { UserNav } from "./user-nav"
import { NotificationsDropdown } from "./notifications-dropdown"


function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-9 px-0"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default function Header() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 px-6 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Zap className="h-6 w-6" />
          <span className="font-bold text-xl">SkillExchange</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/wallet">Wallet</Link>
          <Link href="/challenges">Challenges</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <form className="hidden lg:block">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8 w-64" />
            </div>
          </form>
          <ThemeToggle />
          {user && <NotificationsDropdown />}
          {user ? (
            <UserNav user={user} />
          ) : (
            <Link href="/auth/signin">
              <Button variant="default">Sign In</Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  )
}

