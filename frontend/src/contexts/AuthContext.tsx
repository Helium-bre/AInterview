import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Types ready for Supabase integration
interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to check and update auth status
  const checkAndUpdateAuth = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    const email = localStorage.getItem("user_email");
    
    if (token && userId) {
      setUser({ id: userId, email: email || "unknown@example.com" });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };

  // Check on mount
  useEffect(() => {
    checkAndUpdateAuth();
  }, []);

  // Listen for custom storage change event from same window (when user logs in)
  useEffect(() => {
    window.addEventListener("localStorageChange", checkAndUpdateAuth);
    return () => window.removeEventListener("localStorageChange", checkAndUpdateAuth);
  }, []);

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    window.addEventListener("storage", checkAndUpdateAuth);
    return () => window.removeEventListener("storage", checkAndUpdateAuth);
  }, []);

  // Mock sign in - will be replaced with Supabase auth
  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Basic validation
    if (!email || !password) {
      setIsLoading(false);
      return { error: 'Email and password are required' };
    }
    
    if (password.length < 6) {
      setIsLoading(false);
      return { error: 'Password must be at least 6 characters' };
    }

    // Mock successful login - replace with Supabase later
    // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setUser({ id: crypto.randomUUID(), email });
    setIsLoading(false);
    return { error: null };
  };

  // Mock sign up - will be replaced with Supabase auth
  // Note: Does NOT auto-login - user must login after signup
  const signUp = async (email: string, password: string): Promise<{ error: string | null }> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!email || !password) {
      setIsLoading(false);
      return { error: 'Email and password are required' };
    }
    
    if (password.length < 6) {
      setIsLoading(false);
      return { error: 'Password must be at least 6 characters' };
    }

    // Mock successful signup - replace with Supabase later
    // const { data, error } = await supabase.auth.signUp({ 
    //   email, 
    //   password,
    //   options: { emailRedirectTo: `${window.location.origin}/` }
    // });
    // Do NOT set user here - user must login after signup
    setIsLoading(false);
    return { error: null };
  };

  const signOut = async () => {
    // Replace with Supabase later
    // await supabase.auth.signOut();
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
