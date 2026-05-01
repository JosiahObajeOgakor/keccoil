'use client';

import { useEffect, useState } from 'react';
import { getBillingUsage, getBillingSubscription, getBillingInvoices, payBillingInvoice } from '@/lib/api';
import { formatPrice } from '@/lib/constants';
import type { BillingUsage, Subscription, BillingInvoice } from '@/lib/types';
import { CreditCard, Zap, Calendar } from 'lucide-react';

export default function BillingPage() {
  const [usage, setUsage] = useState<BillingUsage | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBillingUsage(), getBillingSubscription(), getBillingInvoices()])
      .then(([u, s, inv]) => {
        setUsage(u);
        setSubscription(s);
        setInvoices(inv.invoices);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handlePayInvoice = async (id: number) => {
    try {
      const res = await payBillingInvoice(id);
      window.location.href = res.payment_url;
    } catch {
      // handled by global loader/error
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6">Billing</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-card border border-border rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const usagePercent = usage
    ? Math.min((usage.usage.ai_responses / usage.plan.conversation_limit) * 100, 100)
    : 0;

  const usageColor =
    usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-amber-500' : 'bg-green-500';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your subscription and invoices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Current Plan */}
        {subscription && (
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Current Plan</h2>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl font-bold text-foreground capitalize">{subscription.plan_tier}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                subscription.status === 'active'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : subscription.status === 'trialing'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {subscription.status}
              </span>
            </div>
            {subscription.trial_ends_at && (
              <p className="text-sm text-muted-foreground">
                Trial ends: {new Date(subscription.trial_ends_at).toLocaleDateString()}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Period: {new Date(subscription.current_period_start).toLocaleDateString()} — {new Date(subscription.current_period_end).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Usage Meter */}
        {usage && (
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Usage</h2>
            </div>
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">AI Responses</span>
                <span className="font-medium text-foreground">
                  {usage.usage.ai_responses} / {usage.plan.conversation_limit}
                </span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${usageColor}`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(usagePercent)}% of plan limit used
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Plan: <span className="text-foreground font-medium capitalize">{usage.plan.name}</span></p>
              <p>Overage: <span className="text-foreground font-medium">{formatPrice(usage.plan.overage_cost_kobo)}/msg</span></p>
            </div>
          </div>
        )}
      </div>

      {/* Invoices */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Invoices</h2>
        </div>
        {invoices.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No invoices yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground">
                      {new Date(invoice.period_start).toLocaleDateString()} — {new Date(invoice.period_end).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{formatPrice(invoice.amount_kobo)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {invoice.status !== 'paid' && (
                        <button
                          onClick={() => handlePayInvoice(invoice.id)}
                          className="text-sm text-primary hover:underline font-medium"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
