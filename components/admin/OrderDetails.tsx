'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Order } from '@/lib/mockData';
import { StatusBadge } from './StatusBadge';
import { useOrdersStore } from '@/lib/stores/ordersStore';
import { getOrderById } from '@/lib/api';
import {
  CheckCircle,
  XCircle,
  Edit3,
  Send,
  AlertTriangle,
  Phone,
  MapPin,
  Package,
  Clock,
} from 'lucide-react';
import { ActivityLog } from './ActivityLog';
import { ChatPanel } from './ChatPanel';

interface OrderDetailsProps {
  orderId: string;
}

export function OrderDetails({ orderId }: OrderDetailsProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'chat' | 'activity'>('details');
  const { updateStatus, cancelOrder, flagAsFraud, resendPaymentLink } = useOrdersStore();

  const loadOrder = useCallback(async () => {
    setIsLoading(true);
    const data = await getOrderById(orderId);
    setOrder(data);
    setIsLoading(false);
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleAction = async (action: () => Promise<void>) => {
    await action();
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

  const tabs = [
    { id: 'details' as const, label: 'Details' },
    { id: 'chat' as const, label: 'Chat' },
    { id: 'activity' as const, label: 'Activity' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-foreground">{order.id}</h2>
          <div className="flex items-center gap-2">
            <StatusBadge type="order" status={order.status} />
            {order.reviewStatus && (
              <StatusBadge type="review" status={order.reviewStatus} />
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'details' && (
          <div className="p-4 sm:p-6 space-y-6">
            {/* Customer Info */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Customer
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">{order.customerPhone}</span>
                </div>
                <p className="text-sm text-foreground ml-6">{order.customerName}</p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {order.location.area}, {order.location.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Items
              </h3>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × ₦{item.unitPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      ₦{(item.quantity * item.unitPrice).toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground">
                    ₦{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment & Status */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Payment
              </h3>
              <div className="flex items-center gap-3">
                <StatusBadge type="payment" status={order.paymentStatus} />
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  Updated {new Date(order.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {order.status !== 'paid' && order.status !== 'delivered' && order.status !== 'flagged' && (
                  <button
                    onClick={() => handleAction(() => updateStatus(order.id, 'paid'))}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Paid
                  </button>
                )}
                {order.status === 'paid' && (
                  <button
                    onClick={() => handleAction(() => updateStatus(order.id, 'processing'))}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    Start Processing
                  </button>
                )}
                {order.status === 'processing' && (
                  <button
                    onClick={() => handleAction(() => updateStatus(order.id, 'delivered'))}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Delivered
                  </button>
                )}
                {(order.status === 'pending_payment' || order.paymentStatus === 'failed') && (
                  <button
                    onClick={() => handleAction(() => resendPaymentLink(order.id))}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Resend Link
                  </button>
                )}
                {(order.status as string) !== 'delivered' && (order.status as string) !== 'flagged' && (
                  <button
                    onClick={() => handleAction(() => cancelOrder(order.id))}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium border border-destructive text-destructive rounded-lg hover:bg-destructive/5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Order
                  </button>
                )}
                {(order.status as string) !== 'flagged' && (
                  <button
                    onClick={() => handleAction(() => flagAsFraud(order.id))}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium border border-red-500 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Flag as Fraud
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <ChatPanel customerPhone={order.customerPhone} />
        )}

        {activeTab === 'activity' && (
          <ActivityLog entries={order.activityLog} />
        )}
      </div>
    </div>
  );
}
