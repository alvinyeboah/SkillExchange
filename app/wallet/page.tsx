"use client"

import { useEffect, useState } from 'react'
import { useWallet } from '@/hooks/use-wallet'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, CreditCard, Gift, Users } from 'lucide-react'
import coin from "@/public/coin.png";
import Image from 'next/image'
import { motion } from 'framer-motion'


export default function Wallet() {
  const { user } = useAuth()
  const { balance, users, isLoading, error, fetchWallet, fetchUsers, handleDonation } = useWallet()
  const [donationRecipient, setDonationRecipient] = useState('')
  const [donationAmount, setDonationAmount] = useState('')

  useEffect(() => {
    if (user?.id) {
      fetchWallet(user.id)
      fetchUsers()
    }
  }, [user?.id])

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !donationRecipient || !donationAmount) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      await handleDonation(
        user.id,
        parseInt(donationAmount),
        donationRecipient === 'community-fund' ? null : parseInt(donationRecipient)
      )
      toast.success('Donation successful!')
      setDonationAmount('')
      setDonationRecipient('')
    } catch (error: any) {
      toast.error(error.message || 'Failed to process donation')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your SkillCoin Wallet</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">Balance</CardTitle>
            <CardDescription>Your current SkillCoin balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <div className="flex items-center justify-center text-5xl font-bold text-white">
                {isLoading ? <Loader2 className="animate-spin" /> : (
                  <>
                    <motion.div 
                      whileHover={{ scale: 1.1 }} 
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Image width={65} height={65} src={coin.src} alt="SkillCoin Logo" className="items-center text-center inline" />
                    </motion.div>
                    {balance} 

                  </>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline">Add Funds</Button>
            <Button variant="outline">Withdraw</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="ghost">
                <CreditCard className="mr-2 h-4 w-4" /> View Transactions
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <Gift className="mr-2 h-4 w-4" /> Redeem SkillCoins
              </Button>
              <Button className="w-full justify-start" variant="ghost">
                <Users className="mr-2 h-4 w-4" /> Invite Friends
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-2xl">Make a Donation</CardTitle>
            <CardDescription>Support the community or other users</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">User</TabsTrigger>

                <TabsTrigger disabled value="community">Community</TabsTrigger>
              </TabsList>
              <TabsContent value="community">
                <form onSubmit={handleDonationSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="community-recipient">Recipient</Label>
                    <Select onValueChange={setDonationRecipient} value={donationRecipient}>
                      <SelectTrigger id="community-recipient">
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="community-fund">Community Fund</SelectItem>
                        <SelectItem value="skill-development">Skill Development Program</SelectItem>
                        <SelectItem value="new-user-boost">New User Boost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="community-amount">Amount</Label>
                    <Input
                      id="community-amount"
                      type="number"
                      min="1"
                      placeholder="Enter amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={!donationRecipient || !donationAmount || isLoading}
                    className="w-full"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isLoading ? 'Processing...' : 'Make Donation'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="user">
                <form onSubmit={handleDonationSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-recipient">Select User</Label>
                    <Select onValueChange={setDonationRecipient} value={donationRecipient}>
                      <SelectTrigger id="user-recipient">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users
                          .filter(u => u.user_id !== user?.id)
                          .map(u => (
                            <SelectItem key={u.user_id} value={u.user_id.toString()}>
                              {u.username}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-amount">Amount</Label>
                    <Input
                      id="user-amount"
                      type="number"
                      min="1"
                      placeholder="Enter amount"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={!donationRecipient || !donationAmount || isLoading}
                    className="w-full"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isLoading ? 'Processing...' : 'Send SkillCoins'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

