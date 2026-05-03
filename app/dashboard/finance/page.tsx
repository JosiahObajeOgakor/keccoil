'use client';

import { useEffect, useState } from 'react';
import { getTenantFinanceSummary, getTenantFinancePayments, exportTenantFinanceCSV } from '@/lib/api';
import { formatPrice } from '@/lib/constants';
import type { FinanceSummary, Payment } from '@/lib/types';
import { Download, DollarSign, Clock, CheckCircle } from 'lucide-react';

export default function FinancePage() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 20;

  useEffect(() => {
    Promise.all([
      getTenantFinanceSummary(),
      getTenantFinancePayments({ page, limit }),
    ])
      .then(([sum, pay]) => {
        setSummary(sum);
        setPayments(pay.payments);
        setTotal(pay.total);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [page]);

  const handleExportCSV = async () => {
    const res = await exportTenantFinanceCSV();
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finance.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance</h1>
          <p className="text-muted-foreground text-sm mt-1">Revenue and payment overview</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 border border-border text-foreground font-medium rounded-lg hover:bg-secondary transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatPrice(summary?.total_received)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatPrice(summary?.pending_amount)}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{summary?.payment_count}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-muted-foreground">Pending Count</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{summary?.pending_count}</p>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Payments</h2>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No payments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-foreground">{payment.reference}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{formatPrice(payment.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'SUCCESS'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : payment.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(payment.created_at).toLocaleDateString()}
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
          <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="text-sm px-4 py-2 rounded-lg border border-border disabled:opacity-50 hover:bg-secondary transition-colors">
            Previous
          </button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="text-sm px-4 py-2 rounded-lg border border-border disabled:opacity-50 hover:bg-secondary transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
