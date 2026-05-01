'use client';

import Image from 'next/image';
import type { DashboardStats } from '@/lib/api';
import { ShoppingCart, CreditCard, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Nairalogo from '@/public/naira-sign.png';

interface DashboardCardsProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

const cards: { key: 'totalOrders' | 'paidOrders' | 'pendingOrders' | 'revenue'; label: string; icon?: LucideIcon; image?: typeof Nairalogo; color: string; isCurrency?: boolean }[] = [
  { key: 'totalOrders', label: 'Total Orders Today', icon: ShoppingCart, color: 'text-blue-600' },
  { key: 'paidOrders', label: 'Paid Orders', icon: CreditCard, color: 'text-green-600' },
  { key: 'pendingOrders', label: 'Pending Orders', icon: Clock, color: 'text-yellow-600' },
  { key: 'revenue', label: 'Revenue Today', image: Nairalogo, color: 'text-emerald-600', isCurrency: true },
];

export function DashboardCards({ stats, isLoading }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, image, color, isCurrency }) => (
        <div
          key={key}
          className="bg-card border border-border rounded-xl p-6 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            {Icon ? (
              <Icon className={`w-5 h-5 ${color}`} />
            ) : image ? (
              <Image src={image} alt={label} className="w-5 h-5" width={20} height={20} />
            ) : null}
          </div>
          {isLoading ? (
            <div className="h-9 w-24 bg-secondary/50 rounded animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-foreground">
              {isCurrency ? `₦${(stats?.[key] ?? 0).toLocaleString()}` : (stats?.[key] ?? 0)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
