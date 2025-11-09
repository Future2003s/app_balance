'use client';

import { useState, useEffect, useCallback } from 'react';
import { useIsClient } from './useIsClient';

/**
 * Hook personalizado para manejar localStorage de forma segura
 * Evita errores de hidratación en Next.js
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const isClient = useIsClient();
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Inicializar desde localStorage solo en el cliente
  useEffect(() => {
    if (!isClient) return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key, isClient]);

  // Función para actualizar el valor
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Permitir que value sea una función para actualizar basado en el valor anterior
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        setStoredValue(valueToStore);
        
        if (isClient) {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, isClient]
  );

  return [storedValue, setValue] as const;
}

