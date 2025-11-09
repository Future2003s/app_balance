import { Category } from '../types';

// Categorías predefinidas del sistema
export const DEFAULT_CATEGORIES: Omit<Category, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'cat-1',
    name: 'Alimentación',
    color: '#EF4444',
    icon: 'UtensilsCrossed',
  },
  {
    id: 'cat-2',
    name: 'Transporte',
    color: '#3B82F6',
    icon: 'Car',
  },
  {
    id: 'cat-3',
    name: 'Entretenimiento',
    color: '#8B5CF6',
    icon: 'Film',
  },
  {
    id: 'cat-4',
    name: 'Salud',
    color: '#10B981',
    icon: 'Heart',
  },
  {
    id: 'cat-5',
    name: 'Educación',
    color: '#F59E0B',
    icon: 'GraduationCap',
  },
  {
    id: 'cat-6',
    name: 'Ropa',
    color: '#EC4899',
    icon: 'Shirt',
  },
  {
    id: 'cat-7',
    name: 'Vivienda',
    color: '#14B8A6',
    icon: 'Home',
  },
  {
    id: 'cat-8',
    name: 'Otros',
    color: '#6B7280',
    icon: 'MoreHorizontal',
  },
];

