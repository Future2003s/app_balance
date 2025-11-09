"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { removeAuthToken } from "@/lib/utils/auth";

interface User {
  id: string;
  email: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        // No redirigir aquí, dejar que la página lo maneje
        await checkAuth();
        return { success: true };
      } else {
        return { success: false, error: data.error || "Đăng nhập thất bại" };
      }
    } catch (error: any) {
      return { success: false, error: error.message || "Đăng nhập thất bại" };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        // No redirigir aquí, dejar que la página lo maneje
        await checkAuth();
        return { success: true };
      } else {
        // Mostrar el mensaje de error del servidor
        const errorMessage = data.error || data.message || "Đăng ký thất bại";
        console.error("Registration error:", errorMessage, data);
        return { success: false, error: errorMessage };
      }
    } catch (error: any) {
      console.error("Registration network error:", error);
      return { 
        success: false, 
        error: error.message || "Không thể kết nối đến server. Vui lòng thử lại." 
      };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      removeAuthToken();
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
  };
}

