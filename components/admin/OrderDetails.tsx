'use client';

import { useEffect, useState } from 'react';
import type { Order, OrderStatus } from '@/lib/types';
import { getOrderById, updateOrderStatus } from '@/lib/api';

const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PAID', 'CANCELLED'],
  PAID: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
  FLAGGED: ['CONFIRMED', 'CANCELLED'],
};

export function OrderDetails({ orderId }: { orderId: number }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOrderById(orderId)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  async function handleStatusChange(status: OrderStatus) {
    if (!order) return;
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, status);
      setOrder({ ...order, status });
    } catch {
      // ignore
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-32 bg-secondary/30 rounded animate-pulse" />
        <div className="h-4 w-48 bg-secondary/30 rounded animate-pulse" />
        <div className="h-32 bg-secondary/30 rounded animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Order not found
      </div>
    );
  }

  const nextStatuses = NEXT_STATUSES[order.status] || [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-foreground">Order #{order.id}</h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground">
            {order.status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Customer */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Customer</h3>
          <p className="text-sm text-foreground">{order.user ? order.user.name : 'Unknown'}</p>
          <p className="text-xs text-muted-foreground">{order.user ? order.user.phone : '—'}</p>
          {order.delivery_area ? (
            <p className="text-xs text-muted-foreground mt-1">{order.delivery_area}, {order.delivery_city}</p>
          ) : null}
        </div>

        {/* Items */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items</h3>
          <div className="space-y-2">
            {order.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-foreground">{item.product_name || 'Product'} × {item.quantity}</span>
                <span className="text-muted-foreground">₦{(item.unit_price * item.quantity).toLocaleString()}</span>
              </div>
            )) ?? <p className="text-sm text-muted-foreground">No items</p>}
          </div>
          <div className="mt-3 pt-3 border-t border-border flex justify-between font-semibold text-sm">
            <span>Total</span>
            <span>₦{order.total_amount ? order.total_amount.toLocaleString() : '0'}</span>
          </div>
        </div>

        {/* Status Actions */}
        {nextStatuses.length > 0 ? (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {nextStatuses.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
