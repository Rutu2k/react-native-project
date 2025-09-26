import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DummyJsonApiService, { User } from '../services/DummyJsonApiService';

type AuthContextType = {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  userData: User | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys
const TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        const userDataString = await AsyncStorage.getItem(USER_DATA_KEY);

        if (token && userDataString) {
          const user = JSON.parse(userDataString);
          setUserData(user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Failed to get login status:', error);
        setError('Failed to restore login session');
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Login using DummyJSON API
  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await DummyJsonApiService.login(username, password);

      if (response.token && response.user) {
        // Store token and user data
        await AsyncStorage.setItem(TOKEN_KEY, response.token);
        await AsyncStorage.setItem(
          USER_DATA_KEY,
          JSON.stringify(response.user),
        );

        setUserData(response.user);
        setIsLoggedIn(true);
        return true;
      } else {
        setError(response.error || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      setUserData(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        isLoading,
        error,
        userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
