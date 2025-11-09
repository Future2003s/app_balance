import { Category } from "@/lib/types";

// Servicio para gestión de categorías usando MongoDB API
export const categoryService = {
  // Inicializar categorías por defecto si no existen
  async initialize(): Promise<void> {
    try {
      await fetch("/api/init", { method: "POST" });
    } catch (error) {
      console.error("Error initializing default data:", error);
    }
  },

  // Obtener todas las categorías
  async getAll(): Promise<Category[]> {
    try {
      const response = await fetch("/api/categories", {
        credentials: "include", // Incluir cookies para autenticación
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error("Unauthorized: User not authenticated");
          return [];
        }
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      
      const categories = await response.json();
      
      // Si no hay categorías, intentar inicializar (la API ya lo hace automáticamente)
      // pero por si acaso, intentamos de nuevo
      if (categories.length === 0) {
        console.log("No categories found, waiting for initialization...");
        // Esperar un poco y volver a intentar
        await new Promise((resolve) => setTimeout(resolve, 500));
        const retryResponse = await fetch("/api/categories", {
          credentials: "include",
        });
        if (retryResponse.ok) {
          return await retryResponse.json();
        }
      }
      
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  // Obtener una categoría por ID
  async getById(id: string): Promise<Category | null> {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 404) return null;
        if (response.status === 401) {
          console.error("Unauthorized: User not authenticated");
          return null;
        }
        throw new Error("Failed to fetch category");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching category:", error);
      return null;
    }
  },

  // Crear una nueva categoría
  async create(
    data: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<Category | null> {
    try {
      const response = await fetch("/api/categories", {
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
        throw new Error("Failed to create category");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating category:", error);
      return null;
    }
  },

  // Actualizar una categoría
  async update(
    id: string,
    data: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>
  ): Promise<Category | null> {
    try {
      const response = await fetch(`/api/categories/${id}`, {
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
        throw new Error("Failed to update category");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating category:", error);
      return null;
    }
  },

  // Eliminar una categoría
  async delete(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || "Failed to delete category";
        
        if (response.status === 404) {
          console.error("Category not found");
          return false;
        }
        if (response.status === 401) {
          console.error("Unauthorized: User not authenticated");
          return false;
        }
        if (response.status === 403) {
          console.error("Cannot delete:", errorMessage);
          throw new Error(errorMessage);
        }
        throw new Error(errorMessage);
      }
      return true;
    } catch (error: any) {
      console.error("Error deleting category:", error);
      throw error; // Re-lanzar el error para que la UI pueda manejarlo
    }
  },
};
