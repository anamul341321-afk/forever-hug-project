import { useState, useEffect, useCallback } from "react";
import { loginUser, getUser, type User } from "@/lib/api";

const USER_KEY = "gooddollar_user_id";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
      getUser(parseInt(stored)).then((u) => {
        setUser(u);
        setIsLoading(false);
      }).catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async ({ guestId, displayName }: { guestId: string; displayName: string }) => {
    setIsLoggingIn(true);
    try {
      const u = await loginUser(guestId, displayName);
      localStorage.setItem(USER_KEY, String(u.id));
      setUser(u);
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (user?.id) {
      const u = await getUser(user.id);
      if (u) setUser(u);
    }
  }, [user?.id]);

  return {
    user,
    isLoading,
    isLoggingIn,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };
}
