"use client"

import { useTheme } from "next-themes"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Zap, Sun, Moon, Menu } from 'lucide-react'
import { useAuth } from "@/hooks/use-auth"
import { UserNav } from "./user-nav"
import { NotificationsDropdown } from "./notifications-dropdown"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export function ThemeToggle() {
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">SkillExchange</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/marketplace" className="text-foreground/60 hover:text-foreground transition-colors">Marketplace</Link>
          <Link href="/challenges" className="text-foreground/60 hover:text-foreground transition-colors">Challenges</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {user && <NotificationsDropdown />}
          {user ? (
            <UserNav user={user} />
          ) : (
            <Link href="/auth/signin">
              <Button variant="default">Sign In</Button>
            </Link>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[200px] sm:w-[300px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <Link href="/marketplace" className="text-foreground/60 hover:text-foreground transition-colors">Marketplace</Link>
                <Link href="/challenges" className="text-foreground/60 hover:text-foreground transition-colors">Challenges</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

