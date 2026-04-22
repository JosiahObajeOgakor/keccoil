'use client';

import type { OrderStatus, PaymentStatus } from '@/lib/types';

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  PAID: { label: 'Paid', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  SHIPPED: { label: 'Shipped', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  DELIVERED: { label: 'Delivered', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  CANCELLED: { label: 'Cancelled', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
  FLAGGED: { label: 'Flagged', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  SUCCESS: { label: 'Paid', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  FAILED: { label: 'Failed', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

interface StatusBadgeProps {
  type: 'order' | 'payment';
  status: string;
}

export function StatusBadge({ type, status }: StatusBadgeProps) {
  let config: { label: string; className: string } | undefined;

  switch (type) {
    case 'order':
      config = ORDER_STATUS_CONFIG[status as OrderStatus];
      break;
    case 'payment':
      config = PAYMENT_STATUS_CONFIG[status as PaymentStatus];
      break;
  }

  if (!config) return null;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
