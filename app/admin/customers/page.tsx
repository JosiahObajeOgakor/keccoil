'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/utils/auth';
import { useCustomersStore } from '@/lib/stores/customersStore';
import { ChatPanel } from '@/components/admin/ChatPanel';
import { Phone, ShoppingBag, Repeat, Calendar, ChevronRight, X, ArrowLeft } from 'lucide-react';

export default function CustomersPage() {
  const router = useRouter();
  const {
    customers,
    isLoading,
    selectedPhone,
    customerOrders,
    conversation,
    isDetailLoading,
    fetchCustomers,
    selectCustomer,
  } = useCustomersStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'chat'>('orders');

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchCustomers();
  }, [router, fetchCustomers]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View customer history and AI memory
        </p>
      </div>

      <div
        className="flex gap-0 bg-card border border-border rounded-xl overflow-hidden"
        style={{ height: 'calc(100vh - 180px)' }}
      >
        {/* Customer List */}
        <div
          className={`${
            selectedPhone ? 'hidden lg:flex' : 'flex'
          } flex-col w-full lg:w-[360px] lg:min-w-[360px] border-r border-border overflow-y-auto`}
        >
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 bg-secondary/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {customers.map((customer) => (
                <button
                  key={customer.id}
                  onClick={() => {
                    selectCustomer(customer.phone);
                    setActiveTab('orders');
                  }}
                  className={`w-full text-left p-4 hover:bg-secondary/30 transition-colors ${
                    selectedPhone === customer.phone ? 'bg-secondary/50 border-l-2 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-foreground">{customer.name}</span>
                        {customer.isRepeat && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs font-medium">
                            <Repeat className="w-3 h-3" />
                            Repeat
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" />
                      {customer.totalOrders} orders
                    </span>
                    <span>₦{customer.totalSpent.toLocaleString()} spent</span>
                  </div>
                  {customer.lastOrder && (
                    <p className="text-xs text-muted-foreground mt-1.5 bg-secondary/50 px-2 py-1 rounded">
                      Last: {customer.lastOrder.summary}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Customer Detail */}
        <div
          className={`${
            selectedPhone ? 'flex' : 'hidden lg:flex'
          } flex-col flex-1 min-w-0`}
        >
          {selectedPhone ? (
            <div className="flex flex-col h-full">
              {/* Detail Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => selectCustomer(null)}
                    className="lg:hidden p-1.5 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="font-semibold text-foreground">
                      {customers.find((c) => c.phone === selectedPhone)?.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">{selectedPhone}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'orders'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Order History
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'chat'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Conversation
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                {isDetailLoading ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-24 bg-secondary/30 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : activeTab === 'orders' ? (
                  <div className="p-4 space-y-3">
                    {customerOrders.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No orders found</p>
                    ) : (
                      customerOrders.map((order) => (
                        <div
                          key={order.id}
                          className="p-4 bg-secondary/20 rounded-lg border border-border"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm text-foreground">{order.id}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : order.status === 'paid'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : order.status === 'flagged'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              }`}
                            >
                              {order.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-sm text-foreground space-y-1">
                            {order.items.map((item, i) => (
                              <p key={i}>
                                {item.quantity}× {item.name}
                              </p>
                            ))}
                          </div>
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span className="font-medium text-foreground text-sm">
                              ₦{order.totalAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <ChatPanel customerPhone={selectedPhone} />
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Select a customer to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
