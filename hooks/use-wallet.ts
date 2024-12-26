"use client";

import { create } from "zustand";

interface Transaction {
  transaction_id: number;
  from_user_id: number;
  to_user_id: number;
  skillcoins_transferred: number;
  transaction_date: string;
  description: string;
  type: "Earned" | "Spent";
}

interface Donation {
  amount: string;
  username: string;
  created_at: string;
}

interface User {
  user_id: number;
  username: string;
}

interface WalletState {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchWallet: (userId: number) => Promise<void>;
  handleDonation: (
    userId: number,
    amount: number,
    recipientId: number | null
  ) => Promise<void>;
  users: User[];
  donations: Donation[];
  fetchUsers: () => Promise<void>;
  getUserDonations: (userId: number) => Promise<void>;
  getDonations: () => Promise<void>;
}

// Add check for browser environment
const useWallet =

    create<WalletState>((set, get) => ({
        balance: 0,
        transactions: [],
        isLoading: false,
        error: null,
        users: [],
        donations: [],

        fetchWallet: async (userId: number) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`/api/wallet?userId=${userId}`);
            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message || "Failed to fetch wallet data");
            }

            const data = await response.json();

            set({
              balance: data.balance,
              transactions: data.transactions,
              isLoading: false,
            });

            // Fetch user donations after fetching wallet data
            await get().getUserDonations(userId);
          } catch (error: any) {
            set({ error: error.message, isLoading: false });
          }
        },
        getUserDonations: async (userId: number) => {
          try {
            const donationsResponse = await fetch(
              `/api/donations?userId=${userId}`
            );
            const usersResponse = await fetch("/api/users");
            if (!donationsResponse.ok)
              throw new Error("Failed to fetch user donations");
            const donationsData = await donationsResponse.json();
            const usersData = await usersResponse.json();
            const matchedDonations = donationsData.map((donation: any) => {
              const recipient = usersData.find(
                (user: any) => user.user_id === donation.to_user_id
              );
              return {
                ...donation,
                username: recipient ? recipient.username : "Unknown User",
              };
            });
            set({ donations: matchedDonations });
          } catch (error: any) {
            set({ error: error.message });
          }
        },
        getDonations: async () => {
          try {
            const response = await fetch("/api/donations");
            if (!response.ok) throw new Error("Failed to fetch all donations");
            const donations = await response.json();
            // Handle donations as needed
          } catch (error: any) {
            set({ error: error.message });
          }
        },

        handleDonation: async (
          userId: number,
          amount: number,
          recipientId: number | null
        ) => {
          set({ isLoading: true, error: null });
          try {
            // Check if the user has enough balance
            const currentBalance = get().balance;
            if (amount > currentBalance) {
              throw new Error("Insufficient balance to make this donation");
            }
            const transactionResponse = await fetch("/api/donations", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                from_user_id: userId,
                to_user_id: recipientId,
                amount: amount,
              }),
            });

            if (!transactionResponse.ok) {
              throw new Error("Failed to create transaction");
            }

            await fetch(`/api/users/${userId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                skillcoins_adjustment: -amount,
              }),
            });
            if (recipientId) {
              await fetch(`/api/users/${recipientId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  skillcoins_adjustment: amount,
                }),
              });
            }
            await get().fetchWallet(userId);
          } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
          }
        },

        fetchUsers: async () => {
          try {
            const response = await fetch("/api/users");
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            set({ users: data });
          } catch (error: any) {
            set({ error: error.message });
          }
        },
  })
);

export { useWallet };
