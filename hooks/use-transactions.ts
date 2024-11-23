import { create } from 'zustand';
import { fetchTransactions } from '@/lib/api';

interface Transaction {
  transaction_id: number;
  amount: number;
  date: string;
  type: 'incoming' | 'outgoing';
  description: string;
}

interface TransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchUserTransactions: (userId: number) => Promise<void>;
}

export const useTransactions = create<TransactionsState>((set) => ({
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
}));
