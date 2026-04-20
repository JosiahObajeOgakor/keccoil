'use client';

import type { Order } from '@/lib/mockData';
import { StatusBadge } from './StatusBadge';
import { Search } from 'lucide-react';
import { useOrdersStore } from '@/lib/stores/ordersStore';
import type { OrderStatus } from '@/lib/mockData';

const STATUS_FILTERS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending_payment', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'processing', label: 'Processing' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'flagged', label: 'Flagged' },
];

interface OrderListProps {
  orders: Order[];
  selectedOrderId: string | null;
  onSelectOrder: (id: string) => void;
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
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{order.id}</span>
                    {order.isNew && (
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <StatusBadge type="order" status={order.status} />
                </div>
                <p className="text-sm text-foreground truncate">{order.customerName}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                  <p className="text-sm font-medium text-foreground">
                    ₦{order.totalAmount.toLocaleString()}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {order.location.city}, {order.location.area}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
