import {toast} from "sonner";
const BASE_URL = '/api'; 

export async function login(userData: {email: string, password: string}) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

// Register API
export async function register(userData: { 
  email: string; 
  password: string; 
  username: string;
  name: string; 
}) {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}


// Logout API
export async function logout() {
  try {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

// Get Analytics (Admin-only)
export async function getAnalytics() {
  try {
    const response = await fetch(`${BASE_URL}/admin/analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch analytics');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

export async function getServices() {
  try {
    const response = await fetch(`${BASE_URL}/marketplace`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch services');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

export async function getServicesById(serviceId: string) {
  try {
    const response = await fetch(`${BASE_URL}/marketplace/${serviceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch service');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

// Create a Service
export async function createService(serviceData: { title: string; description: string; skillcoinPrice: number; deliveryTime: string }) {
  try {
    const response = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create service');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

// Fetch Leaderboard
export async function getLeaderboard() {
  try {
    const response = await fetch(`${BASE_URL}/community/leaderboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch leaderboard');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

// Fetch Dashboard Stats
export async function getDashboardStats() {
  try {
    const response = await fetch(`${BASE_URL}/community/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch dashboard stats');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

// Fetch Reviews for a Service
export async function getServiceReviews(serviceId: string) {
  try {
    const response = await fetch(`${BASE_URL}/services/${serviceId}/reviews`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch reviews');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

// Add Review to a Service
export async function addServiceReview(serviceId: string, reviewData: { ratingValue: number; review: string }) {
  try {
    const response = await fetch(`${BASE_URL}/services/${serviceId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add review. Please try again later.');
    }

    toast.success('Review added successfully!'); // Success message
    return response.json();
  } catch (error: any) {
    toast.error(`Review submission failed: ${error.message || 'Network error'}`); // Descriptive toast message
    throw new Error(error.message || 'Network error');
  }
}

// Utility function for handling fetch errors
const handleFetchError = (error: any, defaultMessage: string) => {
  const message = error.message || defaultMessage;
  toast.error(message);
  return new Error(message);
};

// Fetch Challenges
export async function fetchChallenges(userId: number) {
  try {
    const response = await fetch(`${BASE_URL}/challenges/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch challenges. Please try again later.');
    }

    return response.json();
  } catch (error: any) {
    return handleFetchError(error, 'Challenge fetch failed');
  }
}

// Fetch User Transactions
export async function fetchTransactions(userId: number) {
  try {
    const response = await fetch(`${BASE_URL}/transactions/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch transactions. Please try again later.');
    }

    return response.json();
  } catch (error: any) {
    return handleFetchError(error, 'Transaction fetch failed');
  }
}

// Fetch User Services
export async function fetchServices(userId: number) {
  try {
    const response = await fetch(`${BASE_URL}/services/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch services');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

export async function getChallenges() {
  try {
    const response = await fetch(`${BASE_URL}/challenges`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch challenges');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}
