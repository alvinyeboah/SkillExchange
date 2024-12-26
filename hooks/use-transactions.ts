"use client";

import { create } from "zustand";
import { fetchTransactions } from "@/lib/api";

interface Transaction {
  transaction_id: number;
  from_user_id: number;
  to_user_id: number;
  service_id: number;
  skillcoins_transferred: number;
  transaction_date: string;
  description: string;
  type: "Earned" | "Spent" | "Purchased" | "Donated";
}

interface TransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchUserTransactions: (userId: number) => Promise<void>;
}

const useTransactions =
  typeof window !== "undefined"
    ? create<TransactionsState>((set) => ({
        transactions: [],
        isLoading: false,
        error: null,

        fetchUserTransactions: async (userId: number) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetchTransactions(userId);
            set({ transactions: response, isLoading: false });
          } catch (error: any) {
            set({ error: error.message, isLoading: false });
          }
        },
      }))
    : () => ({
        transactions: [],
        isLoading: false,
        error: null,
        fetchUserTransactions: async () => {},
      });

export { useTransactions };
