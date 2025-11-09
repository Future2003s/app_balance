import { PaymentMethod } from '../types';

// Métodos de pago predefinidos
export const DEFAULT_PAYMENT_METHODS: Omit<PaymentMethod, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'pm-1',
    name: 'Efectivo',
    icon: 'Banknote',
  },
  {
    id: 'pm-2',
    name: 'Tarjeta de Crédito',
    icon: 'CreditCard',
  },
  {
    id: 'pm-3',
    name: 'Tarjeta de Débito',
    icon: 'CreditCard',
  },
  {
    id: 'pm-4',
    name: 'Transferencia',
    icon: 'ArrowLeftRight',
  },
  {
    id: 'pm-5',
    name: 'Otros',
    icon: 'MoreHorizontal',
  },
];

