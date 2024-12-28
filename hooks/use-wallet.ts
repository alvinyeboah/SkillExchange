"use client";

import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";

const supabase = createClient();

interface Transaction {
  transaction_id: number;
  from_user_id: string;
  to_user_id: string;
  service_id: number;
  skillcoins_transferred: number;
  transaction_date: string;
  description: string;
  type: string;
}

interface Donation {
  donation_id: number;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  created_at: string;
  username?: string;
}

interface User {
  user_id?: string;
  username: string;
}

interface WalletState {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  users: User[];
  donations: Donation[];
  fetchWallet: (userId: string) => Promise<void>;
  handleDonation: (
    userId: string,
    amount: number,
    recipientId: string | null
  ) => Promise<{ success: boolean; message: string }>;
  fetchUsers: () => Promise<void>;
  getUserDonations: (userId: string) => Promise<void>;
  getDonations: () => Promise<void>;
  creditWallet: (
    userId: string,
    amount: number,
    reference: string,
    transactionId: string
  ) => Promise<{ success: boolean; message: string }>;
}

export const useWallet = create<WalletState>((set, get) => ({
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,
  users: [],
  donations: [],

  fetchWallet: async (userId: string) => {
    if (!userId) {
      set({ error: "User ID is required" });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const { data: userData, error: userError } = await supabase
        .from("Users")
        .select("skillcoins")
        .eq("user_id", userId)
        .single();

      if (userError) throw userError;
      if (!userData) throw new Error("No user data found");

      const { data: transactionsData, error: transactionsError } =
        await supabase
          .from("Transactions")
          .select("*")
          .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
          .order("transaction_date", { ascending: false });

      if (transactionsError) throw transactionsError;

      set({
        balance: userData.skillcoins,
        transactions: transactionsData || [],
        isLoading: false,
      });
    } catch (error: any) {
      console.error("Error in fetchWallet:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  getUserDonations: async (userId: string) => {
    if (!userId) {
      set({ error: "User ID is required" });
      return;
    }

    try {
      const { data: donations, error: donationsError } = await supabase
        .from("Donations")
        .select(
          `
          *,
          to_user:to_user_id(username)
        `
        )
        .eq("from_user_id", userId)
        .order("created_at", { ascending: false });

      if (donationsError) throw donationsError;

      const formattedDonations =
        donations?.map((donation) => ({
          ...donation,
          username: donation.to_user?.username || "Unknown User",
        })) || [];

      set({ donations: formattedDonations });
    } catch (error: any) {
      console.error("Error in getUserDonations:", error);
      set({ error: error.message });
    }
  },

  getDonations: async () => {
    try {
      const { data: donations, error } = await supabase
        .from("Donations")
        .select(
          `
          *,
          from_user:from_user_id(username),
          to_user:to_user_id(username)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedDonations =
        donations?.map((donation) => ({
          ...donation,
          from_username: donation.from_user?.username || "Unknown User",
          to_username: donation.to_user?.username || "Unknown User",
        })) || [];

      set({ donations: formattedDonations });
    } catch (error: any) {
      console.error("Error in getDonations:", error);
      set({ error: error.message });
    }
  },

  handleDonation: async (
    userId: string,
    amount: number,
    recipientId: string | null
  ) => {
    if (!userId || !recipientId) {
      set({ error: "Both user ID and recipient ID are required" });
      return {
        success: false,
        message: "Both user ID and recipient ID are required",
      };
    }

    if (amount <= 0) {
      set({ error: "Amount must be greater than 0" });
      return { success: false, message: "Amount must be greater than 0" };
    }

    set({ isLoading: true, error: null });

    try {
      const supabase = createClient();

      // Start a Supabase transaction
      const { data: currentUser, error: userError } = await supabase
        .from("Users")
        .select("skillcoins")
        .eq("user_id", userId)
        .single();

      if (userError) throw userError;
      if (!currentUser) throw new Error("User not found");
      if (currentUser.skillcoins < amount) {
        return { success: false, message: "Insufficient SkillCoins balance" };
      }

      // Perform the transfer operations
      const { error: transferError } = await supabase.rpc(
        "transfer_skillcoins",
        {
          sender_id: userId,
          recipient_id: recipientId,
          amount: amount,
        }
      );

      if (transferError) throw transferError;

      // Record the donation
      const { error: donationError } = await supabase.from("Donations").insert([
        {
          from_user_id: userId,
          to_user_id: recipientId,
          amount: amount,
          created_at: new Date().toISOString(),
        },
      ]);

      if (donationError) throw donationError;

      // Record the transaction
      const { error: transactionError } = await supabase
        .from("Transactions")
        .insert([
          {
            from_user_id: userId,
            to_user_id: recipientId,
            service_id: 1, // You might want to create a special service_id for donations
            skillcoins_transferred: amount,
            description: "Donation",
            type: "Donated",
            transaction_date: new Date().toISOString(),
          },
        ]);

      if (transactionError) throw transactionError;

      // Refresh wallet data
      await get().fetchWallet(userId);
      await get().getUserDonations(userId);

      return { success: true, message: "Donation successful" };
    } catch (error: any) {
      console.error("Error in handleDonation:", error);
      set({ error: error.message });
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUsers: async () => {
    try {
      const { data, error } = await supabase
        .from("Users")
        .select("user_id, username")
        .order("username");

      if (error) throw error;
      set({ users: data || [] });
    } catch (error: any) {
      console.error("Error in fetchUsers:", error);
      set({ error: error.message });
    }
  },

  creditWallet: async (
    userId: string,
    amount: number,
    reference: string,
    transactionId: string
  ) => {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }

    try {
      // First, update the user's skillcoins balance
      const { error: updateError } = await supabase.rpc(
        "increment_skillcoins",
        {
          user_id_input: userId,
          amount_input: amount,
        }
      );

      if (updateError) throw updateError;

      // Record the payment transaction
      const { error: paymentError } = await supabase
        .from("PaymentTransactions")
        .insert([
          {
            user_id: userId,
            amount: amount,
            reference: reference,
            transaction_id: transactionId,
            status: "successful",
          },
        ]);

      if (paymentError) throw paymentError;

      // Record in Transactions table
      const { error: transactionError } = await supabase
        .from("Transactions")
        .insert([
          {
            from_user_id: userId,
            to_user_id: userId,
            service_id: 1, // You might want to create a special service_id for deposits
            skillcoins_transferred: amount,
            description: "Wallet Top-up",
            type: "Deposit",
          },
        ]);

      if (transactionError) throw transactionError;

      // Refresh wallet data
      await get().fetchWallet(userId);

      return { success: true, message: "Wallet credited successfully" };
    } catch (error: any) {
      console.error("Error in creditWallet:", error);
      return { success: false, message: error.message };
    }
  },
}));
