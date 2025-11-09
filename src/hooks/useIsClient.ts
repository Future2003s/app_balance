'use client';

import { useEffect, useState } from 'react';

/**
 * Hook para detectar si el componente se está ejecutando en el cliente
 * Útil para evitar errores de hidratación con localStorage y otras APIs del navegador
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

