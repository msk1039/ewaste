'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'donor' | 'admin' | 'volunteer' | 'recycler';
  donorType?: string; // For donors only
  age?: number; // For volunteers only
  occupation?: string; // For volunteers only
  programId?: number; // For volunteers only
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: string) => Promise<boolean>;
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
        const response = await fetch('/api/auth/me');
        console.log('Auth response status:', response.status);
        
        if (!response.ok) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        console.log('Parsed user data:', data);
        
        if (data.user) {
          setUser(data.user);
        } else {
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

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    try {
      console.log("Attempting login with:", { email, role });
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        toast.error(data.error || "Invalid credentials");
        return false;
      }
      
      // Properly map the user data from the API response
      if (data.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        });
        
        toast.success('Logged in successfully');
        
        // Use direct window location redirect instead of Next.js router
        // This forces a full page navigation which is more reliable
        console.log(`Redirecting to /${data.user.role} page`);
        
        // Short timeout to allow the toast to be displayed
        setTimeout(() => {
          window.location.href = `/${data.user.role}`;
        }, 800);
        
        return true;
      } else {
        toast.error('Invalid user data received');
        return false;
      }
    } catch (error) {
      toast.error("Something went wrong during login");
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
      
      router.push('/signin');
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