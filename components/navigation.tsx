"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from "@/hooks/use-auth";
import { UserNav } from "./user-nav";
import { NotificationsDropdown } from "./notifications-dropdown";
import Image from "next/image";
import logo from "@/public/coin.png";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AnimatePresence, motion } from "framer-motion";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

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
  );
}

export default function Header() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  const menuItems = [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/challenges", label: "Challenges" },
    { href: "/stats", label: "Stats" },

  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center justify-center space-x-2">
          <div className="items-center justify-center mt-1">
            <Image src={logo} width={50} height={50} alt="Logo" />
          </div>
          <span className="font-bold text-xl flex items-center">
            SkillExchange
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
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
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
            </PopoverTrigger>
            <AnimatePresence>
              {isOpen && (
                <PopoverContent
                  align="end"
                  alignOffset={-8}
                  className="w-[200px] p-0"
                  forceMount
                >
                  <motion.nav
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col py-2"
                  >
                    {menuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.nav>
                </PopoverContent>
              )}
            </AnimatePresence>
          </Popover>
        </div>
      </div>
    </header>
  );
}

