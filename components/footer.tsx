import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About SkillExchange</h3>
            <p className="text-sm">Trade services, learn new skills, and grow your network with our innovative platform.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/marketplace">Marketplace</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/wallet">Wallet</Link></li>
              <li><Link href="/challenges">Challenges</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              {['Events', 'Blog', 'FAQ', 'Support'].map((item) => (
                <li key={item}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-not-allowed text-gray-400">{item}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Soon to drop.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              {['Twitter', 'Facebook', 'LinkedIn', 'Instagram'].map((item) => (
                <li key={item}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-not-allowed text-gray-400">{item}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>For now this is the only way to reach us</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>&copy; 2024 SkillExchange. Alvin Yeboah. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

