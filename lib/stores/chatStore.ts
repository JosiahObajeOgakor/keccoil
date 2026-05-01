import { create } from 'zustand';
import type { ChatResponse, Payment } from '@/lib/types';
import {
  startChatSession,
  sendTokenChatMessage,
  checkChatSession,
  endChatSession,
  getMyPayments,
  ApiError,
} from '@/lib/api';

// ─── Types ──────────────────────────────────────────────────────

export type PaymentPollStatus = 'polling' | 'success' | 'failed' | 'timeout';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  meta?: ChatResponse;
  paymentStatus?: PaymentPollStatus;
  paymentData?: Payment;
}

const GREETING_MESSAGE: ChatMessage = {
  id: 'greeting',
  sender: 'ai',
  text: "Hello! 👋 Welcome to Kecc Oil. I can help you browse our red palm oil products, place an order, or answer any questions.\n\nPlease enter your phone number to get started.",
  timestamp: new Date().toISOString(),
};

const SESSION_WARNING_THRESHOLD = 120; // 2 minutes in seconds

// ─── Store ──────────────────────────────────────────────────────

interface ChatState {
  // Session
  token: string | null;
  phone: string;
  ttl: number;
  sessionActive: boolean;

  // UI
  isOpen: boolean;
  isMinimized: boolean;
  isTyping: boolean;
  messages: ChatMessage[];
  warningShown: boolean;

  // Internal timers (not serialized)
  _countdownTimer: ReturnType<typeof setInterval> | null;
  _pollTimer: ReturnType<typeof setInterval> | null;

  // Actions
  setOpen: (open: boolean) => void;
  setMinimized: (minimized: boolean) => void;
  startSession: (phone: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  endSession: (reason?: 'expired' | 'logout' | 'error') => Promise<void>;
  addMessage: (msg: ChatMessage) => void;
  updateMessage: (msgId: string, updates: Partial<ChatMessage>) => void;
  startPaymentPolling: (reference: string, msgId: string, order?: ChatResponse['order']) => void;
  resetFull: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // ── Initial state ──
  token: null,
  phone: '',
  ttl: 0,
  sessionActive: false,
  isOpen: false,
  isMinimized: false,
  isTyping: false,
  messages: [GREETING_MESSAGE],
  warningShown: false,
  _countdownTimer: null,
  _pollTimer: null,

  // ── UI actions ──
  setOpen: (open) => set({ isOpen: open }),
  setMinimized: (minimized) => set({ isMinimized: minimized }),

  // ── Session management ──
  startSession: async (phone: string) => {
    try {
      const { token, expires_in } = await startChatSession(phone);
      set({
        token,
        phone,
        ttl: expires_in,
        sessionActive: true,
        warningShown: false,
      });

      // Add connected message
      get().addMessage({
        id: `ai-phone-${Date.now()}`,
        sender: 'ai',
        text: `Great! Connected as ${phone}.\n\nHow can I help you today? You can ask about:\n• 🛢️ Product sizes and prices\n• 📦 Placing an order\n• 🚚 Delivery information\n• 💰 Bulk/wholesale pricing`,
        timestamp: new Date().toISOString(),
      });

      // Start countdown
      const timer = get()._countdownTimer;
      if (timer) clearInterval(timer);

      const countdownTimer = setInterval(() => {
        const state = get();
        const newTtl = state.ttl - 1;

        if (newTtl <= 0) {
          // Session expired
          clearInterval(countdownTimer);
          set({ _countdownTimer: null });
          state.endSession('expired');
          return;
        }

        // Warning at threshold
        if (newTtl <= SESSION_WARNING_THRESHOLD && !state.warningShown) {
          const mins = Math.floor(newTtl / 60);
          const secs = newTtl % 60;
          state.addMessage({
            id: `sys-warn-${Date.now()}`,
            sender: 'system',
            text: `⚠️ Your session will expire in ${mins}:${secs.toString().padStart(2, '0')} due to inactivity.`,
            timestamp: new Date().toISOString(),
          });
          set({ warningShown: true });
        }

        set({ ttl: newTtl });
      }, 1000);

      set({ _countdownTimer: countdownTimer });
    } catch (err) {
      get().addMessage({
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: err instanceof ApiError
          ? `Could not start session: ${err.message}`
          : 'Could not connect. Please try again.',
        timestamp: new Date().toISOString(),
      });
    }
  },

  sendMessage: async (message: string) => {
    const { token, sessionActive, isTyping } = get();
    if (!token || !sessionActive || isTyping) return;

    // Add user message
    get().addMessage({
      id: `u-${Date.now()}`,
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString(),
    });

    set({ isTyping: true });

    try {
      const data = await sendTokenChatMessage(token, message);
      const reply = data.ai_response.reply;

      // Strip Paystack URL lines — the Pay Now button handles it
      let fullReply = reply
        .split('\n')
        .filter((line: string) => !line.includes('checkout.paystack.com') && !line.includes('Pay here:'))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      if (data.ai_response.order_id) {
        fullReply += `\n\n📋 Order #${data.ai_response.order_id} created!`;
      }
      if (data.ai_response.delivery_info?.city) {
        const d = data.ai_response.delivery_info;
        fullReply += `\n\n📍 Delivery: ${d.address}, ${d.area}, ${d.city}`;
      }
      if (data.ai_response.products && data.ai_response.products.length > 0) {
        const items = data.ai_response.products
          .map((p) => `${p.quantity}× ${p.name}`)
          .join(', ');
        if (!fullReply.includes(items)) {
          fullReply += `\n\n🛒 ${items}`;
        }
      }

      get().addMessage({
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: fullReply,
        timestamp: new Date().toISOString(),
        meta: data,
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        await get().endSession('expired');
        return;
      }
      get().addMessage({
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: "Sorry, I'm having trouble connecting. Please try again or reach us on WhatsApp.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      set({ isTyping: false });
    }
  },

  refreshSession: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const status = await checkChatSession(token);
      if (!status.active) {
        await get().endSession('expired');
        return;
      }
      set({ ttl: status.ttl, warningShown: status.ttl > SESSION_WARNING_THRESHOLD ? false : get().warningShown });
    } catch {
      // Silently fail — countdown continues locally
    }
  },

  endSession: async (reason = 'logout') => {
    const { token, _countdownTimer, _pollTimer } = get();

    // Clear timers
    if (_countdownTimer) clearInterval(_countdownTimer);
    if (_pollTimer) clearInterval(_pollTimer);

    // Call delete endpoint if we have a token
    if (token) {
      try {
        await endChatSession(token);
      } catch {
        // Best-effort — server might have already expired it
      }
    }

    const systemMsg: ChatMessage = {
      id: `sys-end-${Date.now()}`,
      sender: 'system',
      text: reason === 'expired'
        ? '⏰ Session expired due to inactivity. Your chat history has been cleared. Please re-enter your phone number to start a new session.'
        : reason === 'logout'
        ? '👋 Chat ended. Your session and chat history have been cleared.'
        : '⚠️ Session ended due to an error. Please re-enter your phone number.',
      timestamp: new Date().toISOString(),
    };

    // Full reset — clear everything including messages
    set({
      token: null,
      phone: '',
      ttl: 0,
      sessionActive: false,
      isTyping: false,
      warningShown: false,
      _countdownTimer: null,
      _pollTimer: null,
      messages: [GREETING_MESSAGE, systemMsg],
    });
  },

  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

  updateMessage: (msgId, updates) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === msgId ? { ...m, ...updates } : m)),
    })),

  startPaymentPolling: (reference, msgId, order) => {
    const { phone, _pollTimer } = get();
    if (!phone) return;

    let attempts = 0;
    const maxAttempts = 60;

    // Add polling message
    const pollMsgId = `pay-poll-${Date.now()}`;
    get().addMessage({
      id: pollMsgId,
      sender: 'ai',
      text: 'Verifying your payment...',
      timestamp: new Date().toISOString(),
      paymentStatus: 'polling',
    });

    if (_pollTimer) clearInterval(_pollTimer);

    const timer = setInterval(async () => {
      attempts++;
      try {
        const data = await getMyPayments(phone, 1, 20);
        const found = data.payments?.find((p) => p.reference === reference);
        if (found && found.status === 'SUCCESS') {
          clearInterval(timer);
          set({ _pollTimer: null });
          const { updateMessage } = get();
          updateMessage(pollMsgId, {
            text: `✅ Payment successful!\n\nRef: ${found.reference}\nAmount: ₦${(found.amount / 100).toLocaleString()}`,
            paymentStatus: 'success',
            paymentData: found,
            meta: order ? ({ order } as unknown as ChatResponse) : undefined,
          });
          updateMessage(msgId, { meta: undefined });
        } else if (found && found.status === 'FAILED') {
          clearInterval(timer);
          set({ _pollTimer: null });
          get().updateMessage(pollMsgId, {
            text: '❌ Payment failed. Please try again or contact support.',
            paymentStatus: 'failed',
          });
        } else if (attempts >= maxAttempts) {
          clearInterval(timer);
          set({ _pollTimer: null });
          get().updateMessage(pollMsgId, {
            text: '⏳ Payment verification timed out. If you completed the payment, it will be confirmed shortly. Please check back later.',
            paymentStatus: 'timeout',
          });
        }
      } catch {
        if (attempts >= maxAttempts) {
          clearInterval(timer);
          set({ _pollTimer: null });
          get().updateMessage(pollMsgId, {
            text: '⏳ Could not verify payment right now. If you completed the payment, it will be confirmed shortly.',
            paymentStatus: 'timeout',
          });
        }
      }
    }, 5000);

    set({ _pollTimer: timer });
  },

  resetFull: () => {
    const { _countdownTimer, _pollTimer } = get();
    if (_countdownTimer) clearInterval(_countdownTimer);
    if (_pollTimer) clearInterval(_pollTimer);
    set({
      token: null,
      phone: '',
      ttl: 0,
      sessionActive: false,
      isOpen: false,
      isMinimized: false,
      isTyping: false,
      messages: [GREETING_MESSAGE],
      warningShown: false,
      _countdownTimer: null,
      _pollTimer: null,
    });
  },
}));
