'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner'; // Updated import

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth status...');
        const response = await fetch('../api/auth/me');
        console.log('Auth response status:', response.status);
        console.log('Auth response type:', response.headers.get('content-type'));
        
        const text = await response.text(); // Get the raw response first
        console.log('Auth response body (first 100 chars):', text.substring(0, 100));
        
        // Try to parse as JSON if it looks like JSON
        try {
          if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
            const data = JSON.parse(text);
            console.log('Parsed user data:', data);
            if (data.user) {
              setUser(data.user);
            } else {
              setUser(null);
            }
          } else {
            console.error('Response is not JSON:', text.substring(0, 100));
            setUser(null);
          }
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(` ${data.error || "Invalid credentials"}`);
        return false;
      }

      const data = await response.json();
      setUser({ id: data.id, username });
      
      toast.success('Logged in successfully')
      
      router.push('/');
      return true;
    } catch (error) {
        toast.error( "Something went wrong during login",);
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      setUser(null);
      
      toast.success("You have been logged out successfully");
      
      router.push('/login');
    } catch (error) {
      toast.error("Something went wrong during logout");
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};