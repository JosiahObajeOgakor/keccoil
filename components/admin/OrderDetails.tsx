'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Order } from '@/lib/types';
import { formatPrice } from '@/lib/constants';
import { StatusBadge } from './StatusBadge';
import { useOrdersStore } from '@/lib/stores/ordersStore';
import { getOrderById } from '@/lib/api';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Phone,
  MapPin,
  Package,
  Clock,
  Truck,
} from 'lucide-react';

interface OrderDetailsProps {
  orderId: number;
}

export function OrderDetails({ orderId }: OrderDetailsProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { updateStatus } = useOrdersStore();

  const loadOrder = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getOrderById(orderId);
      setOrder(data);
    } catch {
      setOrder(null);
    }
    setIsLoading(false);
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleStatusChange = async (status: Order['status']) => {
    await updateStatus(orderId, status);
    await loadOrder();
  };

  if (isLoading) {
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-foreground">Order #{order.id}</h2>
          <StatusBadge type="order" status={order.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {new Date(order.created_at).toLocaleString()}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Customer Info */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Customer
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">{order.user?.phone}</span>
            </div>
            <p className="text-sm text-foreground ml-6">{order.user?.name || 'Unknown'}</p>
            {order.user?.email && (
              <p className="text-xs text-muted-foreground ml-6">{order.user.email}</p>
            )}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">
                {order.delivery_area}, {order.delivery_city}
              </span>
            </div>
            {order.delivery_address && (
              <p className="text-xs text-muted-foreground ml-6">{order.delivery_address}</p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Items
          </h3>
          <div className="space-y-2">
            {order.items?.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × {formatPrice(item.unit_price)}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {formatPrice(item.quantity * item.unit_price)}
                </p>
              </div>
            ))}
            {order.delivery_fee > 0 && (
              <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Delivery Fee</p>
                </div>
                <p className="text-sm text-foreground">{formatPrice(order.delivery_fee)}</p>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Channel</span>
              <span className="text-foreground capitalize">{order.channel}</span>
            </div>
            {order.payment_ref && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Ref</span>
                <span className="text-foreground font-mono text-xs">{order.payment_ref}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              Updated {new Date(order.updated_at).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Actions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {order.status === 'PENDING' && (
              <button
                onClick={() => handleStatusChange('CONFIRMED')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm
              </button>
            )}
            {order.status === 'CONFIRMED' && (
              <button
                onClick={() => handleStatusChange('PAID')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Mark Paid
              </button>
            )}
            {order.status === 'PAID' && (
              <button
                onClick={() => handleStatusChange('SHIPPED')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Truck className="w-4 h-4" />
                Ship
              </button>
            )}
            {order.status === 'SHIPPED' && (
              <button
                onClick={() => handleStatusChange('DELIVERED')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Mark Delivered
              </button>
            )}
            {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.status !== 'FLAGGED' && (
              <button
                onClick={() => handleStatusChange('CANCELLED')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium border border-destructive text-destructive rounded-lg hover:bg-destructive/5 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
            )}
            {order.status !== 'FLAGGED' && (
              <button
                onClick={() => handleStatusChange('FLAGGED')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium border border-red-500 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                Flag Fraud
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
