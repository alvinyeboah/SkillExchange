import { create } from 'zustand';

interface Transaction {
  transaction_id: number;
  from_user_id: number;
  to_user_id: number;
  skillcoins_transferred: number;
  transaction_date: string;
  description: string;
  type: 'Earned' | 'Spent';
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
  handleDonation: (userId: number, amount: number, recipientId: number | null) => Promise<void>;
  users: User[];
  fetchUsers: () => Promise<void>;
}

export const useWallet = create<WalletState>((set, get) => ({
  balance: 0,
  transactions: [],
  isLoading: false,
  error: null,
  users: [],

  fetchWallet: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/wallet?userId=${userId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch wallet data');
      }
      
      const data = await response.json();
      
      set({ 
        balance: data.balance,
        transactions: data.transactions,
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  handleDonation: async (userId: number, amount: number, recipientId: number | null) => {
    set({ isLoading: true, error: null });
    try {
      // Create the transaction
      const transactionResponse = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_user_id: userId,
          to_user_id: recipientId,
          skillcoins_transferred: amount,
          description: recipientId ? 'User Donation' : 'Community Donation'
        })
      });

      if (!transactionResponse.ok) {
        throw new Error('Failed to create transaction');
      }

      // Update sender's balance
      await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillcoins_adjustment: -amount
        })
      });

      // If sending to a user, update their balance
      if (recipientId) {
        await fetch(`/api/users/${recipientId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skillcoins_adjustment: amount
          })
        });
      }

      // Refresh wallet data
      await get().fetchWallet(userId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchUsers: async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      set({ users: data });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
