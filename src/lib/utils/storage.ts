// Utilidades para manejo de LocalStorage

const STORAGE_KEYS = {
  EXPENSES: 'expenses',
  CATEGORIES: 'categories',
  PAYMENT_METHODS: 'paymentMethods',
} as const;

export const storage = {
  // Obtener datos del localStorage
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  // Guardar datos en localStorage
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  },

  // Eliminar datos del localStorage
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },

  // Limpiar todo el localStorage
  clear(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.clear();
  },
};

export { STORAGE_KEYS };

