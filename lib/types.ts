// API types matching https://api.keceoil.com/swagger/doc.json

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PAID'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FLAGGED';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // kobo
  currency: string;
  available: boolean;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  phone: string;
  name: string;
  email: string;
  city: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
  fraud_score: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_name: any;
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number; // kobo
  product: Product;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  channel: string;
  total_amount: number; // kobo
  delivery_fee: number; // kobo
  delivery_city: string;
  delivery_area: string;
  delivery_address: string;
  payment_ref: string;
  idempotency_key: string;
  items: OrderItem[];
  user: User;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  order_id: number;
  reference: string;
  amount: number; // kobo
  currency: string;
  status: PaymentStatus;
  provider: string;
  authorization_url: string;
  created_at: string;
  completed_at: string;
}

export interface PaginatedOrders {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedPayments {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedCustomerOrders {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedCustomerPayments {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
}

export interface HealthCheck {
  status: string;
  service: string;
  checks: {
    database: string;
    redis: string;
  };
}

// ─── Chat ───────────────────────────────────────────────────────

export interface ChatDeliveryInfo {
  city: string;
  area: string;
  address: string;
}

export interface ChatProduct {
  name: string;
  quantity: number;
}

export interface ChatAIResponse {
  intent: string;
  reply: string;
  products: ChatProduct[];
  delivery_info: ChatDeliveryInfo | null;
  order_id: number | null;
  email: string;
  name: string;
}

export interface ChatOrderInfo {
  id: number;
  status: string;
  total_amount: number;
}

export interface ChatPaymentInfo {
  amount: number;
  authorization_url: string;
  reference: string;
  status: string;
}

export interface ChatResponse {
  ai_response: ChatAIResponse;
  memory_size: number;
  user_found: boolean;
  reply?: string;
  order?: ChatOrderInfo;
  payment?: ChatPaymentInfo;
}

// ─── Chat Sessions ──────────────────────────────────────────────

export interface ChatSessionStart {
  token: string;
  expires_in: number; // seconds
}

export interface ChatSessionStatus {
  active: boolean;
  phone: string;
  ttl: number; // seconds remaining
}

// ─── Tenant / Multi-Tenant SaaS ─────────────────────────────────

export type PlanTier = 'starter' | 'growth' | 'business';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'cancelled' | 'suspended';
export type TenantStatus = 'active' | 'suspended' | 'pending';
export type TenantUserRole = 'owner' | 'admin' | 'staff';
export type ApiKeyMode = 'sandbox' | 'production';

export interface Tenant {
  id: number;
  business_name: string;
  status: TenantStatus;
  whatsapp_phone_id: string;
  whatsapp_token: string;
  ai_system_prompt: string;
  created_at: string;
  updated_at: string;
}

export interface TenantUser {
  id: number;
  email: string;
  name: string;
  role: TenantUserRole;
  tenant_id: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  tenant_id: number;
  plan_tier: PlanTier;
  status: SubscriptionStatus;
  trial_ends_at: string | null;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface ApiKeyInfo {
  sandbox_key: string;
  production_key: string;
  mode: ApiKeyMode;
  activated_at: string | null;
}

export interface TenantSettings {
  business_name: string;
  phone: string;
  ai_system_prompt: string;
  whatsapp_phone_id: string;
  whatsapp_token: string;
}

// ─── Wallet ─────────────────────────────────────────────────────

export interface WalletBalance {
  balance_kobo: number;
  balance_naira: number;
}

export interface WalletTransaction {
  id: number;
  tenant_id: number;
  type: string;
  amount_kobo: number;
  reference: string;
  description: string;
  created_at: string;
}

export interface PaginatedWalletTransactions {
  transactions: WalletTransaction[];
  total: number;
  page: number;
  limit: number;
}

export interface FundWalletRequest {
  amount_kobo: number;
  email: string;
}

export interface FundWalletResponse {
  payment_url: string;
  reference: string;
}

// ─── Billing ────────────────────────────────────────────────────

export interface BillingPlan {
  id: number;
  name: string;
  tier: PlanTier;
  price_kobo: number;
  conversation_limit: number;
  overage_cost_kobo: number;
}

export interface BillingUsage {
  usage: {
    conversations: number;
    ai_responses: number;
  };
  plan: {
    name: string;
    tier: PlanTier;
    conversation_limit: number;
    overage_cost_kobo: number;
  };
}

export interface BillingInvoice {
  id: number;
  tenant_id: number;
  amount_kobo: number;
  status: 'paid' | 'unpaid' | 'overdue';
  period_start: string;
  period_end: string;
  paid_at: string | null;
  created_at: string;
}

// ─── Tenant Dashboard Responses ─────────────────────────────────

export interface TenantProduct {
  id: number;
  name: string;
  description: string;
  price_kobo: number;
  category: string;
  image_url: string;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenantOrder {
  id: number;
  customer_phone: string;
  customer_name: string;
  status: OrderStatus;
  total_amount: number;
  items: TenantOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface TenantOrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface PaginatedTenantOrders {
  orders: TenantOrder[];
  total: number;
  page: number;
  limit: number;
}

export interface TenantCustomer {
  id: number;
  phone: string;
  name: string;
  email: string;
  total_orders: number;
  total_spent: number;
  last_order_at: string | null;
  created_at: string;
}

export interface PaginatedTenantCustomers {
  customers: TenantCustomer[];
  total: number;
  page: number;
  limit: number;
}

export interface TenantAnalyticsOverview {
  total_orders: number;
  revenue_kobo: number;
  avg_order_value: number;
  pending_orders: number;
  active_products: number;
  top_products: { name: string; orders: number; revenue: number }[];
}

export interface CustomerAnalytics {
  segment: string;
  churn_risk: number;
  lifetime_value: number;
  order_frequency: number;
}

export interface FinanceSummary {
  total_revenue: number;
  pending_amount: number;
  completed_count: number;
  pending_count: number;
}

export interface PaginatedFinancePayments {
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
}

// ─── Auth ───────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  business_name: string;
  business_phone?: string;
}

export interface RegisterResponse {
  tenant: Tenant;
  user: TenantUser;
  subscription: Subscription;
  api_key: { sandbox_key: string; mode: ApiKeyMode };
  access_token: string;
  refresh_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: TenantUser;
  access_token: string;
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

// ─── Admin Tenant Management ────────────────────────────────────

export interface AdminTenantListItem {
  id: number;
  business_name: string;
  status: TenantStatus;
  plan_tier: PlanTier;
  created_at: string;
}

export interface AdminRevenueStats {
  mrr: number;
  total_collected: number;
  outstanding: number;
}

export interface CreateTenantRequest {
  business_name: string;
  whatsapp_phone_id: string;
  whatsapp_token: string;
  ai_system_prompt?: string;
}

export interface CreateTenantUserRequest {
  email: string;
  password: string;
  name: string;
  role: TenantUserRole;
}
