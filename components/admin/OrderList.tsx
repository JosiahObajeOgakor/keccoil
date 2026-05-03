'use client';

import type { Order, OrderStatus } from '@/lib/types';
import { formatPrice } from '@/lib/constants';
import { StatusBadge } from './StatusBadge';
import { Search } from 'lucide-react';
import { useOrdersStore } from '@/lib/stores/ordersStore';

const STATUS_FILTERS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PAID', label: 'Paid' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'FLAGGED', label: 'Flagged' },
];

interface OrderListProps {
  orders: Order[];
  selectedOrderId: number | null;
  onSelectOrder: (id: number) => void;
  isLoading: boolean;
}

export function OrderList({ orders, selectedOrderId, onSelectOrder, isLoading }: OrderListProps) {
  const { filters, setFilters } = useOrdersStore();

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by phone, name, or ID..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Status Filters */}
      <div className="px-4 py-3 border-b border-border flex gap-1.5 overflow-x-auto">
        {STATUS_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilters({ status: value })}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
              filters.status === value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Order Items */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-secondary/30 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No orders found
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => onSelectOrder(order.id)}
                className={`w-full text-left p-4 hover:bg-secondary/30 transition-colors ${
                  selectedOrderId === order.id ? 'bg-secondary/50 border-l-2 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="font-medium text-sm text-foreground">#{order.id}</span>
                  <StatusBadge type="order" status={order.status} />
                </div>
                <p className="text-sm text-foreground truncate">{order.user ? order.user.name : 'Unknown'}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{order.user ? order.user.phone : ''}</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatPrice(order.total_amount)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {order.delivery_city}, {order.delivery_area}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
