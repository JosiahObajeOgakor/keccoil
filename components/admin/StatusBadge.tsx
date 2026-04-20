'use client';

import type { OrderStatus, PaymentStatus, ReviewStatus, DeliveryStatus } from '@/lib/mockData';

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending_payment: { label: 'Pending Payment', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  paid: { label: 'Paid', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  delivered: { label: 'Delivered', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  flagged: { label: 'Flagged', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; className: string }> = {
  unpaid: { label: 'Unpaid', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  paid: { label: 'Paid', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  refunded: { label: 'Refunded', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
};

const REVIEW_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  under_review: { label: 'Under Review', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  resolved: { label: 'Resolved', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
};

const DELIVERY_STATUS_CONFIG: Record<DeliveryStatus, { label: string; className: string }> = {
  processing: { label: 'Processing', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  out_for_delivery: { label: 'Out for Delivery', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  delivered: { label: 'Delivered', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
};

interface StatusBadgeProps {
  type: 'order' | 'payment' | 'review' | 'delivery';
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
    case 'review':
      config = REVIEW_STATUS_CONFIG[status];
      break;
    case 'delivery':
      config = DELIVERY_STATUS_CONFIG[status as DeliveryStatus];
      break;
  }

  if (!config) return null;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
