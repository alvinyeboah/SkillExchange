"use client";

import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";


// Create Supabase client
const supabase = createClient();

interface Transaction {
  transaction_id: number;
  from_user_id: string;
  to_user_id: string;
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
  fetchUserTransactions: (userId: string) => Promise<void>;
}

const useTransactions = 
  typeof window !== "undefined"
    ? create<TransactionsState>((set) => ({
        transactions: [],
        isLoading: false,
        error: null,

        fetchUserTransactions: async (userId: string) => {
          set({ isLoading: true, error: null });
          try {
            const { data, error } = await supabase
              .from('Transactions')
              .select(`
                *,
                from_user:from_user_id(username),
                to_user:to_user_id(username),
                service:service_id(title)
              `)
              .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
              .order('transaction_date', { ascending: false });

            if (error) throw error;

            const formattedTransactions = data.map(transaction => ({
              ...transaction,
              from_username: transaction.from_user?.username,
              to_username: transaction.to_user?.username,
              service_title: transaction.service?.title
            }));

            set({ transactions: formattedTransactions, isLoading: false });
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