import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { login as apiLogin, logout as apiLogout } from '@/lib/api'

interface UserRating {
  rating_value: number
  rating_count: number
}

interface UserTransaction {
  transaction_id: number
  amount: number
  date: string
  type: 'incoming' | 'outgoing'
}

interface UserChallenge {
  challenge_id: number
  title: string
  status: 'active' | 'completed'
  progress: number
}

interface UserService {
  service_id: number
  title: string
  description: string
  rating: number
}

interface User {
  id: number
  email: string
  role?: string
  name?: string
  bio?: string
  username: string
  avatar?: string
  skillcoins: number
  created_at: string
  skills?: string[]
  ratings?: UserRating
  transactions?: UserTransaction[]
  activeChallenges?: UserChallenge[]
  completedChallenges?: UserChallenge[]
  services?: UserService[]
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User | null) => void
  clearError: () => void
  refreshUserData: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiLogin({ email, password })
          const authCheck = await fetch('/api/auth/check')
          if (!authCheck.ok) {
            throw new Error('Failed to verify authentication')
          }
          const { user } = await authCheck.json()
          set({ user, isLoading: false, isInitialized: true })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null })
        try {
          await apiLogout()
          set({ user: null, isLoading: false })
          window.location.href = '/auth/signin'
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      setUser: (user: User | null) => set({ user }),
      clearError: () => set({ error: null }),

      checkAuth: async () => {
        try {
          const response = await fetch('/api/auth/check')
          if (response.ok) {
            const { user } = await response.json()
            set({ user, isInitialized: true })
          } else {
            set({ user: null, isInitialized: true })
          }
        } catch {
          set({ user: null, isInitialized: true })
        }
      },

      refreshUserData: async () => {
        const currentUser = get().user
        if (!currentUser?.id) return

        try {
          const [userResponse, transactionsResponse, servicesResponse] = await Promise.all([
            fetch(`/api/users/${currentUser.id}`),
            fetch(`/api/transactions/${currentUser.id}`),
            fetch(`/api/services/${currentUser.id}`)
          ])

          if (!userResponse.ok || !transactionsResponse.ok || !servicesResponse.ok) {
            throw new Error('Failed to fetch user data')
          }

          const [userData, transactionsData, servicesData] = await Promise.all([
            userResponse.json(),
            transactionsResponse.json(),
            servicesResponse.json()
          ])

          const enrichedUser = {
            ...userData,
            transactions: transactionsData,
            services: servicesData
          }

          set({ user: enrichedUser })
        } catch (error: any) {
          console.error('Failed to refresh user data:', error)
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
)

// Optional: Create a React hook wrapper for better type inference
export function useAuthState() {
  const state = useAuth()
  return state
} 