import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { api, setToken, clearToken, isAuthenticated } from "@/lib/api";

interface User {
  user_id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      api
        .get<User>(`/staff/${user?.user_id || localStorage.getItem("user_id")}`)
        .then(setUser)
        .catch(() => {
          clearToken();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const loginResponse = await api.post<{
      token: string;
      user_id: string;
      email: string;
      message: string;
    }>("/signin", {
      email,
      password,
    });

    const { token, user_id } = loginResponse;
    setToken(token);
    localStorage.setItem("user_id", user_id);

    try {
      // Fetch the full user profile using the user_id obtained from login
      const fullUser = await api.get<User>(`/staff/${user_id}`);
      setUser(fullUser);
      console.log("Login successful for user:", fullUser);
    } catch (error) {
      console.error("Failed to fetch user details after login:", error);
      // If fetching user details fails, clear the token and user state
      clearToken();
      setUser(null);
      throw error; // Re-throw the error for the caller to handle
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
