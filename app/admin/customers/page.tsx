'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/utils/auth';
import { useCustomersStore } from '@/lib/stores/customersStore';
import { formatPrice } from '@/lib/constants';
import { Phone, ShoppingBag, Calendar, Search, ArrowLeft } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function CustomersPage() {
  const router = useRouter();
  const { user, userOrders, isLoading, error, lookupByPhone, clearUser } = useCustomersStore();
  const [phoneInput, setPhoneInput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSearchRef = useRef<string>('');

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
    }
  }, [router]);

  const debouncedSearch = useCallback((phone: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (phone.trim() && phone.trim() !== lastSearchRef.current) {
        lastSearchRef.current = phone.trim();
        lookupByPhone(phone.trim());
      }
    }, 400);
  }, [lookupByPhone]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (phoneInput.trim() && phoneInput.trim() !== lastSearchRef.current) {
      lastSearchRef.current = phoneInput.trim();
      lookupByPhone(phoneInput.trim());
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Look up customers by phone number
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8 max-w-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Enter phone number..."
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-6 max-w-lg">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      {user && (
        <div className="space-y-6">
          {/* Customer Info Card */}
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground truncate">{user.name || 'Unknown'}</h2>
              <button
                onClick={clearUser}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                Clear
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="truncate">{user.phone}</span>
              </div>
              {user.email && <div className="text-muted-foreground truncate">{user.email}</div>}
              {user.city && <div className="text-muted-foreground truncate">{user.city}, {user.area}</div>}
              {user.fraud_score !== undefined && (
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    user.fraud_score > 50
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    Fraud Score: {user.fraud_score}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">
                Orders ({userOrders.length})
              </h3>
            </div>
            {userOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders found</p>
            ) : (
              <div className="space-y-3 max-w-3xl">
                {userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-card border border-border rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-foreground">#{order.id}</span>
                      <StatusBadge type="order" status={order.status} />
                    </div>
                    <div className="text-sm text-foreground space-y-1">
                      {order.items ? order.items.map((item, i) => (
                        <p key={i}>
                          {item.quantity}× {item.product_name}
                        </p>
                      )) : null}
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                      <span className="font-medium text-foreground text-sm">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!user && !error && !isLoading && (
        <div className="bg-card border border-border rounded-xl p-8 sm:p-12 text-center max-w-3xl">
          <p className="text-muted-foreground">Enter a phone number to look up a customer</p>
        </div>
      )}
    </div>
  );
}
