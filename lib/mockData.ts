export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
  available: boolean;
  lastUpdated: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Red Palm Oil - 5L Container',
    price: 12500,
    image: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776679236/download_6_ty1rnu.png',
    description: 'Pure, locally-sourced red palm oil in premium 5-liter containers. Rich in natural beta-carotene and antioxidants. Perfect for culinary and cosmetic use.',
    category: 'Red Palm Oil',
    stock: 120,
    available: true,
    lastUpdated: '2024-04-15',
  },
  {
    id: '2',
    name: 'Premium Red Palm Oil - 20L Drum',
    price: 42000,
    image: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776678833/download_4_kvksdf.png',
    description: 'Industrial-grade red palm oil in 20-liter drums. Sustainably harvested from local plantations. Ideal for bulk buyers and food manufacturers.',
    category: 'Red Palm Oil',
    stock: 45,
    available: true,
    lastUpdated: '2024-04-15',
  },
  {
    id: '3',
    name: 'Premium Red Palm Oil - 50L Bulk',
    price: 95000,
    image: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776679313/download_7_okhrsu.png',
    description: 'Commercial bulk red palm oil for food industries, cosmetics manufacturers, and large-scale operations. Consistently pure quality.',
    category: 'Red Palm Oil',
    stock: 22,
    available: true,
    lastUpdated: '2024-04-15',
  },
  {
    id: '4',
    name: 'Organic Red Palm Oil - 5L Container',
    price: 14500,
    image: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776679236/download_6_ty1rnu.png',
    description: 'Certified organic red palm oil with no additives or preservatives. Perfect for health-conscious consumers and premium food products.',
    category: 'Red Palm Oil',
    stock: 85,
    available: true,
    lastUpdated: '2024-04-14',
  },
  {
    id: '5',
    name: 'Refined Red Palm Oil - 10L Container',
    price: 22000,
    image: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776682730/download_9_ywrjay.png',
    description: 'Refined red palm oil with extended shelf life. Ideal for professional kitchens and food service providers. High smoking point.',
    category: 'Red Palm Oil',
    stock: 60,
    available: true,
    lastUpdated: '2024-04-14',
  },
  {
    id: '6',
    name: 'Cold-Pressed Red Palm Oil - 3L Premium',
    price: 9500,
    image: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776679250/download_8_eque3e.png',
    description: 'Cold-pressed, unrefined red palm oil preserving all natural nutrients and antioxidants. Premium quality for discerning customers.',
    category: 'Red Palm Oil',
    stock: 110,
    available: true,
    lastUpdated: '2024-04-13',
  },
  {
    id: '7',
    name: 'Red Palm Oil Wholesale - 100L Tanker',
    price: 185000,
    image: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776681498/download_7_gkzt4t.webp',
    description: 'Large-scale wholesale red palm oil in 100-liter tanker shipments. Direct from local producers. Best prices for volume orders.',
    category: 'Red Palm Oil',
    stock: 8,
    available: true,
    lastUpdated: '2024-04-12',
  },
  {
    id: '8',
    name: 'Red Palm Oil - Food Grade - 25L',
    price: 58000,
    image: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776681497/download_6_xzhoqi.webp',
    description: 'Food-grade certified red palm oil meeting international quality standards. Perfect for food manufacturers and exporters.',
    category: 'Red Palm Oil',
    stock: 35,
    available: true,
    lastUpdated: '2024-04-11',
  },
];

export const CATEGORIES = [
  'All Products',
  'Red Palm Oil',
];

export const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_PHONE || '234 812 345 6789';

// ─── Order Types ────────────────────────────────────────────────

export type OrderStatus = 'pending_payment' | 'paid' | 'processing' | 'delivered' | 'flagged';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';
export type DeliveryStatus = 'processing' | 'out_for_delivery' | 'delivered';
export type ReviewStatus = 'under_review' | 'resolved' | null;

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  timestamp: string;
  actor: 'admin' | 'system' | 'ai';
}

export interface Order {
  id: string;
  customerPhone: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  reviewStatus: ReviewStatus;
  location: { city: string; area: string };
  createdAt: string;
  updatedAt: string;
  activityLog: ActivityLogEntry[];
  isNew?: boolean;
}

// ─── Customer Types ─────────────────────────────────────────────

export interface Customer {
  id: string;
  phone: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: { summary: string; date: string } | null;
  isRepeat: boolean;
  joinedAt: string;
}

// ─── Conversation Types ─────────────────────────────────────────

export interface ConversationMessage {
  id: string;
  sender: 'user' | 'ai' | 'admin';
  text: string;
  timestamp: string;
}

// ─── Mock Orders ────────────────────────────────────────────────

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerPhone: '+2348101234567',
    customerName: 'Adebayo Olamide',
    items: [{ productId: '1', name: 'Premium Red Palm Oil - 5L Container', quantity: 3, unitPrice: 12500 }],
    totalAmount: 37500,
    status: 'paid',
    paymentStatus: 'paid',
    reviewStatus: null,
    location: { city: 'Lagos', area: 'Ikeja' },
    createdAt: '2026-04-19T08:12:00Z',
    updatedAt: '2026-04-19T08:45:00Z',
    activityLog: [
      { id: 'a1', action: 'Order placed via WhatsApp', timestamp: '2026-04-19T08:12:00Z', actor: 'ai' },
      { id: 'a2', action: 'Payment confirmed', timestamp: '2026-04-19T08:45:00Z', actor: 'system' },
    ],
  },
  {
    id: 'ORD-002',
    customerPhone: '+2348032345678',
    customerName: 'Chidinma Eze',
    items: [{ productId: '2', name: 'Premium Red Palm Oil - 20L Drum', quantity: 1, unitPrice: 42000 }],
    totalAmount: 42000,
    status: 'pending_payment',
    paymentStatus: 'unpaid',
    reviewStatus: null,
    location: { city: 'Abuja', area: 'Wuse 2' },
    createdAt: '2026-04-19T09:30:00Z',
    updatedAt: '2026-04-19T09:30:00Z',
    activityLog: [
      { id: 'a3', action: 'Order placed via WhatsApp', timestamp: '2026-04-19T09:30:00Z', actor: 'ai' },
      { id: 'a4', action: 'Payment link sent', timestamp: '2026-04-19T09:31:00Z', actor: 'ai' },
    ],
    isNew: true,
  },
  {
    id: 'ORD-003',
    customerPhone: '+2348073456789',
    customerName: 'Ibrahim Musa',
    items: [
      { productId: '7', name: 'Red Palm Oil Wholesale - 100L Tanker', quantity: 1, unitPrice: 185000 },
      { productId: '3', name: 'Premium Red Palm Oil - 50L Bulk', quantity: 2, unitPrice: 95000 },
    ],
    totalAmount: 375000,
    status: 'processing',
    paymentStatus: 'paid',
    reviewStatus: null,
    location: { city: 'Sokoto', area: 'Sokoto South' },
    createdAt: '2026-04-18T14:00:00Z',
    updatedAt: '2026-04-19T07:00:00Z',
    activityLog: [
      { id: 'a5', action: 'Order placed via WhatsApp', timestamp: '2026-04-18T14:00:00Z', actor: 'ai' },
      { id: 'a6', action: 'Payment confirmed', timestamp: '2026-04-18T15:20:00Z', actor: 'system' },
      { id: 'a7', action: 'Order moved to processing', timestamp: '2026-04-19T07:00:00Z', actor: 'admin' },
    ],
  },
  {
    id: 'ORD-004',
    customerPhone: '+2348054567890',
    customerName: 'Ngozi Okafor',
    items: [{ productId: '4', name: 'Organic Red Palm Oil - 5L Container', quantity: 5, unitPrice: 14500 }],
    totalAmount: 72500,
    status: 'delivered',
    paymentStatus: 'paid',
    reviewStatus: null,
    location: { city: 'Lagos', area: 'Lekki' },
    createdAt: '2026-04-17T11:00:00Z',
    updatedAt: '2026-04-18T16:00:00Z',
    activityLog: [
      { id: 'a8', action: 'Order placed via WhatsApp', timestamp: '2026-04-17T11:00:00Z', actor: 'ai' },
      { id: 'a9', action: 'Payment confirmed', timestamp: '2026-04-17T11:30:00Z', actor: 'system' },
      { id: 'a10', action: 'Out for delivery', timestamp: '2026-04-18T09:00:00Z', actor: 'admin' },
      { id: 'a11', action: 'Delivered successfully', timestamp: '2026-04-18T16:00:00Z', actor: 'admin' },
    ],
  },
  {
    id: 'ORD-005',
    customerPhone: '+2349065678901',
    customerName: 'Yusuf Abdullahi',
    items: [{ productId: '5', name: 'Refined Red Palm Oil - 10L Container', quantity: 2, unitPrice: 22000 }],
    totalAmount: 44000,
    status: 'flagged',
    paymentStatus: 'failed',
    reviewStatus: 'under_review',
    location: { city: 'Abuja', area: 'Garki' },
    createdAt: '2026-04-19T06:00:00Z',
    updatedAt: '2026-04-19T10:00:00Z',
    activityLog: [
      { id: 'a12', action: 'Order placed via WhatsApp', timestamp: '2026-04-19T06:00:00Z', actor: 'ai' },
      { id: 'a13', action: 'Payment failed', timestamp: '2026-04-19T06:15:00Z', actor: 'system' },
      { id: 'a14', action: 'Flagged for review — possible fraud', timestamp: '2026-04-19T10:00:00Z', actor: 'admin' },
    ],
  },
  {
    id: 'ORD-006',
    customerPhone: '+2348101234567',
    customerName: 'Adebayo Olamide',
    items: [{ productId: '6', name: 'Cold-Pressed Red Palm Oil - 3L Premium', quantity: 4, unitPrice: 9500 }],
    totalAmount: 38000,
    status: 'pending_payment',
    paymentStatus: 'unpaid',
    reviewStatus: null,
    location: { city: 'Lagos', area: 'Ikeja' },
    createdAt: '2026-04-19T10:45:00Z',
    updatedAt: '2026-04-19T10:45:00Z',
    activityLog: [
      { id: 'a15', action: 'Order placed via WhatsApp', timestamp: '2026-04-19T10:45:00Z', actor: 'ai' },
    ],
    isNew: true,
  },
  {
    id: 'ORD-007',
    customerPhone: '+2348086789012',
    customerName: 'Fatima Bello',
    items: [{ productId: '8', name: 'Red Palm Oil - Food Grade - 25L', quantity: 2, unitPrice: 58000 }],
    totalAmount: 116000,
    status: 'paid',
    paymentStatus: 'paid',
    reviewStatus: null,
    location: { city: 'Sokoto', area: 'Bodinga' },
    createdAt: '2026-04-19T07:20:00Z',
    updatedAt: '2026-04-19T08:00:00Z',
    activityLog: [
      { id: 'a16', action: 'Order placed via WhatsApp', timestamp: '2026-04-19T07:20:00Z', actor: 'ai' },
      { id: 'a17', action: 'Payment confirmed', timestamp: '2026-04-19T08:00:00Z', actor: 'system' },
    ],
  },
  {
    id: 'ORD-008',
    customerPhone: '+2348147890123',
    customerName: 'Emeka Nnamdi',
    items: [
      { productId: '1', name: 'Premium Red Palm Oil - 5L Container', quantity: 10, unitPrice: 12500 },
      { productId: '6', name: 'Cold-Pressed Red Palm Oil - 3L Premium', quantity: 5, unitPrice: 9500 },
    ],
    totalAmount: 172500,
    status: 'processing',
    paymentStatus: 'paid',
    reviewStatus: null,
    location: { city: 'Lagos', area: 'Victoria Island' },
    createdAt: '2026-04-18T16:00:00Z',
    updatedAt: '2026-04-19T09:00:00Z',
    activityLog: [
      { id: 'a18', action: 'Order placed via WhatsApp', timestamp: '2026-04-18T16:00:00Z', actor: 'ai' },
      { id: 'a19', action: 'Payment confirmed', timestamp: '2026-04-18T17:00:00Z', actor: 'system' },
      { id: 'a20', action: 'Order moved to processing', timestamp: '2026-04-19T09:00:00Z', actor: 'admin' },
    ],
  },
  {
    id: 'ORD-009',
    customerPhone: '+2348073456789',
    customerName: 'Ibrahim Musa',
    items: [{ productId: '2', name: 'Premium Red Palm Oil - 20L Drum', quantity: 3, unitPrice: 42000 }],
    totalAmount: 126000,
    status: 'delivered',
    paymentStatus: 'paid',
    reviewStatus: null,
    location: { city: 'Sokoto', area: 'Sokoto South' },
    createdAt: '2026-04-15T10:00:00Z',
    updatedAt: '2026-04-16T14:00:00Z',
    activityLog: [
      { id: 'a21', action: 'Order placed via WhatsApp', timestamp: '2026-04-15T10:00:00Z', actor: 'ai' },
      { id: 'a22', action: 'Payment confirmed', timestamp: '2026-04-15T11:00:00Z', actor: 'system' },
      { id: 'a23', action: 'Delivered successfully', timestamp: '2026-04-16T14:00:00Z', actor: 'admin' },
    ],
  },
  {
    id: 'ORD-010',
    customerPhone: '+2348054567890',
    customerName: 'Ngozi Okafor',
    items: [{ productId: '1', name: 'Premium Red Palm Oil - 5L Container', quantity: 2, unitPrice: 12500 }],
    totalAmount: 25000,
    status: 'paid',
    paymentStatus: 'paid',
    reviewStatus: null,
    location: { city: 'Lagos', area: 'Lekki' },
    createdAt: '2026-04-19T11:00:00Z',
    updatedAt: '2026-04-19T11:30:00Z',
    activityLog: [
      { id: 'a24', action: 'Order placed via WhatsApp', timestamp: '2026-04-19T11:00:00Z', actor: 'ai' },
      { id: 'a25', action: 'Payment confirmed', timestamp: '2026-04-19T11:30:00Z', actor: 'system' },
    ],
  },
  {
    id: 'ORD-011',
    customerPhone: '+2348198901234',
    customerName: 'Aisha Mohammed',
    items: [{ productId: '3', name: 'Premium Red Palm Oil - 50L Bulk', quantity: 1, unitPrice: 95000 }],
    totalAmount: 95000,
    status: 'pending_payment',
    paymentStatus: 'unpaid',
    reviewStatus: null,
    location: { city: 'Abuja', area: 'Maitama' },
    createdAt: '2026-04-19T12:00:00Z',
    updatedAt: '2026-04-19T12:00:00Z',
    activityLog: [
      { id: 'a26', action: 'Order placed via WhatsApp', timestamp: '2026-04-19T12:00:00Z', actor: 'ai' },
    ],
    isNew: true,
  },
  {
    id: 'ORD-012',
    customerPhone: '+2348086789012',
    customerName: 'Fatima Bello',
    items: [{ productId: '4', name: 'Organic Red Palm Oil - 5L Container', quantity: 6, unitPrice: 14500 }],
    totalAmount: 87000,
    status: 'delivered',
    paymentStatus: 'paid',
    reviewStatus: null,
    location: { city: 'Sokoto', area: 'Bodinga' },
    createdAt: '2026-04-14T09:00:00Z',
    updatedAt: '2026-04-15T17:00:00Z',
    activityLog: [
      { id: 'a27', action: 'Order placed via WhatsApp', timestamp: '2026-04-14T09:00:00Z', actor: 'ai' },
      { id: 'a28', action: 'Payment confirmed', timestamp: '2026-04-14T10:00:00Z', actor: 'system' },
      { id: 'a29', action: 'Delivered successfully', timestamp: '2026-04-15T17:00:00Z', actor: 'admin' },
    ],
  },
];

// ─── Mock Customers ─────────────────────────────────────────────

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    phone: '+2348101234567',
    name: 'Adebayo Olamide',
    totalOrders: 2,
    totalSpent: 75500,
    lastOrder: { summary: '4x Cold-Pressed 3L', date: '2026-04-19' },
    isRepeat: true,
    joinedAt: '2026-03-10',
  },
  {
    id: 'CUST-002',
    phone: '+2348032345678',
    name: 'Chidinma Eze',
    totalOrders: 1,
    totalSpent: 0,
    lastOrder: { summary: '1x 20L Drum', date: '2026-04-19' },
    isRepeat: false,
    joinedAt: '2026-04-19',
  },
  {
    id: 'CUST-003',
    phone: '+2348073456789',
    name: 'Ibrahim Musa',
    totalOrders: 2,
    totalSpent: 501000,
    lastOrder: { summary: '1x 100L Tanker, 2x 50L Bulk', date: '2026-04-18' },
    isRepeat: true,
    joinedAt: '2026-03-01',
  },
  {
    id: 'CUST-004',
    phone: '+2348054567890',
    name: 'Ngozi Okafor',
    totalOrders: 2,
    totalSpent: 97500,
    lastOrder: { summary: '2x 5L Container', date: '2026-04-19' },
    isRepeat: true,
    joinedAt: '2026-03-20',
  },
  {
    id: 'CUST-005',
    phone: '+2349065678901',
    name: 'Yusuf Abdullahi',
    totalOrders: 1,
    totalSpent: 0,
    lastOrder: { summary: '2x Refined 10L', date: '2026-04-19' },
    isRepeat: false,
    joinedAt: '2026-04-19',
  },
  {
    id: 'CUST-006',
    phone: '+2348086789012',
    name: 'Fatima Bello',
    totalOrders: 2,
    totalSpent: 203000,
    lastOrder: { summary: '2x Food Grade 25L', date: '2026-04-19' },
    isRepeat: true,
    joinedAt: '2026-02-15',
  },
  {
    id: 'CUST-007',
    phone: '+2348147890123',
    name: 'Emeka Nnamdi',
    totalOrders: 1,
    totalSpent: 172500,
    lastOrder: { summary: '10x 5L, 5x 3L', date: '2026-04-18' },
    isRepeat: false,
    joinedAt: '2026-04-18',
  },
  {
    id: 'CUST-008',
    phone: '+2348198901234',
    name: 'Aisha Mohammed',
    totalOrders: 1,
    totalSpent: 0,
    lastOrder: { summary: '1x 50L Bulk', date: '2026-04-19' },
    isRepeat: false,
    joinedAt: '2026-04-19',
  },
];

// ─── Mock Conversations ─────────────────────────────────────────

export const MOCK_CONVERSATIONS: Record<string, ConversationMessage[]> = {
  '+2348101234567': [
    { id: 'm1', sender: 'user', text: 'Hello, I want to buy palm oil', timestamp: '2026-04-19T10:30:00Z' },
    { id: 'm2', sender: 'ai', text: 'Welcome to KeceoOil! 🛢️ We have several options:\n\n1. 5L Container - ₦12,500\n2. 3L Premium Cold-Pressed - ₦9,500\n3. 20L Drum - ₦42,000\n\nWhich would you like?', timestamp: '2026-04-19T10:30:05Z' },
    { id: 'm3', sender: 'user', text: 'I want 4 of the 3L one', timestamp: '2026-04-19T10:32:00Z' },
    { id: 'm4', sender: 'ai', text: 'Great choice! 4x Cold-Pressed Red Palm Oil (3L) = ₦38,000\n\nShould I send you a payment link?', timestamp: '2026-04-19T10:32:05Z' },
    { id: 'm5', sender: 'user', text: 'Yes please', timestamp: '2026-04-19T10:33:00Z' },
    { id: 'm6', sender: 'ai', text: 'Here is your payment link: https://pay.keceoil.com/ORD-006\n\nPlease complete payment within 30 minutes. Your order will be processed immediately after confirmation.', timestamp: '2026-04-19T10:33:05Z' },
  ],
  '+2348032345678': [
    { id: 'm7', sender: 'user', text: 'Good morning, I need 20L drum of red oil', timestamp: '2026-04-19T09:28:00Z' },
    { id: 'm8', sender: 'ai', text: 'Good morning! 🌅 Our 20L Drum of Premium Red Palm Oil is ₦42,000.\n\nWhere should we deliver to?', timestamp: '2026-04-19T09:28:05Z' },
    { id: 'm9', sender: 'user', text: 'Wuse 2, Abuja', timestamp: '2026-04-19T09:29:00Z' },
    { id: 'm10', sender: 'ai', text: 'Perfect! Delivery to Wuse 2, Abuja. Your total is ₦42,000.\n\nI\'ll send you a payment link now.', timestamp: '2026-04-19T09:29:05Z' },
  ],
  '+2349065678901': [
    { id: 'm11', sender: 'user', text: 'I want to order 2 gallons of refined oil', timestamp: '2026-04-19T05:55:00Z' },
    { id: 'm12', sender: 'ai', text: 'Sure! 2x Refined Red Palm Oil (10L) = ₦44,000.\n\nDelivery location?', timestamp: '2026-04-19T05:55:05Z' },
    { id: 'm13', sender: 'user', text: 'Garki, Abuja', timestamp: '2026-04-19T05:56:00Z' },
    { id: 'm14', sender: 'ai', text: 'Order confirmed! Here\'s your payment link: https://pay.keceoil.com/ORD-005', timestamp: '2026-04-19T05:56:05Z' },
    { id: 'm15', sender: 'user', text: 'I\'ve paid', timestamp: '2026-04-19T06:10:00Z' },
    { id: 'm16', sender: 'ai', text: 'We haven\'t received the payment yet. Can you please check your bank app?', timestamp: '2026-04-19T06:10:05Z' },
    { id: 'm17', sender: 'user', text: 'My bank said it failed. Let me try again', timestamp: '2026-04-19T06:15:00Z' },
    { id: 'm18', sender: 'admin', text: 'Hi Yusuf, this is the KeceoOil team. We\'ve noticed the payment issue. Let us send you a fresh payment link.', timestamp: '2026-04-19T10:05:00Z' },
  ],
  '+2348073456789': [
    { id: 'm19', sender: 'user', text: 'I need a large order — 100L tanker and 2 drums of 50L', timestamp: '2026-04-18T13:55:00Z' },
    { id: 'm20', sender: 'ai', text: 'Big order! 💪 Here\'s the breakdown:\n\n• 1x 100L Tanker — ₦185,000\n• 2x 50L Bulk — ₦190,000\n\nTotal: ₦375,000\n\nShall I proceed?', timestamp: '2026-04-18T13:55:05Z' },
    { id: 'm21', sender: 'user', text: 'Yes, delivery to Sokoto South', timestamp: '2026-04-18T13:57:00Z' },
    { id: 'm22', sender: 'ai', text: 'Order placed! Payment link: https://pay.keceoil.com/ORD-003\n\nWe\'ll begin processing as soon as payment is confirmed.', timestamp: '2026-04-18T13:57:05Z' },
  ],
};
