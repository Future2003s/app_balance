// Cargador optimizado de iconos de Lucide
// Importa solo los iconos necesarios de forma estática para tree-shaking

import {
  UtensilsCrossed,
  Car,
  Film,
  Heart,
  GraduationCap,
  Shirt,
  Home,
  ShoppingBag,
  Coffee,
  Plane,
  Gamepad2,
  Music,
  Book,
  Dumbbell,
  Briefcase,
  Gift,
  MoreHorizontal,
  Banknote,
  CreditCard,
  Wallet,
  ArrowLeftRight,
  Smartphone,
  Building2,
  Landmark,
  type LucideIcon,
} from "lucide-react";

// Mapa de iconos disponibles
const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  Film,
  Heart,
  GraduationCap,
  Shirt,
  Home,
  ShoppingBag,
  Coffee,
  Plane,
  Gamepad2,
  Music,
  Book,
  Dumbbell,
  Briefcase,
  Gift,
  MoreHorizontal,
  Banknote,
  CreditCard,
  Wallet,
  ArrowLeftRight,
  Smartphone,
  Building2,
  Landmark,
};

/**
 * Obtiene un icono de forma optimizada
 */
export function loadIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || MoreHorizontal;
}

