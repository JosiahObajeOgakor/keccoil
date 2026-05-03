'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { getTenantAnalyticsOverview } from '@/lib/api';
import { formatPrice } from '@/lib/constants';
import type { TenantAnalyticsOverview } from '@/lib/types';
import { ShoppingCart, DollarSign, Package, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<TenantAnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTenantAnalyticsOverview()
      .then(setStats)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const cards = [
    {
      label: 'Total Orders',
      value: stats?.total_orders ?? 0,
      icon: ShoppingCart,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      label: 'Revenue',
      value: stats ? formatPrice(stats.total_revenue) : '₦0.00',
      icon: DollarSign,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
    },
    {
      label: 'Active Products',
      value: stats?.active_products ?? 0,
      icon: Package,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      label: 'Pending Orders',
      value: stats?.pending_orders ?? 0,
      icon: Clock,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
    },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.name?.split(' ')[0] ?? 'there'}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here&apos;s an overview of your business activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            {isLoading ? (
              <div className="h-7 w-20 bg-secondary/50 rounded animate-pulse" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Top Products */}
      {stats?.top_products && stats.top_products.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Top Products</h2>
          <div className="space-y-3">
            {stats.top_products.map((product, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.orders} orders</p>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {formatPrice(product.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
