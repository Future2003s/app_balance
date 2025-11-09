# Estructura de Componentes

## Componentes UI Base

### Button (`src/components/ui/Button.tsx`)
- Botón reutilizable con variantes
- Props: variant (primary, secondary, danger), size, disabled, onClick

### Input (`src/components/ui/Input.tsx`)
- Campo de entrada de texto
- Props: label, type, value, onChange, error, placeholder

### Select (`src/components/ui/Select.tsx`)
- Selector desplegable
- Props: label, options, value, onChange, error

### Card (`src/components/ui/Card.tsx`)
- Tarjeta contenedora
- Props: title, children, className

### Modal (`src/components/ui/Modal.tsx`)
- Diálogo modal
- Props: isOpen, onClose, title, children

### Badge (`src/components/ui/Badge.tsx`)
- Badge para mostrar etiquetas
- Props: color, children

## Componentes de Gastos

### ExpenseList (`src/components/expenses/ExpenseList.tsx`)
- Lista de gastos con tabla
- Muestra: fecha, descripción, categoría, monto, método de pago
- Acciones: editar, eliminar

### ExpenseForm (`src/components/expenses/ExpenseForm.tsx`)
- Formulario para crear/editar gastos
- Campos: monto, descripción, categoría, método de pago, fecha
- Validación con React Hook Form

### ExpenseFilters (`src/components/expenses/ExpenseFilters.tsx`)
- Panel de filtros para gastos
- Filtros: fecha, categoría, método de pago, monto, búsqueda

### ExpenseCard (`src/components/expenses/ExpenseCard.tsx`)
- Tarjeta individual de gasto
- Muestra información resumida del gasto

## Componentes de Dashboard

### StatsCard (`src/components/dashboard/StatsCard.tsx`)
- Tarjeta de estadística
- Muestra: título, valor, cambio porcentual, icono

### CategoryChart (`src/components/dashboard/CategoryChart.tsx`)
- Gráfico de gastos por categoría (gráfico de pastel)
- Usa Recharts

### MonthlyChart (`src/components/dashboard/MonthlyChart.tsx`)
- Gráfico de gastos mensuales (gráfico de barras)
- Muestra últimos 6 meses

### TopCategories (`src/components/dashboard/TopCategories.tsx`)
- Lista de top 5 categorías con más gastos
- Muestra barra de progreso por categoría

## Componentes de Categorías

### CategoryList (`src/components/categories/CategoryList.tsx`)
- Lista de categorías
- Muestra: nombre, color, icono
- Acciones: editar, eliminar

### CategoryForm (`src/components/categories/CategoryForm.tsx`)
- Formulario para crear/editar categorías
- Campos: nombre, color, icono

## Layouts

### DashboardLayout (`src/components/layouts/DashboardLayout.tsx`)
- Layout principal del dashboard
- Incluye: header, sidebar, contenido principal

### Header (`src/components/layouts/Header.tsx`)
- Encabezado de la aplicación
- Navegación principal

### Sidebar (`src/components/layouts/Sidebar.tsx`)
- Barra lateral de navegación
- Enlaces a: Dashboard, Gastos, Categorías, Análisis

