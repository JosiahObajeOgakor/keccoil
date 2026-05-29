'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getTenantWalletBalance, getTenantWalletTransactions, fundTenantWallet, verifyWalletFunding } from '@/lib/api';
import { formatPrice } from '@/lib/constants';
import type { WalletBalance, WalletTransaction } from '@/lib/types';
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { toast } from 'sonner';
import Script from 'next/script';

export default function WalletPage() {
  const router = useRouter();
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [fundOpen, setFundOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [fundEmail, setFundEmail] = useState('');
  const [isFunding, setIsFunding] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const limit = 20;

  const fetchData = async () => {
    try {
      const [bal, txns] = await Promise.all([
        getTenantWalletBalance(),
        getTenantWalletTransactions({ page, limit }),
      ]);
      setBalance(bal);
      setTransactions(txns.transactions);
      setTotal(txns.total);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Handle verification after Paystack popup completes
  const handleVerify = useCallback(async (reference: string) => {
    setIsVerifying(true);
    try {
      await verifyWalletFunding(reference);
      // Give backend time to credit the wallet, then refresh
      await new Promise((r) => setTimeout(r, 2000));
      await fetchData();
      toast.success('Wallet funded successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment verification failed');
    } finally {
      setIsVerifying(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Also handle case where user returns from redirect (fallback)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get('reference') || params.get('trxref');
    if (!reference) return;
    handleVerify(reference).then(() => router.replace('/dashboard/wallet'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFund = async () => {
    const amountKobo = Math.round(parseFloat(fundAmount) * 100);
    if (isNaN(amountKobo) || amountKobo < 500000) {
      toast.error('Minimum amount is ₦5,000');
      return;
    }
    if (!fundEmail.trim()) {
      toast.error('Email is required');
      return;
    }
    setIsFunding(true);
    try {
      const res = await fundTenantWallet({ amount_kobo: amountKobo, email: fundEmail.trim() });

      // Extract access code from Paystack payment URL
      // URL format: https://checkout.paystack.com/{access_code}
      const accessCode = res.payment_url.split('/').pop();

      if (!accessCode || !(window as any).PaystackPop) {
        // Fallback: redirect if inline script not loaded
        window.location.href = res.payment_url;
        return;
      }

      // Open Paystack inline popup — user stays on page, Zustand state preserved
      const paystack = new (window as any).PaystackPop();
      paystack.resumeTransaction(accessCode, {
        onSuccess: () => {
          setFundOpen(false);
          setFundAmount('');
          setFundEmail('');
          setIsFunding(false);
          handleVerify(res.reference);
        },
        onCancel: () => {
          toast.error('Payment cancelled');
          setIsFunding(false);
        },
        onError: () => {
          toast.error('Payment failed. Please try again.');
          setIsFunding(false);
        },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to initiate funding');
      setIsFunding(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <Script src="https://js.paystack.co/v2/inline.js" strategy="lazyOnload" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your wallet balance</p>
      </div>

      {/* Balance Card */}
      {isVerifying && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Verifying payment...
        </div>
      )}
      <div className="bg-card border border-border rounded-xl p-6 max-w-md mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Available Balance</span>
          </div>
        </div>
        {isLoading ? (
          <div className="h-9 w-32 bg-secondary/50 rounded animate-pulse" />
        ) : (
          <p className="text-3xl font-bold text-foreground">
            ₦{balance ? balance.balance_naira.toLocaleString('en-NG', { minimumFractionDigits: 2 }) : '0.00'}
          </p>
        )}
        <button
          onClick={() => setFundOpen(true)}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Fund Wallet
        </button>
      </div>

      {/* Transactions */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Transactions</h2>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No transactions yet</div>
        ) : (
          <div className="divide-y divide-border">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    txn.type === 'credit'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {txn.type === 'credit' ? (
                      <ArrowDownLeft className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{txn.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(txn.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${
                  txn.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {txn.type === 'credit' ? '+' : '-'}{formatPrice(txn.amount_kobo)}
                </span>
              </div>
            ))}
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

      {/* Fund Modal */}
      {fundOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Fund Wallet</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Amount (₦)</label>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="Minimum ₦5,000"
                  min="5000"
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={fundEmail}
                  onChange={(e) => setFundEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-secondary/30 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button onClick={() => setFundOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-secondary transition-colors">
                Cancel
              </button>
              <button onClick={handleFund} disabled={isFunding} className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                {isFunding ? 'Processing...' : 'Proceed to Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
