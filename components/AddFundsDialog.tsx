"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight, Coins, CreditCard, Loader2 } from "lucide-react";
import Image from "next/image";
import coin from "@/public/coin.png";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useWallet } from "@/hooks/use-wallet";
import { useTransactions } from "@/hooks/use-transactions";

// Dynamically import PaystackButton with ssr disabled
const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  { ssr: false }
);

const fundOptions = [
  { amount: 1000, price: 10 },
  { amount: 5000, price: 45 },
  { amount: 10000, price: 85 },
  { amount: 20000, price: 160 },
];

export function AddFundsDialog() {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<null | {
    amount: number;
    price: number;
  }>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  console.log("🚀 ~ AddFundsDialog ~ user:", user);
  const { fetchWallet, creditWallet } = useWallet();
  const { fetchUserTransactions, transactions } = useTransactions();
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  const handlePaymentSuccess = async (response: {
    reference: string;
    trans: string;
    trxref: string;
    status: string;
    amount: number;
  }) => {
    try {
      if (!user?.user_id) {
        throw new Error("User ID is required");
      }

      const result = await creditWallet(
        user.user_id,
        response.amount,
        response.reference,
        response.trans
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(
        `Successfully added ${response.amount} SkillCoins to your wallet!`
      );
    } catch (error) {
      toast.error("Failed to credit your wallet. Please contact support.");
      console.error("Credit wallet error:", error);
    } finally {
      setIsProcessing(false);
      setOpen(false);
    }
  };

  const isPaymentConfigValid = () => {
    return !!(user?.email && publicKey);
  };

  const handlePaystackButtonProps = (option: {
    amount?: number;
    price?: number;
  }) => {
    if (!isPaymentConfigValid()) {
      toast.error("Unable to process payment at this time");
      return null;
    }

    return {
      email: user!.email,
      amount: option.price ? option.price * 100 : 0,
      metadata: {
        custom_fields: [
          {
            display_name: "SkillCoins Amount",
            variable_name: "skillcoins_amount",
            value: option.amount,
          },
        ],
        amount: option.amount,
      },
      publicKey: publicKey!,
      text: "Pay Now",
      onSuccess: (response: any) => {
        handlePaymentSuccess({
          ...response,
          amount: option.amount,
        });
      },
      onClose: () => {
        setIsProcessing(false);
        setSelectedOption(null);
      },
      onClick: () => {
        setOpen(false);
        setSelectedOption(option as { amount: number; price: number });
      },
      currency: "GHS",
    };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Coins className="mr-2 h-4 w-4" />
          Add Funds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Add SkillCoins to Your Wallet
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-1 ">
            {fundOptions.map((option, index) => (
              <motion.div
                key={option.amount}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Image
                          src={coin}
                          alt="SkillCoin"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-base font-semibold">
                          {option.amount} SkillCoins
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          ${option.price.toFixed(2)} USD
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 p-3">
                    {isPaymentConfigValid() ? (
                      <PaystackButton
                        {...(handlePaystackButtonProps(option) as any)}
                        className="w-full"
                      >
                        Purchase
                      </PaystackButton>
                    ) : (
                      <Button
                        onClick={() =>
                          toast.message(
                            !user?.email
                              ? "Please sign in to add funds"
                              : "Payment system not configured"
                          )
                        }
                        variant="outline"
                        className="w-full"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        {!user?.email
                          ? "Sign in to Pay"
                          : !publicKey
                          ? "Payment not configured"
                          : "Unable to process payment"}
                      </Button>
                    )}
                  </CardFooter>
                  <motion.div
                    className="absolute inset-0 bg-primary/5 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </Card>
              </motion.div>
            ))}
          </div>
          {isProcessing && (
            <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
              <span className="text-lg">Processing payment...</span>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Secure payments powered by Paystack
        </p>
      </DialogContent>
    </Dialog>
  );
}
