'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/utils/auth';
import {
  adminGetRevenue, adminGetInvoices,
  adminMarkInvoicePaid, adminMarkInvoiceUnpaid, adminGenerateInvoice,
} from '@/lib/api';
import { formatPrice } from '@/lib/constants';
import type { AdminRevenueStats, BillingInvoice } from '@/lib/types';
import { toast } from 'sonner';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminBillingPage() {
  const router = useRouter();
  const [revenue, setRevenue] = useState<AdminRevenueStats | null>(null);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [genTenantId, setGenTenantId] = useState('');

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login');
      return;
    }
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [rev, inv] = await Promise.all([adminGetRevenue(), adminGetInvoices()]);
      setRevenue(rev);
      setInvoices(inv.invoices);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkPaid = async (id: number) => {
    try {
      await adminMarkInvoicePaid(id);
      setInvoices(invoices.map((i) => (i.id === id ? { ...i, status: 'paid' as const } : i)));
      toast.success('Marked as paid');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    }
  };

  const handleMarkUnpaid = async (id: number) => {
    try {
      await adminMarkInvoiceUnpaid(id);
      setInvoices(invoices.map((i) => (i.id === id ? { ...i, status: 'unpaid' as const } : i)));
      toast.success('Marked as unpaid');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    }
  };

  const handleGenerate = async () => {
    const id = parseInt(genTenantId);
    if (isNaN(id)) { toast.error('Enter valid tenant ID'); return; }
    try {
      await adminGenerateInvoice(id);
      toast.success('Invoice generated');
      fetchData();
      setGenTenantId('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Billing Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Revenue overview and invoice management</p>
      </div>

      {/* Revenue Cards */}
      {revenue && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-muted-foreground">MRR</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatPrice(revenue.mrr)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">Total Collected</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatPrice(revenue.total_collected)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-muted-foreground">Outstanding</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatPrice(revenue.outstanding)}</p>
          </div>
        </div>
      )}

      {/* Generate Invoice */}
      <div className="bg-card border border-border rounded-xl p-6 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Generate Invoice</h3>
        <div className="flex gap-3 items-center">
          <input
            value={genTenantId}
            onChange={(e) => setGenTenantId(e.target.value)}
            placeholder="Tenant ID"
            className="px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 w-32 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button onClick={handleGenerate} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            Generate
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Invoices</h2>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No invoices</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Tenant</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Period</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-sm text-muted-foreground">#{inv.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground">#{inv.tenant_id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{formatPrice(inv.amount_kobo)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        inv.status === 'paid'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(inv.period_start).toLocaleDateString()} — {new Date(inv.period_end).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {inv.status !== 'paid' ? (
                        <button onClick={() => handleMarkPaid(inv.id)} className="text-xs text-primary hover:underline">Mark Paid</button>
                      ) : (
                        <button onClick={() => handleMarkUnpaid(inv.id)} className="text-xs text-amber-600 hover:underline">Mark Unpaid</button>
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
