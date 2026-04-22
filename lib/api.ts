import { API_BASE_URL } from './constants';
import type {
  Product,
  Order,
  OrderStatus,
  User,
  Payment,
  PaginatedOrders,
  PaginatedPayments,
  PaginatedCustomerOrders,
  PaginatedCustomerPayments,
  HealthCheck,
} from './types';
import { getAdminKey } from './utils/auth';

// ─── Helpers ────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(body.error || res.statusText, res.status);
  }
  return res.json();
}

function publicFetch<T>(path: string, init?: RequestInit): Promise<T> {
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  }).then((r) => handleResponse<T>(r));
}

function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const key = getAdminKey();
  if (!key) throw new ApiError('Not authenticated', 401);
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': key,
      ...init?.headers,
    },
  }).then((r) => handleResponse<T>(r));
}

function adminFetchRaw(path: string, init?: RequestInit): Promise<Response> {
  const key = getAdminKey();
  if (!key) throw new ApiError('Not authenticated', 401);
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'X-Admin-Key': key, ...init?.headers },
  });
}

function qs(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
}

// ─── Health ─────────────────────────────────────────────────────

export async function healthCheck(): Promise<HealthCheck> {
  return publicFetch('/health');
}

// ─── Public Products ────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  return publicFetch<Product[]>('/products');
}

export async function getProductById(id: number): Promise<Product> {
  return publicFetch<Product>(`/products/${id}`);
}

// ─── Customer Endpoints ─────────────────────────────────────────

export async function getMyOrders(
  phone: string,
  page = 1,
  limit = 10
): Promise<PaginatedCustomerOrders> {
  return publicFetch(`/customer/orders${qs({ phone, page, limit })}`);
}

export async function getMyPayments(
  phone: string,
  page = 1,
  limit = 10
): Promise<PaginatedCustomerPayments> {
  return publicFetch(`/customer/payments${qs({ phone, page, limit })}`);
}

export async function exportMyOrdersCsv(phone: string): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}/customer/orders/export/csv${qs({ phone })}`);
  if (!res.ok) throw new ApiError('Export failed', res.status);
  return res.blob();
}

export async function emailMyHistory(phone: string): Promise<void> {
  await publicFetch(`/customer/orders/email${qs({ phone })}`, { method: 'POST' });
}

// ─── Admin Orders ───────────────────────────────────────────────

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  from?: string;
  to?: string;
  user_id?: number;
}

export async function getOrders(filters?: OrderFilters): Promise<PaginatedOrders> {
  return adminFetch(`/admin/orders${qs(filters as Record<string, string | number | undefined> ?? {})}`);
}

export async function getOrderById(id: number): Promise<Order> {
  return adminFetch(`/admin/orders/${id}`);
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  return adminFetch(`/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function exportOrdersCsv(filters?: {
  status?: string;
  from?: string;
  to?: string;
}): Promise<Blob> {
  const res = await adminFetchRaw(`/admin/orders/export/csv${qs(filters ?? {})}`);
  if (!res.ok) throw new ApiError('Export failed', res.status);
  return res.blob();
}

// ─── Admin Payments ─────────────────────────────────────────────

export interface PaymentFilters {
  page?: number;
  limit?: number;
  status?: string;
  from?: string;
  to?: string;
}

export async function getPayments(filters?: PaymentFilters): Promise<PaginatedPayments> {
  return adminFetch(`/admin/payments${qs(filters as Record<string, string | number | undefined> ?? {})}`);
}

export async function exportPaymentsCsv(filters?: {
  status?: string;
  from?: string;
  to?: string;
}): Promise<Blob> {
  const res = await adminFetchRaw(`/admin/payments/export/csv${qs(filters ?? {})}`);
  if (!res.ok) throw new ApiError('Export failed', res.status);
  return res.blob();
}

// ─── Admin Products ─────────────────────────────────────────────

export async function createProduct(
  data: Omit<Product, 'id' | 'created_at' | 'updated_at'>
): Promise<Product> {
  return adminFetch('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProduct(
  id: number,
  data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
): Promise<Product> {
  return adminFetch(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number): Promise<void> {
  await adminFetch(`/admin/products/${id}`, { method: 'DELETE' });
}

// ─── Admin Users ────────────────────────────────────────────────

export async function getUserByPhone(phone: string): Promise<User> {
  return adminFetch(`/admin/users/${encodeURIComponent(phone)}`);
}

export async function getFraudScore(userId: number): Promise<{ score: number; events: unknown[] }> {
  return adminFetch(`/admin/fraud/${userId}`);
}

export async function emailUserHistory(userId: number): Promise<void> {
  await adminFetch(`/admin/users/${userId}/email-history`, { method: 'POST' });
}

// ─── Admin Communication ────────────────────────────────────────

export async function forwardWhatsApp(phone: string, message: string): Promise<void> {
  await adminFetch('/admin/forward-whatsapp', {
    method: 'POST',
    body: JSON.stringify({ phone, message }),
  });
}

// ─── Dashboard Stats (computed from orders) ─────────────────────

export interface DashboardStats {
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  revenue: number;
  ordersByCity: { city: string; count: number; revenue: number }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const data = await getOrders({ page: 1, limit: 50 });
  const allOrders = data.orders;

  const cityMap = new Map<string, { count: number; revenue: number }>();
  for (const o of allOrders) {
    const city = o.delivery_city || 'Unknown';
    const existing = cityMap.get(city) ?? { count: 0, revenue: 0 };
    cityMap.set(city, {
      count: existing.count + 1,
      revenue: existing.revenue + (o.status === 'PAID' || o.status === 'DELIVERED' ? o.total_amount : 0),
    });
  }

  return {
    totalOrders: data.total,
    paidOrders: allOrders.filter((o) => o.status === 'PAID' || o.status === 'DELIVERED').length,
    pendingOrders: allOrders.filter((o) => o.status === 'PENDING' || o.status === 'CONFIRMED').length,
    revenue: allOrders
      .filter((o) => o.status === 'PAID' || o.status === 'DELIVERED')
      .reduce((sum, o) => sum + o.total_amount, 0),
    ordersByCity: Array.from(cityMap.entries()).map(([city, d]) => ({ city, ...d })),
  };
}

// ─── Chat ───────────────────────────────────────────────────────

export async function sendChatMessage(
  phone: string,
  message: string
): Promise<import('./types').ChatResponse> {
  // The chat endpoint requires an admin key even for public use.
  // Try the user's admin key first, fall back to the public chat key.
  const key =
    getAdminKey() || process.env.NEXT_PUBLIC_CHAT_API_KEY || '';
  const res = await fetch(`${API_BASE_URL}/test/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': key,
    },
    body: JSON.stringify({ phone, message }),
  });
  return handleResponse(res);
}

// ─── Auth Validation ────────────────────────────────────────────

export async function validateAdminKey(key: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/orders?limit=1`, {
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': key },
    });
    return res.ok;
  } catch {
    return false;
  }
}
