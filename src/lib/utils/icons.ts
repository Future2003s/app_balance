// Helper para importar iconos de Lucide de forma optimizada
import type { LucideIcon } from "lucide-react";

// Cache de iconos cargados
const iconCache = new Map<string, LucideIcon>();

// Importaciones dinámicas de iconos comunes
const iconImports: Record<string, () => Promise<{ default: LucideIcon }>> = {
  UtensilsCrossed: () => import("lucide-react").then((m) => ({ default: m.UtensilsCrossed })),
  Car: () => import("lucide-react").then((m) => ({ default: m.Car })),
  Film: () => import("lucide-react").then((m) => ({ default: m.Film })),
  Heart: () => import("lucide-react").then((m) => ({ default: m.Heart })),
  GraduationCap: () => import("lucide-react").then((m) => ({ default: m.GraduationCap })),
  Shirt: () => import("lucide-react").then((m) => ({ default: m.Shirt })),
  Home: () => import("lucide-react").then((m) => ({ default: m.Home })),
  ShoppingBag: () => import("lucide-react").then((m) => ({ default: m.ShoppingBag })),
  Coffee: () => import("lucide-react").then((m) => ({ default: m.Coffee })),
  Plane: () => import("lucide-react").then((m) => ({ default: m.Plane })),
  Gamepad2: () => import("lucide-react").then((m) => ({ default: m.Gamepad2 })),
  Music: () => import("lucide-react").then((m) => ({ default: m.Music })),
  Book: () => import("lucide-react").then((m) => ({ default: m.Book })),
  Dumbbell: () => import("lucide-react").then((m) => ({ default: m.Dumbbell })),
  Briefcase: () => import("lucide-react").then((m) => ({ default: m.Briefcase })),
  Gift: () => import("lucide-react").then((m) => ({ default: m.Gift })),
  MoreHorizontal: () => import("lucide-react").then((m) => ({ default: m.MoreHorizontal })),
  Banknote: () => import("lucide-react").then((m) => ({ default: m.Banknote })),
  CreditCard: () => import("lucide-react").then((m) => ({ default: m.CreditCard })),
  Wallet: () => import("lucide-react").then((m) => ({ default: m.Wallet })),
  ArrowLeftRight: () => import("lucide-react").then((m) => ({ default: m.ArrowLeftRight })),
  Smartphone: () => import("lucide-react").then((m) => ({ default: m.Smartphone })),
  Building2: () => import("lucide-react").then((m) => ({ default: m.Building2 })),
  Landmark: () => import("lucide-react").then((m) => ({ default: m.Landmark })),
};

/**
 * Obtiene un icono de forma optimizada con cache
 */
export async function getIcon(iconName: string): Promise<LucideIcon> {
  // Si ya está en cache, retornarlo
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!;
  }

  // Si existe la importación, cargarla
  if (iconImports[iconName]) {
    const iconModule = await iconImports[iconName]();
    iconCache.set(iconName, iconModule.default);
    return iconModule.default;
  }

  // Fallback: importar MoreHorizontal
  const { MoreHorizontal } = await import("lucide-react");
  iconCache.set(iconName, MoreHorizontal);
  return MoreHorizontal;
}

/**
 * Obtiene un icono de forma síncrona (solo si ya está cargado)
 */
export function getIconSync(iconName: string): LucideIcon | null {
  return iconCache.get(iconName) || null;
}

