import Link from 'next/link'

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
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/support">Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://twitter.com/skillexchange" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://facebook.com/skillexchange" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://linkedin.com/company/skillexchange" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://instagram.com/skillexchange" target="_blank" rel="noopener noreferrer">Instagram</a></li>
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
