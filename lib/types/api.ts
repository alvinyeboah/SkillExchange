export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface TransactionResponse {
  transaction_id: number;
  status: "success" | "failed";
  timestamp: string;
}

export interface WalletTransaction {
  from_user_id: number;
  to_user_id: number | null;
  skillcoins_transferred: number;
  service_id: number | null;
  description: string;
}
