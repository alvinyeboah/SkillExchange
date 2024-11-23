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
export async function register(userData: { email: string; password: string; username: string }) {
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

// Fetch All Services
export async function getServices() {
  try {
    const response = await fetch(`${BASE_URL}/services`, {
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
      throw new Error(errorData.message || 'Failed to add review');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

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
      throw new Error(errorData.message || 'Failed to fetch challenges');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
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
      throw new Error(errorData.message || 'Failed to fetch transactions');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
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
