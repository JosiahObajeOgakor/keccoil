'use client';

import { useEffect } from 'react';
import { useTenantCustomersStore } from '@/lib/stores/tenantCustomersStore';
import { formatPrice } from '@/lib/constants';
import { Search, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function TenantCustomersPage() {
  const {
    customers, total, page, limit, search, selectedCustomer, customerOrders,
    isLoading, fetchCustomers, setSearch, setPage, selectCustomer, clearSelection,
  } = useTenantCustomersStore();

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const totalPages = Math.ceil(total / limit);

  if (selectedCustomer) {
    return (
      <div>
        <button
          onClick={clearSelection}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to customers
        </button>

        {/* Customer Info */}
        <div className="bg-card border border-border rounded-xl p-6 max-w-2xl mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">{selectedCustomer.name || 'Unknown'}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Phone</span>
              <p className="font-medium text-foreground">{selectedCustomer.phone}</p>
            </div>
            {selectedCustomer.email && (
              <div>
                <span className="text-muted-foreground">Email</span>
                <p className="font-medium text-foreground">{selectedCustomer.email}</p>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Total Orders</span>
              <p className="font-medium text-foreground">{selectedCustomer.total_orders}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Total Spent</span>
              <p className="font-medium text-foreground">{formatPrice(selectedCustomer.total_spent)}</p>
            </div>
            {selectedCustomer.last_order_at && (
              <div>
                <span className="text-muted-foreground">Last Order</span>
                <p className="font-medium text-foreground">{new Date(selectedCustomer.last_order_at).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Orders */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Orders ({customerOrders.length})</h3>
          </div>
          {customerOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders found</p>
          ) : (
            <div className="space-y-3 max-w-2xl">
              {customerOrders.map((order) => (
                <div key={order.id} className="p-4 bg-card border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-foreground">#{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-foreground space-y-1">
                    {order.items?.map((item, i) => (
                      <p key={i}>{item.quantity}× {item.product_name}</p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    <span className="font-medium text-foreground text-sm">{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground text-sm mt-1">View and manage your customers</p>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No customers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Spent</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => selectCustomer(customer.id)}
                    className="hover:bg-secondary/20 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">{customer.name || 'Unknown'}</p>
                      {customer.email && <p className="text-xs text-muted-foreground">{customer.email}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{customer.phone}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{customer.total_orders}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{formatPrice(customer.total_spent)}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {customer.last_order_at ? new Date(customer.last_order_at).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="text-sm px-4 py-2 rounded-lg border border-border disabled:opacity-50 hover:bg-secondary transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="text-sm px-4 py-2 rounded-lg border border-border disabled:opacity-50 hover:bg-secondary transition-colors"
          >
            Next
          </button>
        </div>
      )}
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
