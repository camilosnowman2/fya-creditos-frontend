import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Preferences } from "@capacitor/preferences";
import { login as loginRequest } from "@/api/auth";

const TOKEN_KEY = "fya_creditos_token";

interface AuthContextValue {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Preferences.get({ key: TOKEN_KEY })
      .then((result) => setToken(result.value ?? null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await loginRequest(username, password);
    await Preferences.set({ key: TOKEN_KEY, value: response.token });
    setToken(response.token);
  }, []);

  const logout = useCallback(async () => {
    await Preferences.remove({ key: TOKEN_KEY });
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, isLoading, isAuthenticated: token !== null, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>.");
  }
  return context;
}
