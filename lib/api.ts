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
export async function createService(serviceData: {
  title: string;
  description: string;
  skillcoinPrice: number;
  deliveryTime: string;
  tags?: string[];
  requirements?: string;
  revisions?: number;
}) {
  try {
    const response = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create service');
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

// Service Requests
export async function createServiceRequest(requestData: {
  service_id: number;
  requester_id: number;
  provider_id: number;
  requirements?: string;
}) {
  try {
    const response = await fetch(`${BASE_URL}/service-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create service request');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

// Challenge Submissions
export async function createChallengeSubmission(submissionData: {
  challenge_id: number;
  user_id: number;
  content: string;
  submission_url?: string;
}) {
  try {
    const response = await fetch(`${BASE_URL}/challenges/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create challenge submission');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

// Achievements
export async function earnAchievement(achievementData: {
  user_id: number;
  achievement_id: number;
}) {
  try {
    const response = await fetch(`${BASE_URL}/achievements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(achievementData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to earn achievement');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

// Communities
export async function createCommunity(communityData: {
  name: string;
  description: string;
  creator_id: number;
}) {
  try {
    const response = await fetch(`${BASE_URL}/communities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(communityData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create community');
    }

    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

// Fetch functions for each feature
export async function getServiceRequests(userId: number) {
  try {
    const response = await fetch(`${BASE_URL}/service-requests?userId=${userId}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch service requests');
    }
    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

export async function getChallengeSubmissions(challengeId: number) {
  try {
    const response = await fetch(`${BASE_URL}/challenges/${challengeId}/submissions`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch challenge submissions');
    }
    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

export async function getUserAchievements(userId: number) {
  try {
    const response = await fetch(`${BASE_URL}/achievements?userId=${userId}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch achievements');
    }
    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

export async function getCommunities() {
  try {
    const response = await fetch(`${BASE_URL}/communities`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch communities');
    }
    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

export async function getCommunityPosts(communityId: number) {
  try {
    const response = await fetch(`${BASE_URL}/communities/${communityId}/posts`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch community posts');
    }
    return response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}
