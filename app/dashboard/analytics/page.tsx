'use client';

import { useEffect, useState } from 'react';
import { getTenantAnalyticsOverview } from '@/lib/api';
import { formatPrice } from '@/lib/constants';
import type { TenantAnalyticsOverview } from '@/lib/types';
import { BarChart3, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState<TenantAnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTenantAnalyticsOverview()
      .then(setData)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6">Analytics</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-card border border-border rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6">Analytics</h1>
        <p className="text-muted-foreground">Unable to load analytics data.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Business performance insights</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Total Orders</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{data.total_orders}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Revenue</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatPrice(data.revenue_kobo)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Avg Order Value</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{formatPrice(data.avg_order_value)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Active Products</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{data.active_products}</p>
        </div>
      </div>

      {/* Top Products */}
      {data.top_products && data.top_products.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Top Products by Revenue</h2>
          <div className="space-y-4">
            {data.top_products.map((product, i) => {
              const maxRevenue = data.top_products[0]?.revenue || 1;
              const percentage = (product.revenue / maxRevenue) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{product.name}</span>
                    <span className="text-sm text-muted-foreground">{product.orders} orders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-foreground min-w-[80px] text-right">
                      {formatPrice(product.revenue)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
