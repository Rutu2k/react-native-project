// DummyJSON API Service - Simplified for basic login
// API documentation: https://dummyjson.com/docs/auth

export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
};

export type LoginResponse = {
  user?: User;
  token?: string;
  error?: string;
};

class DummyJsonApiService {
  private baseUrl: string = 'https://dummyjson.com';

  /**
   * Authenticate user with DummyJSON API
   * @param username User username
   * @param password User password
   * @returns Promise with user data, token or error
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.message || 'Login failed' };
      }

      // Extract basic user info
      const user: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
      };

      return {
        user,
        token: data.token || data.accessToken, // Handle both token formats
      };
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Network error occurred' };
    }
  }
}

export default new DummyJsonApiService();
