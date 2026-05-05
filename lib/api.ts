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
  ChatSessionStart,
  ChatSessionStatus,
  ChatResponse,
  RegisterRequest,
  RegisterResponse,
  LoginResponse,
  RefreshResponse,
  TenantProduct,
  TenantOrder,
  PaginatedTenantOrders,
  TenantCustomer,
  PaginatedTenantCustomers,
  TenantAnalyticsOverview,
  CustomerAnalytics,
  FinanceSummary,
  PaginatedFinancePayments,
  TenantSettings,
  WalletBalance,
  PaginatedWalletTransactions,
  FundWalletRequest,
  FundWalletResponse,
  BillingUsage,
  Subscription,
  BillingInvoice,
  ApiKeyInfo,
  AdminTenantListItem,
  Tenant,
  TenantUser,
  CreateTenantRequest,
  CreateTenantUserRequest,
  AdminRevenueStats,
  BillingPlan,
} from './types';
import { getAdminKey } from './utils/auth';
import { useLoaderStore } from './stores/loaderStore';
import { useAuthStore } from './stores/authStore';

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

function withLoader<T>(promise: Promise<T>): Promise<T> {
  const { start, end } = useLoaderStore.getState();
  start();
  return promise.finally(end);
}

/** Create an AbortController with an optional timeout (default 30s) */
export function createAbortController(timeoutMs = 30000): AbortController {
  const controller = new AbortController();
  if (timeoutMs > 0) {
    setTimeout(() => controller.abort(), timeoutMs);
  }
  return controller;
}

function publicFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const signal = init?.signal ?? createAbortController().signal;
  return withLoader(
    fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    }).then((r) => handleResponse<T>(r))
  );
}

function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const key = getAdminKey();
  if (!key) throw new ApiError('Not authenticated', 401);
  const signal = init?.signal ?? createAbortController().signal;
  return withLoader(
    fetch(`${API_BASE_URL}${path}`, {
      ...init,
      signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': key,
        ...init?.headers,
      },
    }).then((r) => handleResponse<T>(r))
  );
}

function adminFetchRaw(path: string, init?: RequestInit): Promise<Response> {
  const key = getAdminKey();
  if (!key) throw new ApiError('Not authenticated', 401);
  return withLoader(
    fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { 'X-Admin-Key': key, ...init?.headers },
    })
  );
}

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  const { getRefreshToken, setAccessToken, logout } = useAuthStore.getState();
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    logout();
    return null;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) {
      logout();
      return null;
    }
    const data: RefreshResponse = await res.json();
    setAccessToken(data.access_token);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('keceoil_refresh_token', data.refresh_token);
    }
    return data.access_token;
  } catch {
    logout();
    return null;
  }
}

async function refreshAccessTokenSilent(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;
  isRefreshing = true;
  refreshPromise = doRefresh().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });
  return refreshPromise;
}

async function tenantFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { start, end } = useLoaderStore.getState();
  start();
  try {
    let token = useAuthStore.getState().accessToken;
    if (!token) throw new ApiError('Not authenticated', 401);

    let res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...init?.headers,
      },
    });

    if (res.status === 401) {
      const newToken = await refreshAccessTokenSilent();
      if (!newToken) throw new ApiError('Session expired', 401);
      res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
          ...init?.headers,
        },
      });
    }

    return await handleResponse<T>(res);
  } finally {
    end();
  }
}

async function tenantFetchRaw(path: string, init?: RequestInit): Promise<Response> {
  const { start, end } = useLoaderStore.getState();
  start();
  try {
    let token = useAuthStore.getState().accessToken;
    if (!token) throw new ApiError('Not authenticated', 401);

    let res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        ...init?.headers,
      },
    });

    if (res.status === 401) {
      const newToken = await refreshAccessTokenSilent();
      if (!newToken) throw new ApiError('Session expired', 401);
      res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${newToken}`,
          ...init?.headers,
        },
      });
    }

    return res;
  } finally {
    end();
  }
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

// ─── Pricing ────────────────────────────────────────────────────

export interface DeliveryTier {
  range: string;
  fee_naira: number;
  note: string;
}

export interface PricingData {
  contact: {
    phone: string;
    use_cases: string[];
  };
  delivery: {
    outside_lagos: string;
    tiers: DeliveryTier[];
  };
  products: Product[];
}

export async function getPricing(): Promise<PricingData> {
  return publicFetch<PricingData>('/pricing');
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

// ─── Chat (legacy test endpoint) ────────────────────────────────

export async function sendChatMessage(
  phone: string,
  message: string
): Promise<ChatResponse> {
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
  return await handleResponse(res);
}

// ─── Chat Sessions ──────────────────────────────────────────────

export async function startChatSession(
  phone: string
): Promise<ChatSessionStart> {
  return publicFetch<ChatSessionStart>('/chat/start', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
}

export async function sendTokenChatMessage(
  token: string,
  message: string
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE_URL}/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, message }),
  });
  if (res.status === 401) {
    throw new ApiError('Session expired', 401);
  }
  return await handleResponse<ChatResponse>(res);
}

export async function checkChatSession(
  token: string
): Promise<ChatSessionStatus> {
  return publicFetch<ChatSessionStatus>(`/chat/session${qs({ token })}`);
}

export async function endChatSession(token: string): Promise<void> {
  await publicFetch('/chat/end', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
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

// ─── Tenant Auth ────────────────────────────────────────────────

export async function registerTenant(data: RegisterRequest): Promise<RegisterResponse> {
  return publicFetch<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginTenant(email: string, password: string): Promise<LoginResponse> {
  return publicFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function refreshAccessToken(refreshToken: string): Promise<RefreshResponse> {
  return publicFetch<RefreshResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export async function logoutTenant(refreshToken: string): Promise<void> {
  const token = useAuthStore.getState().accessToken;
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await tenantFetch('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
}

// ─── Tenant Products ────────────────────────────────────────────

export async function getTenantProducts(): Promise<TenantProduct[]> {
  return tenantFetch<TenantProduct[]>('/tenant/products');
}

export async function createTenantProduct(
  product: Omit<TenantProduct, 'id' | 'created_at' | 'updated_at' | 'tenant_id'>
): Promise<TenantProduct> {
  return tenantFetch<TenantProduct>('/tenant/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export async function updateTenantProduct(id: number, data: Partial<TenantProduct>): Promise<TenantProduct> {
  return tenantFetch<TenantProduct>(`/tenant/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteTenantProduct(id: number): Promise<void> {
  await tenantFetch(`/tenant/products/${id}`, { method: 'DELETE' });
}

// ─── Tenant Orders ──────────────────────────────────────────────

export async function getTenantOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedTenantOrders> {
  return tenantFetch<PaginatedTenantOrders>(`/tenant/orders${qs(params ?? {})}`);
}

export async function getTenantOrder(id: number): Promise<TenantOrder> {
  return tenantFetch<TenantOrder>(`/tenant/orders/${id}`);
}

export async function updateTenantOrderStatus(
  id: number,
  status: string
): Promise<void> {
  await tenantFetch(`/tenant/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function exportTenantOrdersCSV(): Promise<Response> {
  return tenantFetchRaw('/tenant/orders/export/csv');
}

// ─── Tenant Customers ───────────────────────────────────────────

export async function getTenantCustomers(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedTenantCustomers> {
  return tenantFetch<PaginatedTenantCustomers>(`/tenant/customers${qs(params ?? {})}`);
}

export async function getTenantCustomer(id: number): Promise<TenantCustomer> {
  return tenantFetch<TenantCustomer>(`/tenant/customers/${id}`);
}

export async function getTenantCustomerOrders(id: number): Promise<{ orders: TenantOrder[] }> {
  return tenantFetch<{ orders: TenantOrder[] }>(`/tenant/customers/${id}/orders`);
}

// ─── Tenant Analytics ───────────────────────────────────────────

export async function getTenantAnalyticsOverview(): Promise<TenantAnalyticsOverview> {
  return tenantFetch<TenantAnalyticsOverview>('/tenant/analytics/overview');
}

export async function getTenantCustomerAnalytics(customerId: number): Promise<CustomerAnalytics> {
  return tenantFetch<CustomerAnalytics>(`/tenant/analytics/customers/${customerId}`);
}

// ─── Tenant Finance ─────────────────────────────────────────────

export async function getTenantFinanceSummary(): Promise<FinanceSummary> {
  return tenantFetch<FinanceSummary>('/tenant/finance/summary');
}

export async function getTenantFinancePayments(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedFinancePayments> {
  return tenantFetch<PaginatedFinancePayments>(`/tenant/payments${qs(params ?? {})}`);
}

export async function exportTenantFinanceCSV(): Promise<Response> {
  return tenantFetchRaw('/tenant/finance/export/csv');
}

// ─── Tenant Settings ────────────────────────────────────────────

export async function getTenantSettings(): Promise<TenantSettings> {
  return tenantFetch<TenantSettings>('/tenant/settings');
}

export async function updateTenantSettings(data: Partial<TenantSettings>): Promise<void> {
  await tenantFetch('/tenant/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ─── Tenant Wallet ──────────────────────────────────────────────

export async function getTenantWalletBalance(): Promise<WalletBalance> {
  return tenantFetch<WalletBalance>('/tenant/wallet/balance');
}

export async function fundTenantWallet(data: FundWalletRequest): Promise<FundWalletResponse> {
  return tenantFetch<FundWalletResponse>('/tenant/wallet/fund', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getTenantWalletTransactions(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedWalletTransactions> {
  return tenantFetch<PaginatedWalletTransactions>(`/tenant/wallet/transactions${qs(params ?? {})}`);
}

// ─── Tenant API Keys ────────────────────────────────────────────

export async function getTenantApiKeys(): Promise<ApiKeyInfo> {
  return tenantFetch<ApiKeyInfo>('/tenant/api-keys');
}

// ─── Tenant Billing ─────────────────────────────────────────────

export async function getBillingUsage(): Promise<BillingUsage> {
  return tenantFetch<BillingUsage>('/tenant/billing/usage');
}

export async function getBillingSubscription(): Promise<Subscription> {
  return tenantFetch<Subscription>('/tenant/billing/subscription');
}

export async function getBillingInvoices(): Promise<{ invoices: BillingInvoice[] }> {
  return tenantFetch<{ invoices: BillingInvoice[] }>('/tenant/billing/invoices');
}

export async function payBillingInvoice(id: number): Promise<{ payment_url: string }> {
  return tenantFetch<{ payment_url: string }>(`/tenant/billing/invoices/${id}/pay`, { method: 'POST' });
}

// ─── Admin Tenant Management ────────────────────────────────────

export async function adminGetTenants(): Promise<AdminTenantListItem[]> {
  return adminFetch<AdminTenantListItem[]>('/admin/tenants');
}

export async function adminGetTenant(id: number): Promise<Tenant> {
  return adminFetch<Tenant>(`/admin/tenants/${id}`);
}

export async function adminCreateTenant(data: CreateTenantRequest): Promise<Tenant> {
  return adminFetch<Tenant>('/admin/tenants', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateTenant(id: number, data: Partial<CreateTenantRequest>): Promise<Tenant> {
  return adminFetch<Tenant>(`/admin/tenants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteTenant(id: number): Promise<void> {
  await adminFetch(`/admin/tenants/${id}`, { method: 'DELETE' });
}

export async function adminGetTenantUsers(tenantId: number): Promise<TenantUser[]> {
  return adminFetch<TenantUser[]>(`/admin/tenants/${tenantId}/users`);
}

export async function adminCreateTenantUser(tenantId: number, data: CreateTenantUserRequest): Promise<TenantUser> {
  return adminFetch<TenantUser>(`/admin/tenants/${tenantId}/users`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteTenantUser(tenantId: number, userId: number): Promise<void> {
  await adminFetch(`/admin/tenants/${tenantId}/users/${userId}`, { method: 'DELETE' });
}

// ─── Admin Billing ──────────────────────────────────────────────

export async function adminGetPlans(): Promise<{ plans: BillingPlan[] }> {
  return adminFetch<{ plans: BillingPlan[] }>('/admin/billing/plans');
}

export async function adminCreateSubscription(tenantId: number, planTier: string): Promise<void> {
  await adminFetch('/admin/billing/subscriptions', {
    method: 'POST',
    body: JSON.stringify({ tenant_id: tenantId, plan_tier: planTier }),
  });
}

export async function adminChangePlan(tenantId: number, planTier: string): Promise<void> {
  await adminFetch('/admin/billing/change-plan', {
    method: 'POST',
    body: JSON.stringify({ tenant_id: tenantId, plan_tier: planTier }),
  });
}

export async function adminSuspendSubscription(tenantId: number): Promise<void> {
  await adminFetch(`/admin/billing/tenants/${tenantId}/suspend`, { method: 'POST' });
}

export async function adminReactivateSubscription(tenantId: number): Promise<void> {
  await adminFetch(`/admin/billing/tenants/${tenantId}/reactivate`, { method: 'POST' });
}

export async function adminGetTenantUsage(tenantId: number): Promise<BillingUsage> {
  return adminFetch<BillingUsage>(`/admin/billing/tenants/${tenantId}/usage`);
}

export async function adminGenerateInvoice(tenantId: number): Promise<void> {
  await adminFetch('/admin/billing/invoices', {
    method: 'POST',
    body: JSON.stringify({ tenant_id: tenantId }),
  });
}

export async function adminGetInvoices(tenantId?: number): Promise<{ invoices: BillingInvoice[] }> {
  return adminFetch<{ invoices: BillingInvoice[] }>(`/admin/billing/invoices${qs({ tenant_id: tenantId })}`);
}

export async function adminMarkInvoicePaid(id: number): Promise<void> {
  await adminFetch(`/admin/billing/invoices/${id}/mark-paid`, { method: 'POST' });
}

export async function adminMarkInvoiceUnpaid(id: number): Promise<void> {
  await adminFetch(`/admin/billing/invoices/${id}/mark-unpaid`, { method: 'POST' });
}

export async function adminGetRevenue(): Promise<AdminRevenueStats> {
  return adminFetch<AdminRevenueStats>('/admin/billing/revenue');
}

// ─── Admin Notifications ────────────────────────────────────────

export async function adminSendProductNotification(productId: number, message: string): Promise<void> {
  await adminFetch('/admin/notifications/product', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId, message }),
  });
}
