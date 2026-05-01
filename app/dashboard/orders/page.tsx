'use client';

import { useEffect } from 'react';
import { useTenantOrdersStore } from '@/lib/stores/tenantOrdersStore';
import { formatPrice } from '@/lib/constants';
import { X, Download } from 'lucide-react';
import { exportTenantOrdersCSV } from '@/lib/api';

const STATUS_OPTIONS = ['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function TenantOrdersPage() {
  const {
    orders, total, page, limit, selectedOrderId, selectedOrder,
    filters, isLoading, fetchOrders, selectOrder, setFilters, setPage, updateStatus,
  } = useTenantOrdersStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleExportCSV = async () => {
    const res = await exportTenantOrdersCSV();
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track customer orders</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 border border-border text-foreground font-medium rounded-lg hover:bg-secondary transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status || 'all'}
            onClick={() => setFilters({ status })}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              filters.status === status
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex gap-0 bg-card border border-border rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 240px)' }}>
        {/* Order List */}
        <div className={`${selectedOrderId ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-96 lg:min-w-96 border-r border-border`}>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No orders found</div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => selectOrder(order.id)}
                  className={`w-full p-4 text-left hover:bg-secondary/50 transition-colors ${
                    selectedOrderId === order.id ? 'bg-secondary/70' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">#{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{order.customer_name || order.customer_phone}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{formatPrice(order.total_amount)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="text-xs px-3 py-1.5 rounded border border-border disabled:opacity-50 hover:bg-secondary transition-colors"
              >
                Prev
              </button>
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="text-xs px-3 py-1.5 rounded border border-border disabled:opacity-50 hover:bg-secondary transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Order Detail */}
        <div className={`${selectedOrderId ? 'flex' : 'hidden lg:flex'} flex-col flex-1 min-w-0`}>
          {selectedOrder ? (
            <div className="relative h-full overflow-y-auto p-6">
              <button
                onClick={() => selectOrder(null)}
                className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Order #{selectedOrder.id}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Created {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Status Update */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">Status:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                    className="px-3 py-1.5 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                {/* Customer */}
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Customer</h3>
                  <p className="text-sm text-foreground">{selectedOrder.customer_name || 'Unknown'}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer_phone}</p>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm text-foreground">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-foreground">{formatPrice(item.unit_price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground">{formatPrice(selectedOrder.total_amount)}</span>
                </div>
              </div>
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

function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'PENDING': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'CONFIRMED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'SHIPPED': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    case 'DELIVERED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'CANCELLED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
  }
}
