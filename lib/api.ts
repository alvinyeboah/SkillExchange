const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Generic fetcher function with error handling
export const fetcher = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }

  return await response.json();
};

// User-related API calls
export const userAPI = {
  register: async (data: { username: string; email: string; password: string }) =>
    fetcher('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: async (data: { email: string; password: string }) =>
    fetcher('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    logout: () => {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      },

  getProfile: async (userId: number) =>
    fetcher(`/users/${userId}`),

  getWallet: async (userId: number) =>
    fetcher(`/wallet?userId=${userId}`),
};

export const serviceAPI = {
  getAll: async () =>
    fetcher('/services'),

  getById: async (serviceId: number) =>
    fetcher(`/services/${serviceId}`),

  create: async (data: {
    title: string;
    description: string;
    skillcoin_price: number;
    delivery_time: number;
  }) =>
    fetcher('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: async (serviceId: number, data: Partial<{
    title: string;
    description: string;
    skillcoin_price: number;
    delivery_time: number;
  }>) =>
    fetcher(`/services/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: async (serviceId: number) =>
    fetcher(`/services/${serviceId}`, {
      method: 'DELETE',
    }),
};

// Transaction-related API calls
export const transactionAPI = {
  getHistory: async (userId: number) =>
    fetcher(`/transactions?userId=${userId}`),

  create: async (data: {
    from_user_id: number;
    to_user_id: number;
    service_id: number;
    skillcoins_transferred: number;
  }) =>
    fetcher('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Challenge-related API calls
export const challengeAPI = {
  getAll: async () =>
    fetcher('/challenges'),

  getById: async (challengeId: number) =>
    fetcher(`/challenges/${challengeId}`),

  participate: async (data: { challenge_id: number; user_id: number }) =>
    fetcher('/challenges/participate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
