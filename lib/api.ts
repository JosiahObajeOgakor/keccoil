import {
  type Order,
  type OrderStatus,
  type PaymentStatus,
  type Customer,
  type ConversationMessage,
  type Product,
  MOCK_ORDERS,
  MOCK_CUSTOMERS,
  MOCK_CONVERSATIONS,
} from './mockData';

// Simulated network delay
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// In-memory copy so mutations persist within a session
let orders: Order[] = [...MOCK_ORDERS];
let customers: Customer[] = [...MOCK_CUSTOMERS];
const conversations: Record<string, ConversationMessage[]> = { ...MOCK_CONVERSATIONS };

// ─── Orders ─────────────────────────────────────────────────────

export async function getOrders(filters?: {
  status?: OrderStatus;
  search?: string;
}): Promise<Order[]> {
  await delay();
  let result = [...orders];
  if (filters?.status) {
    result = result.filter((o) => o.status === filters.status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (o) =>
        o.customerPhone.includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
    );
  }
  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getOrderById(id: string): Promise<Order | null> {
  await delay(150);
  return orders.find((o) => o.id === id) ?? null;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  paymentStatus?: PaymentStatus
): Promise<Order | null> {
  await delay(200);
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  const actionMap: Record<OrderStatus, string> = {
    pending_payment: 'Status changed to Pending Payment',
    paid: 'Marked as Paid',
    processing: 'Moved to Processing',
    delivered: 'Marked as Delivered',
    flagged: 'Flagged for review',
  };

  orders[idx] = {
    ...orders[idx],
    status,
    paymentStatus: paymentStatus ?? orders[idx].paymentStatus,
    updatedAt: now,
    isNew: false,
    reviewStatus:
      status === 'flagged'
        ? 'under_review'
        : orders[idx].reviewStatus === 'under_review' && status !== 'flagged'
        ? 'resolved'
        : orders[idx].reviewStatus,
    activityLog: [
      ...orders[idx].activityLog,
      { id: `a${Date.now()}`, action: actionMap[status], timestamp: now, actor: 'admin' },
    ],
  };
  return orders[idx];
}

export async function cancelOrder(id: string): Promise<Order | null> {
  await delay(200);
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  orders[idx] = {
    ...orders[idx],
    status: 'flagged',
    reviewStatus: 'resolved',
    updatedAt: now,
    activityLog: [
      ...orders[idx].activityLog,
      { id: `a${Date.now()}`, action: 'Order cancelled by admin', timestamp: now, actor: 'admin' },
    ],
  };
  return orders[idx];
}

export async function flagAsFraud(id: string): Promise<Order | null> {
  await delay(200);
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  orders[idx] = {
    ...orders[idx],
    status: 'flagged',
    reviewStatus: 'under_review',
    updatedAt: now,
    activityLog: [
      ...orders[idx].activityLog,
      { id: `a${Date.now()}`, action: 'Flagged as potential fraud', timestamp: now, actor: 'admin' },
    ],
  };
  return orders[idx];
}

export async function resendPaymentLink(id: string): Promise<Order | null> {
  await delay(200);
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  orders[idx] = {
    ...orders[idx],
    updatedAt: now,
    activityLog: [
      ...orders[idx].activityLog,
      { id: `a${Date.now()}`, action: 'Payment link resent to customer', timestamp: now, actor: 'admin' },
    ],
  };
  return orders[idx];
}

// ─── Products ───────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  await delay();
  const stored = typeof window !== 'undefined' ? localStorage.getItem('admin-products') : null;
  if (stored) return JSON.parse(stored);
  const { PRODUCTS } = await import('./mockData');
  return PRODUCTS;
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<Product> {
  await delay(200);
  const product: Product = { ...data, id: `prod-${Date.now()}` };
  const products = await getProducts();
  products.push(product);
  localStorage.setItem('admin-products', JSON.stringify(products));
  return product;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  await delay(200);
  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...data };
  localStorage.setItem('admin-products', JSON.stringify(products));
  return products[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  await delay(200);
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  localStorage.setItem('admin-products', JSON.stringify(filtered));
  return true;
}

// ─── Customers ──────────────────────────────────────────────────

export async function getCustomers(): Promise<Customer[]> {
  await delay();
  return [...customers];
}

export async function getCustomerOrders(phone: string): Promise<Order[]> {
  await delay(150);
  return orders
    .filter((o) => o.customerPhone === phone)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ─── Conversations ──────────────────────────────────────────────

export async function getConversation(phone: string): Promise<ConversationMessage[]> {
  await delay(200);
  return conversations[phone] ?? [];
}

export async function sendMessage(phone: string, text: string): Promise<ConversationMessage> {
  await delay(200);
  const msg: ConversationMessage = {
    id: `m${Date.now()}`,
    sender: 'admin',
    text,
    timestamp: new Date().toISOString(),
  };
  if (!conversations[phone]) conversations[phone] = [];
  conversations[phone].push(msg);
  return msg;
}

// ─── Dashboard Stats ────────────────────────────────────────────

export interface DashboardStats {
  totalOrdersToday: number;
  paidOrders: number;
  pendingPayments: number;
  revenue: number;
  ordersByCity: { city: string; count: number; revenue: number }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay();
  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.createdAt.slice(0, 10) === today);

  const cityMap = new Map<string, { count: number; revenue: number }>();
  for (const o of orders) {
    const existing = cityMap.get(o.location.city) ?? { count: 0, revenue: 0 };
    cityMap.set(o.location.city, {
      count: existing.count + 1,
      revenue: existing.revenue + (o.paymentStatus === 'paid' ? o.totalAmount : 0),
    });
  }

  return {
    totalOrdersToday: todayOrders.length,
    paidOrders: todayOrders.filter((o) => o.paymentStatus === 'paid').length,
    pendingPayments: todayOrders.filter((o) => o.paymentStatus === 'unpaid').length,
    revenue: todayOrders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.totalAmount, 0),
    ordersByCity: Array.from(cityMap.entries()).map(([city, data]) => ({
      city,
      ...data,
    })),
  };
}
