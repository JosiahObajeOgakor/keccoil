'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Minus, Phone, CreditCard, Loader2, CheckCircle2, XCircle, Download } from 'lucide-react';
import { sendChatMessage, getMyPayments } from '@/lib/api';
import { formatPrice } from '@/lib/constants';
import type { ChatResponse, Payment } from '@/lib/types';

type PaymentPollStatus = 'polling' | 'success' | 'failed' | 'timeout';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  meta?: ChatResponse;
  paymentStatus?: PaymentPollStatus;
  paymentData?: Payment;
}

const GREETING: ChatMessage = {
  id: 'greeting',
  sender: 'ai',
  text: "Hello! 👋 Welcome to KeceoOil. I can help you browse our red palm oil products, place an order, or answer any questions.\n\nPlease enter your phone number to get started.",
  timestamp: new Date().toISOString(),
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  const updateMessage = useCallback((msgId: string, updates: Partial<ChatMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, ...updates } : m)));
  }, []);

  const openReceipt = useCallback((payment: Payment, order?: ChatResponse['order']) => {
    const w = window.open('', '_blank', 'width=420,height=600');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Receipt #${payment.reference}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:24px;color:#1a1a1a;max-width:400px;margin:0 auto}
.header{text-align:center;border-bottom:2px solid #16a34a;padding-bottom:16px;margin-bottom:16px}
.header h1{font-size:20px;color:#16a34a;margin-bottom:4px}
.header p{font-size:12px;color:#666}
.badge{display:inline-block;padding:4px 12px;border-radius:999px;font-size:11px;font-weight:600;margin-top:8px}
.badge.success{background:#dcfce7;color:#16a34a}
.badge.failed{background:#fee2e2;color:#dc2626}
.badge.pending{background:#fef3c7;color:#d97706}
.row{display:flex;justify-content:space-between;padding:8px 0;font-size:13px;border-bottom:1px solid #f0f0f0}
.row .label{color:#666}
.row .value{font-weight:500}
.total{font-size:16px;font-weight:700;border-top:2px solid #1a1a1a;padding-top:12px;margin-top:8px}
.footer{text-align:center;margin-top:24px;font-size:11px;color:#999}
.print-btn{display:block;margin:20px auto 0;padding:10px 24px;background:#16a34a;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer}
@media print{.print-btn{display:none}}
</style></head><body>
<div class="header">
<h1>🛢️ KeceoOil</h1>
<p>Premium Red Palm Oil</p>
<p style="margin-top:4px">Payment Receipt</p>
</div>
<div class="badge ${payment.status === 'SUCCESS' ? 'success' : payment.status === 'FAILED' ? 'failed' : 'pending'}" style="text-align:center;width:100%;margin-bottom:16px">
${payment.status === 'SUCCESS' ? '✅ Payment Successful' : payment.status === 'FAILED' ? '❌ Payment Failed' : '⏳ Payment Pending'}
</div>
<div class="row"><span class="label">Reference</span><span class="value" style="font-family:monospace;font-size:11px">${payment.reference}</span></div>
<div class="row"><span class="label">Amount</span><span class="value">${formatPrice(payment.amount)}</span></div>
<div class="row"><span class="label">Currency</span><span class="value">${payment.currency || 'NGN'}</span></div>
<div class="row"><span class="label">Provider</span><span class="value" style="text-transform:capitalize">${payment.provider || 'Paystack'}</span></div>
<div class="row"><span class="label">Date</span><span class="value">${new Date(payment.completed_at || payment.created_at).toLocaleString()}</span></div>
${order ? `<div class="row"><span class="label">Order</span><span class="value">#${order.id}</span></div>
<div class="row total"><span class="label">Total</span><span class="value">${formatPrice(order.total_amount)}</span></div>` : ''}
<div class="footer">
<p>KeceoOil — keceoil.com</p>
<p style="margin-top:4px">Thank you for your purchase!</p>
</div>
<button class="print-btn" onclick="window.print()">🖨️ Print Receipt</button>
</body></html>`);
    w.document.close();
  }, []);

  const startPaymentPolling = useCallback(
    (reference: string, msgId: string, order?: ChatResponse['order']) => {
      if (!phone) return;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes at 5s intervals

      // Add polling message
      const pollMsgId = `pay-poll-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: pollMsgId,
          sender: 'ai',
          text: 'Verifying your payment...',
          timestamp: new Date().toISOString(),
          paymentStatus: 'polling',
        },
      ]);

      if (pollTimerRef.current) clearInterval(pollTimerRef.current);

      pollTimerRef.current = setInterval(async () => {
        attempts++;
        try {
          const data = await getMyPayments(phone, 1, 20);
          const found = data.payments?.find((p) => p.reference === reference);
          if (found && found.status === 'SUCCESS') {
            clearInterval(pollTimerRef.current!);
            pollTimerRef.current = null;
            updateMessage(pollMsgId, {
              text: `✅ Payment successful!\n\nRef: ${found.reference}\nAmount: ${formatPrice(found.amount)}`,
              paymentStatus: 'success',
              paymentData: found,
              meta: order ? { order } as unknown as ChatResponse : undefined,
            });
            // Remove the Pay Now button from original message
            updateMessage(msgId, {
              meta: undefined,
            });
          } else if (found && found.status === 'FAILED') {
            clearInterval(pollTimerRef.current!);
            pollTimerRef.current = null;
            updateMessage(pollMsgId, {
              text: '❌ Payment failed. Please try again or contact support.',
              paymentStatus: 'failed',
            });
          } else if (attempts >= maxAttempts) {
            clearInterval(pollTimerRef.current!);
            pollTimerRef.current = null;
            updateMessage(pollMsgId, {
              text: '⏳ Payment verification timed out. If you completed the payment, it will be confirmed shortly. Please check back later.',
              paymentStatus: 'timeout',
            });
          }
        } catch {
          if (attempts >= maxAttempts) {
            clearInterval(pollTimerRef.current!);
            pollTimerRef.current = null;
            updateMessage(pollMsgId, {
              text: '⏳ Could not verify payment right now. If you completed the payment, it will be confirmed shortly.',
              paymentStatus: 'timeout',
            });
          }
        }
      }, 5000);
    },
    [phone, updateMessage]
  );

  const handlePayNowClick = useCallback(
    (url: string, reference: string, msgId: string, order?: ChatResponse['order']) => {
      window.open(url, '_blank', 'noopener,noreferrer');
      startPaymentPolling(reference, msgId, order);
    },
    [startPaymentPolling]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const stripPaystackUrl = (text: string) =>
    text
      .split('\n')
      .filter((line) => !line.includes('checkout.paystack.com') && !line.includes('Pay here:'))
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneInput.trim().replace(/\s+/g, '');
    if (cleaned.length < 10) return;
    setPhone(cleaned);
    setMessages((prev) => [
      ...prev,
      {
        id: `ai-phone`,
        sender: 'ai',
        text: `Great! Connected as ${cleaned}.\n\nHow can I help you today? You can ask about:\n• 🛢️ Product sizes and prices\n• 📦 Placing an order\n• 🚚 Delivery information\n• 💰 Bulk/wholesale pricing`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping || !phone) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await sendChatMessage(phone, text);
      const reply = data.ai_response.reply;

      // Strip Paystack URL lines — the Pay Now button handles it
      let fullReply = stripPaystackUrl(reply);
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

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: fullReply,
        timestamp: new Date().toISOString(),
        meta: data,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "Sorry, I'm having trouble connecting. Please try again or reach us on WhatsApp.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (label: string) => {
    setInput(label);
    // Trigger send on next tick after state updates
    setTimeout(() => {
      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        sender: 'user',
        text: label,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);

      sendChatMessage(phone, label)
        .then((data) => {
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              sender: 'ai',
              text: stripPaystackUrl(data.ai_response.reply),
              timestamp: new Date().toISOString(),
              meta: data,
            },
          ]);
        })
        .catch(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `ai-err-${Date.now()}`,
              sender: 'ai',
              text: "Sorry, I'm having trouble connecting. Please try again.",
              timestamp: new Date().toISOString(),
            },
          ]);
        })
        .finally(() => setIsTyping(false));
    }, 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
        aria-label="Open chat"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">Chat with us</span>
      </button>
    );
  }

  // Minimized bar
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground rounded-full shadow-lg px-4 py-3 cursor-pointer hover:bg-primary/90 transition-colors">
        <button onClick={() => setIsMinimized(false)} className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">KeceoOil Chat</span>
        </button>
        <button
          onClick={() => {
            setIsOpen(false);
            setIsMinimized(false);
          }}
          className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close chat"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Full chat window
  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      style={{ height: 'min(520px, calc(100vh - 6rem))' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-sm">🛢️</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">KeceoOil</h3>
            <p className="text-xs opacity-80">
              {isTyping ? 'Typing...' : phone ? 'Online — AI Assistant' : 'Online — Enter your phone'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/10">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%]">
                <div className={`flex items-center gap-1.5 mb-1 ${isUser ? 'justify-end' : ''}`}>
                  {!isUser && <Bot className="w-3 h-3 text-muted-foreground" />}
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isUser && <User className="w-3 h-3 text-muted-foreground" />}
                </div>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-card border border-border text-foreground rounded-bl-md'
                  }`}
                >
                  {/* Payment polling loader */}
                  {msg.paymentStatus === 'polling' && (
                    <div className="flex items-center gap-2 py-1">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-muted-foreground">{msg.text}</span>
                    </div>
                  )}

                  {/* Payment success */}
                  {msg.paymentStatus === 'success' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-semibold">Payment Successful!</span>
                      </div>
                      <p className="whitespace-pre-wrap text-xs text-muted-foreground">{msg.text.split('\n').slice(1).join('\n').trim()}</p>
                      {msg.paymentData && (
                        <button
                          onClick={() => openReceipt(msg.paymentData!, msg.meta?.order)}
                          className="mt-2 flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors text-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download Receipt
                        </button>
                      )}
                    </div>
                  )}

                  {/* Payment failed */}
                  {msg.paymentStatus === 'failed' && (
                    <div className="flex items-center gap-2 text-red-500">
                      <XCircle className="w-4 h-4" />
                      <span>{msg.text}</span>
                    </div>
                  )}

                  {/* Payment timeout */}
                  {msg.paymentStatus === 'timeout' && (
                    <p className="whitespace-pre-wrap text-muted-foreground">{msg.text}</p>
                  )}

                  {/* Normal message */}
                  {!msg.paymentStatus && <p className="whitespace-pre-wrap">{msg.text}</p>}

                  {msg.meta?.payment?.authorization_url && (
                    <button
                      onClick={() =>
                        handlePayNowClick(
                          msg.meta!.payment!.authorization_url,
                          msg.meta!.payment!.reference,
                          msg.id,
                          msg.meta!.order
                        )
                      }
                      className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-sm"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay Now — {msg.meta.payment.amount ? `₦${(msg.meta.payment.amount / 100).toLocaleString()}` : 'Paystack'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phone collection or Quick actions */}
      {!phone ? (
        <form
          onSubmit={handlePhoneSubmit}
          className="px-3 py-3 border-t border-border bg-card"
        >
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Phone className="w-3 h-3" />
            Enter your phone number to start chatting
          </p>
          <div className="flex items-center gap-2">
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="e.g. 09150464707"
              className="flex-1 px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="submit"
              disabled={phoneInput.trim().replace(/\s+/g, '').length < 10}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        <>
          {/* Quick Actions — show only right after phone confirmation */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto">
              {['View Prices', 'Place Order', 'Delivery Info', 'Bulk Pricing'].map(
                (label) => (
                  <button
                    key={label}
                    onClick={() => handleQuickAction(label)}
                    disabled={isTyping}
                    className="flex-shrink-0 px-3 py-1.5 text-xs font-medium bg-secondary text-foreground rounded-full hover:bg-secondary/80 transition-colors disabled:opacity-50"
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-border bg-card">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
