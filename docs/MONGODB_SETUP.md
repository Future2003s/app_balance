# Configuración de MongoDB

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
MONGODB_URI=mongodb+srv://minhyii:MinhYi1210@application.mhjgmga.mongodb.net/?appName=Application
MONGODB_DB_NAME=quan-ly-chi-tieu
```

## Estructura Implementada

### Modelos MongoDB

- `src/models/Expense.ts` - Modelo para gastos
- `src/models/Category.ts` - Modelo para categorías
- `src/models/PaymentMethod.ts` - Modelo para métodos de pago

### API Routes

- `src/app/api/expenses/` - CRUD de gastos
- `src/app/api/categories/` - CRUD de categorías
- `src/app/api/payment-methods/` - CRUD de métodos de pago
- `src/app/api/init/` - Inicialización de datos por defecto

### Servicios Actualizados

Todos los servicios ahora usan MongoDB a través de las APIs:

- `expenseService` - Funciones async
- `categoryService` - Funciones async
- `paymentMethodService` - Funciones async
- `dashboardService` - Funciones async

## Notas Importantes

⚠️ **IMPORTANTE**: Los componentes que usan estos servicios necesitan ser actualizados para manejar funciones async.

Ejemplo de actualización necesaria:

**Antes:**

```typescript
const expenses = expenseService.getAll();
```

**Después:**

```typescript
const expenses = await expenseService.getAll();
```

O en componentes React:

```typescript
useEffect(() => {
  const loadData = async () => {
    const data = await expenseService.getAll();
    setExpenses(data);
  };
  loadData();
}, []);
```

## Inicialización

La primera vez que se ejecute la aplicación, los datos por defecto (categorías y métodos de pago) se inicializarán automáticamente cuando se acceda a las categorías o métodos de pago.
