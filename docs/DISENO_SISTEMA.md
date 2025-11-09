# Diseño del Sistema - Gestión de Gastos

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Pages      │  │  Components   │  │   Services   │ │
│  │              │  │               │  │              │ │
│  │ - Dashboard  │  │ - UI Base     │  │ - Expense    │ │
│  │ - Expenses   │  │ - Expenses    │  │ - Category   │ │
│  │ - Categories │  │ - Categories  │  │ - Payment    │ │
│  │ - Analytics  │  │ - Dashboard   │  │ - Dashboard  │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                  │                  │         │
│         └──────────────────┼──────────────────┘         │
│                            │                            │
│                    ┌───────▼────────┐                   │
│                    │   Utilities    │                   │
│                    │                │                   │
│                    │ - Storage      │                   │
│                    │ - Format       │                   │
│                    │ - Types        │                   │
│                    └───────┬────────┘                   │
│                            │                            │
└────────────────────────────┼────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  LocalStorage   │
                    │                 │
                    │ - expenses      │
                    │ - categories    │
                    │ - paymentMethods│
                    └─────────────────┘
```

## Flujo de Datos

### 1. Crear un Gasto
```
Usuario → ExpenseForm → expenseService.create() → LocalStorage → Actualizar UI
```

### 2. Ver Dashboard
```
Usuario → Dashboard Page → dashboardService.getStats() → 
  ├─ expenseService.getCurrentMonthExpenses()
  ├─ expenseService.getPreviousMonthExpenses()
  └─ categoryService.getAll()
  → Calcular estadísticas → Mostrar en UI
```

### 3. Filtrar Gastos
```
Usuario → ExpenseFilters → expenseService.filter() → 
  Aplicar filtros → Actualizar ExpenseList
```

## Modelo de Datos Relacional

```
Expense
├── id: string (PK)
├── amount: number
├── description: string
├── categoryId: string (FK → Category.id)
├── paymentMethodId: string (FK → PaymentMethod.id)
├── date: Date
├── createdAt: Date
└── updatedAt: Date

Category
├── id: string (PK)
├── name: string
├── color: string
├── icon: string
├── createdAt: Date
└── updatedAt: Date

PaymentMethod
├── id: string (PK)
├── name: string
├── icon: string
├── createdAt: Date
└── updatedAt: Date
```

## Rutas de la Aplicación

```
/ (Dashboard)
├── /expenses
│   ├── /expenses (Lista)
│   ├── /expenses/new (Crear)
│   └── /expenses/[id] (Editar)
├── /categories
│   ├── /categories (Lista)
│   ├── /categories/new (Crear)
│   └── /categories/[id] (Editar)
└── /analytics (Análisis avanzado)
```

## Estados y Hooks

### Custom Hooks Propuestos

1. **useExpenses**
   - Gestiona lista de gastos
   - Funciones: getAll, create, update, delete, filter

2. **useCategories**
   - Gestiona categorías
   - Inicializa categorías por defecto

3. **usePaymentMethods**
   - Gestiona métodos de pago
   - Inicializa métodos por defecto

4. **useDashboardStats**
   - Calcula estadísticas del dashboard
   - Actualiza automáticamente cuando cambian los gastos

## Validaciones

### Validación de Gastos
- **Monto**: Requerido, > 0, máximo 2 decimales
- **Descripción**: Requerido, mínimo 3 caracteres, máximo 200
- **Categoría**: Requerido, debe existir
- **Método de Pago**: Requerido, debe existir
- **Fecha**: Requerido, no puede ser futura

### Validación de Categorías
- **Nombre**: Requerido, único, mínimo 2 caracteres, máximo 50
- **Color**: Requerido, formato hexadecimal válido
- **Icono**: Requerido

## Casos de Uso Detallados

### UC-001: Registrar Gasto
**Actor**: Usuario
**Precondiciones**: Categorías y métodos de pago inicializados
**Flujo Principal**:
1. Usuario accede a "Nuevo Gasto"
2. Sistema muestra formulario
3. Usuario completa: monto, descripción, categoría, método de pago, fecha
4. Sistema valida datos
5. Sistema guarda gasto
6. Sistema muestra mensaje de éxito
7. Sistema redirige a lista de gastos

**Flujo Alternativo 3a**: Datos inválidos
- Sistema muestra mensajes de error
- Usuario corrige datos
- Continúa desde paso 4

### UC-002: Ver Dashboard
**Actor**: Usuario
**Precondiciones**: Ninguna
**Flujo Principal**:
1. Usuario accede a dashboard
2. Sistema carga gastos del mes actual
3. Sistema carga gastos del mes anterior
4. Sistema calcula estadísticas
5. Sistema muestra:
   - Total del mes actual
   - Comparación con mes anterior
   - Gráfico por categorías
   - Top 5 categorías

### UC-003: Filtrar Gastos
**Actor**: Usuario
**Precondiciones**: Existen gastos registrados
**Flujo Principal**:
1. Usuario accede a lista de gastos
2. Usuario aplica filtros (fecha, categoría, etc.)
3. Sistema filtra gastos
4. Sistema actualiza lista
5. Sistema actualiza URL con parámetros de filtro

## Consideraciones de Rendimiento

1. **Lazy Loading**: Cargar componentes de gráficos solo cuando se necesiten
2. **Memoización**: Usar React.memo y useMemo para componentes pesados
3. **Paginación**: Implementar paginación para listas grandes (>50 items)
4. **Debounce**: Aplicar debounce a búsquedas y filtros en tiempo real

## Seguridad y Validación

1. **Validación en Cliente**: React Hook Form con esquemas Zod/Yup
2. **Sanitización**: Limpiar inputs antes de guardar
3. **Validación de Tipos**: TypeScript para type safety
4. **Manejo de Errores**: Try-catch en servicios, mensajes amigables

## Testing (Futuro)

### Unit Tests
- Servicios (expense, category, paymentMethod, dashboard)
- Utilidades (format, storage)

### Integration Tests
- Flujos completos (crear gasto, filtrar, dashboard)

### E2E Tests
- Flujos críticos del usuario

## Mejoras Futuras

1. **Backend API**: Migrar de LocalStorage a API REST
2. **Autenticación**: Sistema de usuarios
3. **Presupuestos**: Establecer límites por categoría
4. **Exportación**: Exportar datos a CSV/Excel
5. **Notificaciones**: Recordatorios de gastos
6. **Multi-moneda**: Soporte para diferentes monedas
7. **Sincronización**: Sincronización en la nube

