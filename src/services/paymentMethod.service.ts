import { PaymentMethod } from "@/lib/types";

// Servicio para gestión de métodos de pago usando MongoDB API
export const paymentMethodService = {
  // Inicializar métodos de pago por defecto si no existen
  async initialize(): Promise<void> {
    try {
      await fetch("/api/init", { method: "POST" });
    } catch (error) {
      console.error("Error initializing default data:", error);
    }
  },

  // Obtener todos los métodos de pago
  async getAll(): Promise<PaymentMethod[]> {
    try {
      const response = await fetch("/api/payment-methods", {
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 401) {
          console.error("Unauthorized: User not authenticated");
          return [];
        }
        throw new Error("Failed to fetch payment methods");
      }
      const paymentMethods = await response.json();
      // Si no hay métodos de pago, la API ya los inicializa automáticamente
      return paymentMethods;
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      return [];
    }
  },

  // Obtener un método de pago por ID
  async getById(id: string): Promise<PaymentMethod | null> {
    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 404) return null;
        if (response.status === 401) {
          console.error("Unauthorized: User not authenticated");
          return null;
        }
        throw new Error("Failed to fetch payment method");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching payment method:", error);
      return null;
    }
  },

  // Crear un nuevo método de pago
  async create(
    data: Omit<PaymentMethod, "id" | "createdAt" | "updatedAt">
  ): Promise<PaymentMethod | null> {
    try {
      const response = await fetch("/api/payment-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        if (response.status === 401) {
          console.error("Unauthorized: User not authenticated");
          return null;
        }
        throw new Error("Failed to create payment method");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating payment method:", error);
      return null;
    }
  },

  // Actualizar un método de pago
  async update(
    id: string,
    data: Partial<Omit<PaymentMethod, "id" | "createdAt" | "updatedAt">>
  ): Promise<PaymentMethod | null> {
    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        if (response.status === 404) return null;
        if (response.status === 401) {
          console.error("Unauthorized: User not authenticated");
          return null;
        }
        throw new Error("Failed to update payment method");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating payment method:", error);
      return null;
    }
  },

  // Eliminar un método de pago
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/payment-methods/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 404) return false;
        if (response.status === 401) {
          console.error("Unauthorized: User not authenticated");
          return false;
        }
        throw new Error("Failed to delete payment method");
      }
      return true;
    } catch (error) {
      console.error("Error deleting payment method:", error);
      return false;
    }
  },
};
