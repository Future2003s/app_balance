"use client";

// Utilidades de autenticación para el cliente

export function setAuthToken(token: string) {
  // Guardar token en cookie
  document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

export function removeAuthToken() {
  document.cookie = "auth-token=; path=/; max-age=0";
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "auth-token") {
      return value;
    }
  }
  return null;
}

