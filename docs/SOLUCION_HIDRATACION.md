# Solución de Errores de Hidratación

## Problema
Next.js puede mostrar errores de hidratación cuando:
1. Extensiones del navegador modifican el HTML (agregan atributos como `__processed_...` o `bis_register`)
2. Se usa `localStorage` o APIs del navegador durante el renderizado del servidor
3. Hay diferencias entre el HTML del servidor y el del cliente

## Soluciones Implementadas

### 1. suppressHydrationWarning
Se agregó `suppressHydrationWarning` a los elementos `<html>` y `<body>` en `layout.tsx` para ignorar advertencias causadas por extensiones del navegador que modifican el DOM.

```tsx
<html lang="es" suppressHydrationWarning>
  <body className="antialiased" suppressHydrationWarning>
```

### 2. Hook useIsClient
Hook personalizado para detectar si el código se está ejecutando en el cliente:

```tsx
import { useIsClient } from '@/hooks/useIsClient';

function MyComponent() {
  const isClient = useIsClient();
  
  if (!isClient) {
    return <div>Loading...</div>;
  }
  
  // Código que usa APIs del navegador
  return <div>{window.location.href}</div>;
}
```

### 3. Hook useLocalStorage
Hook seguro para usar localStorage que evita errores de hidratación:

```tsx
import { useLocalStorage } from '@/hooks/useLocalStorage';

function MyComponent() {
  const [value, setValue] = useLocalStorage('myKey', 'defaultValue');
  
  return <div>{value}</div>;
}
```

## Buenas Prácticas

### ✅ Hacer
- Usar `useIsClient()` antes de acceder a `window` o `localStorage`
- Usar `useLocalStorage` hook en lugar de acceder directamente a localStorage
- Marcar componentes que usan APIs del navegador con `'use client'`
- Usar `suppressHydrationWarning` solo cuando sea necesario (extensiones del navegador)

### ❌ Evitar
- Acceder a `window` o `localStorage` directamente durante el renderizado
- Usar `Date.now()` o `Math.random()` durante el renderizado del servidor
- Renderizar contenido diferente en servidor y cliente sin manejar la hidratación

## Ejemplo de Uso Correcto

```tsx
'use client';

import { useIsClient } from '@/hooks/useIsClient';
import { expenseService } from '@/services/expense.service';

export function ExpenseList() {
  const isClient = useIsClient();
  const [expenses, setExpenses] = useState([]);
  
  useEffect(() => {
    if (isClient) {
      // Solo ejecutar en el cliente
      const data = expenseService.getAll();
      setExpenses(data);
    }
  }, [isClient]);
  
  if (!isClient) {
    return <div>Cargando...</div>;
  }
  
  return (
    <div>
      {expenses.map(expense => (
        <div key={expense.id}>{expense.description}</div>
      ))}
    </div>
  );
}
```

