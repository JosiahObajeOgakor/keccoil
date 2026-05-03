'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/utils/auth';
import { useOrdersStore } from '@/lib/stores/ordersStore';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { formatPrice } from '@/lib/constants';
import { MapPin, Package, Truck, CheckCircle } from 'lucide-react';
import type { Order, OrderStatus } from '@/lib/types';

function groupByCity(orders: Order[]): Record<string, Order[]> {
  const map: Record<string, Order[]> = {};
  for (const order of orders) {
    const city = order.delivery_city || 'Unknown';
    if (!map[city]) map[city] = [];
    map[city].push(order);
  }
  return map;
}

export default function DeliveryPage() {
  const router = useRouter();
  const { orders, isLoading, fetchOrders, updateStatus } = useOrdersStore();

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchOrders();
  }, [router, fetchOrders]);

  const deliveryOrders = orders.filter(
    (o) => o.status === 'PAID' || o.status === 'SHIPPED' || o.status === 'DELIVERED'
  );
  const grouped = groupByCity(deliveryOrders);
  const cities = Object.keys(grouped).sort();

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    await updateStatus(orderId, newStatus);
    await fetchOrders();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Delivery</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track and manage order deliveries by location
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">To Ship</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {deliveryOrders.filter((o) => o.status === 'PAID').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Truck className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Shipped</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {deliveryOrders.filter((o) => o.status === 'SHIPPED').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Delivered</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {deliveryOrders.filter((o) => o.status === 'DELIVERED').length}
          </p>
        </div>
      </div>

      {/* Grouped by City */}
      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-secondary/30 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : cities.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">No delivery orders yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {cities.map((city) => {
            const cityOrders = grouped[city];
            return (
              <div key={city} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-secondary/20 border-b border-border">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h2 className="font-semibold text-foreground">{city}</h2>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {cityOrders.length} orders
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatPrice(cityOrders.reduce((s, o) => s + o.total_amount, 0))}
                  </span>
                </div>

                <div className="divide-y divide-border">
                  {cityOrders.map((order) => (
                    <div key={order.id} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-foreground">#{order.id}</span>
                            <StatusBadge type="order" status={order.status} />
                          </div>
                          <p className="text-sm text-foreground">{order.user ? order.user.name : 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{order.delivery_area}</p>
                          <div className="text-xs text-muted-foreground mt-1">
                            {order.items ? order.items.map((item) => `${item.quantity}× ${item.product_name}`).join(', ') : ''}
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col gap-1.5">
                          {order.status === 'PAID' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'SHIPPED')}
                              className="px-3 py-1.5 text-xs font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              Mark Shipped
                            </button>
                          )}
                          {order.status === 'SHIPPED' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'DELIVERED')}
                              className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              Mark Delivered
                            </button>
                          )}
                          {order.status === 'DELIVERED' && (
                            <span className="text-xs text-emerald-600 font-medium">✓ Complete</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
