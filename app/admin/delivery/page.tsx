'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/utils/auth';
import { useOrdersStore } from '@/lib/stores/ordersStore';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { MapPin, Package, Truck, CheckCircle } from 'lucide-react';
import type { Order, OrderStatus } from '@/lib/mockData';

function groupByCity(orders: Order[]): Record<string, Order[]> {
  const map: Record<string, Order[]> = {};
  for (const order of orders) {
    const city = order.location.city;
    if (!map[city]) map[city] = [];
    map[city].push(order);
  }
  return map;
}

function getDeliveryStatus(order: Order): 'processing' | 'out_for_delivery' | 'delivered' {
  if (order.status === 'delivered') return 'delivered';
  if (order.status === 'processing') return 'processing';
  return 'processing';
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

  // Only show orders that need delivery attention (paid, processing, delivered)
  const deliveryOrders = orders.filter(
    (o) => o.status === 'paid' || o.status === 'processing' || o.status === 'delivered'
  );
  const grouped = groupByCity(deliveryOrders);
  const cities = Object.keys(grouped).sort();

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
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
            <span className="text-sm font-medium text-muted-foreground">Processing</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {deliveryOrders.filter((o) => o.status === 'paid' || o.status === 'processing').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Truck className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Cities</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{cities.length}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Delivered</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {deliveryOrders.filter((o) => o.status === 'delivered').length}
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
                {/* City Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-secondary/20 border-b border-border">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h2 className="font-semibold text-foreground">{city}</h2>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {cityOrders.length} orders
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    ₦{cityOrders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString()}
                  </span>
                </div>

                {/* Orders */}
                <div className="divide-y divide-border">
                  {cityOrders.map((order) => (
                    <div key={order.id} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-foreground">{order.id}</span>
                            <StatusBadge type="delivery" status={getDeliveryStatus(order)} />
                          </div>
                          <p className="text-sm text-foreground">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.location.area}</p>
                          <div className="text-xs text-muted-foreground mt-1">
                            {order.items.map((item) => `${item.quantity}× ${item.name}`).join(', ')}
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex flex-col gap-1.5">
                          {order.status === 'paid' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'processing')}
                              className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Start Processing
                            </button>
                          )}
                          {order.status === 'processing' && (
                            <button
                              onClick={() => handleStatusChange(order.id, 'delivered')}
                              className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                              Mark Delivered
                            </button>
                          )}
                          {order.status === 'delivered' && (
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
