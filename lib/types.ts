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
