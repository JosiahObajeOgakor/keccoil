'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/utils/auth';
import { useOrdersStore } from '@/lib/stores/ordersStore';
import { OrderList } from '@/components/admin/OrderList';
import { OrderDetails } from '@/components/admin/OrderDetails';
import { X } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const { orders, selectedOrderId, isLoading, fetchOrders, selectOrder, startPolling, stopPolling } =
    useOrdersStore();

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchOrders();
    startPolling(10000);
    return () => stopPolling();
  }, [router, fetchOrders, startPolling, stopPolling]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage and track all customer orders
        </p>
      </div>

      <div className="flex gap-0 bg-card border border-border rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
        {/* Left: Order List */}
        <div
          className={`${
            selectedOrderId ? 'hidden lg:flex' : 'flex'
          } flex-col w-full lg:w-95 lg:min-w-95 border-r border-border`}
        >
          <OrderList
            orders={orders}
            selectedOrderId={selectedOrderId}
            onSelectOrder={selectOrder}
            isLoading={isLoading}
          />
        </div>

        {/* Right: Order Details */}
        <div
          className={`${
            selectedOrderId ? 'flex' : 'hidden lg:flex'
          } flex-col flex-1 min-w-0`}
        >
          {selectedOrderId ? (
            <div className="relative h-full">
              {/* Close button (mobile) */}
              <button
                onClick={() => selectOrder(null)}
                className="lg:hidden absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <OrderDetails orderId={selectedOrderId} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Select an order to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
