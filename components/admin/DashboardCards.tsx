'use client';

import type { DashboardStats } from '@/lib/api';
import { ShoppingCart, CreditCard, Clock, DollarSign } from 'lucide-react';

interface DashboardCardsProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

const cards = [
  { key: 'totalOrdersToday' as const, label: 'Total Orders Today', icon: ShoppingCart, color: 'text-blue-600' },
  { key: 'paidOrders' as const, label: 'Paid Orders', icon: CreditCard, color: 'text-green-600' },
  { key: 'pendingPayments' as const, label: 'Pending Payments', icon: Clock, color: 'text-yellow-600' },
  { key: 'revenue' as const, label: 'Revenue Today', icon: DollarSign, color: 'text-emerald-600', isCurrency: true },
];

export function DashboardCards({ stats, isLoading }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, color, isCurrency }) => (
        <div
          key={key}
          className="bg-card border border-border rounded-xl p-6 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <Icon className={`w-5 h-5 ${color}`} />
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
