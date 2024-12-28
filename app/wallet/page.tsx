"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CreditCard, Gift, Users } from "lucide-react";
import coin from "@/public/coin.png";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useTransactions } from "@/hooks/use-transactions";
import { AddFundsDialog } from "@/components/AddFundsDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Wallet() {
  const [donationRecipient, setDonationRecipient] = useState("");
  const [donationAmount, setDonationAmount] = useState("");

  const { user } = useAuth();
  const {
    balance,
    users,
    isLoading,
    error,
    fetchWallet,
    fetchUsers,
    donations,
    handleDonation,
    getUserDonations,
  } = useWallet();
  const { fetchUserTransactions, transactions } = useTransactions();

  useEffect(() => {
    if (user?.user_id) {
      fetchWallet(user.user_id);
      fetchUsers();
      fetchUserTransactions(user.user_id);
      getUserDonations(user.user_id);
    }
  }, [
    user?.user_id,
    fetchWallet,
    fetchUsers,
    fetchUserTransactions,
    getUserDonations,
  ]);

  console.log(user);

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.user_id || !donationRecipient || !donationAmount) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await handleDonation(
        user.user_id,
        parseInt(donationAmount),
        donationRecipient
      );
      console.log(result)

      if (result.success) {
        toast.success("Donation successful!");
        setDonationAmount("");
        setDonationRecipient("");
        await fetchWallet(user.user_id);
        await fetchUserTransactions(user.user_id);
        await getUserDonations(user.user_id);
      } else {
        toast.error(result.message || "Failed to process donation");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process donation");
    }
  };



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
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        width={65}
                        height={65}
                        src={coin.src}
                        alt="SkillCoin Logo"
                        className="items-center text-center inline"
                      />
                    </motion.div>
                    {balance}
                  </>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <AddFundsDialog />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button disabled variant="outline">
                    Withdraw
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Curently Unavalable</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-5">
              <Link href="#transactions" className="w-full">
                <Button className="w-full justify-start" variant="ghost">
                  <CreditCard className="mr-4 h-4 w-4" /> View Transactions
                </Button>
              </Link>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      disabled
                      className="w-full justify-start"
                      variant="ghost"
                    >
                      <Gift className="mr-2 h-4 w-4" /> Redeem SkillCoins
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Coming Soon</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      disabled
                      className="w-full justify-start"
                      variant="ghost"
                    >
                      <Users className="mr-2 h-4 w-4" /> Invite Friends
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Coming Soon</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-2xl">Make a Donation</CardTitle>
            <CardDescription>
              Support the community or other users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger disabled value="community">
                  Community
                </TabsTrigger>
              </TabsList>
              <TabsContent value="community">
                <form onSubmit={handleDonationSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="community-recipient">Recipient</Label>
                    <Select
                      onValueChange={setDonationRecipient}
                      value={donationRecipient}
                    >
                      <SelectTrigger id="community-recipient">
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="community-fund">
                          Community Fund
                        </SelectItem>
                        <SelectItem value="skill-development">
                          Skill Development Program
                        </SelectItem>
                        <SelectItem value="new-user-boost">
                          New User Boost
                        </SelectItem>
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
                    disabled={
                      !donationRecipient || !donationAmount || isLoading
                    }
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isLoading ? "Processing..." : "Make Donation"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="user">
                <form onSubmit={handleDonationSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-recipient">Select User</Label>
                    <Select
                      onValueChange={setDonationRecipient}
                      value={donationRecipient}
                    >
                      <SelectTrigger id="user-recipient">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users
                          .filter((u: any) => u.user_id !== user?.user_id)
                          .map((u: any) => (
                            <SelectItem
                              key={u.user_id}
                              value={u.user_id.toString()}
                            >
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
                    disabled={
                      !donationRecipient || !donationAmount || isLoading
                    }
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isLoading ? "Processing..." : "Send SkillCoins"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* New Card for Recent Transactions */}
        <Card id="transactions" className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-2xl">Recent Transactions</CardTitle>
            <CardDescription>Your latest SkillCoin activities</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(
                          transaction.transaction_date
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>
                        {transaction.skillcoins_transferred}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4">
                <p>No recent transactions to display.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* New Card for Recent Donations */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-2xl">Recent Donations</CardTitle>
            <CardDescription>
              Your contributions to the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            {donations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((donation, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(donation.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{donation.username}</TableCell>
                      <TableCell>{donation.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4">
                <p>No recent donations to display.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
