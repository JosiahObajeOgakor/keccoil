'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle, X, Send, Bot, User, Minus, Phone, CreditCard,
  Loader2, CheckCircle2, XCircle, Download, LogOut, Clock, AlertTriangle,
} from 'lucide-react';
import { formatPrice } from '@/lib/constants';
import { useChatStore } from '@/lib/stores/chatStore';
import type { ChatResponse, Payment } from '@/lib/types';

/** Escape HTML entities to prevent XSS in document.write contexts */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function ChatWidget() {
  // ── Store selectors ──
  const isOpen = useChatStore((s) => s.isOpen);
  const isMinimized = useChatStore((s) => s.isMinimized);
  const messages = useChatStore((s) => s.messages);
  const isTyping = useChatStore((s) => s.isTyping);
  const phone = useChatStore((s) => s.phone);
  const sessionActive = useChatStore((s) => s.sessionActive);
  const ttl = useChatStore((s) => s.ttl);
  const token = useChatStore((s) => s.token);

  const setOpen = useChatStore((s) => s.setOpen);
  const setMinimized = useChatStore((s) => s.setMinimized);
  const startSession = useChatStore((s) => s.startSession);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const endSessionAction = useChatStore((s) => s.endSession);
  const startPaymentPolling = useChatStore((s) => s.startPaymentPolling);

  // ── Local state (UI-only) ──
  const [input, setInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Auto-scroll ──
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // ── Lock background scroll when chat is open on mobile ──
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, isMinimized]);

  // ── Focus input ──
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // ── Helpers ──
  const formatTtl = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const ttlColor = ttl <= 60 ? 'text-red-300' : ttl <= 120 ? 'text-amber-300' : 'text-white/70';

  const openReceipt = useCallback((payment: Payment, order?: ChatResponse['order']) => {
    const w = window.open('', '_blank', 'width=420,height=600');
    if (!w) return;
    const safeRef = escapeHtml(String(payment.reference));
    const safeAmount = escapeHtml(formatPrice(payment.amount));
    const safeCurrency = escapeHtml(String(payment.currency || 'NGN'));
    const safeProvider = escapeHtml(String(payment.provider || 'Paystack'));
    const safeDate = escapeHtml(new Date(payment.completed_at || payment.created_at).toLocaleString());
    const safeStatus = payment.status === 'SUCCESS' ? 'success' : payment.status === 'FAILED' ? 'failed' : 'pending';
    const statusLabel = payment.status === 'SUCCESS' ? '✅ Payment Successful' : payment.status === 'FAILED' ? '❌ Payment Failed' : '⏳ Payment Pending';
    const orderHtml = order ? `<div class="row"><span class="label">Order</span><span class="value">#${escapeHtml(String(order.id))}</span></div>
<div class="row total"><span class="label">Total</span><span class="value">${escapeHtml(formatPrice(order.total_amount))}</span></div>` : '';
    w.document.write(`<!DOCTYPE html><html><head><title>Receipt #${safeRef}</title>
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
<h1>🛢️ Kecc Oil</h1>
<p>Premium Red Palm Oil</p>
<p style="margin-top:4px">Payment Receipt</p>
</div>
<div class="badge ${safeStatus}" style="text-align:center;width:100%;margin-bottom:16px">
${statusLabel}
</div>
<div class="row"><span class="label">Reference</span><span class="value" style="font-family:monospace;font-size:11px">${safeRef}</span></div>
<div class="row"><span class="label">Amount</span><span class="value">${safeAmount}</span></div>
<div class="row"><span class="label">Currency</span><span class="value">${safeCurrency}</span></div>
<div class="row"><span class="label">Provider</span><span class="value" style="text-transform:capitalize">${safeProvider}</span></div>
<div class="row"><span class="label">Date</span><span class="value">${safeDate}</span></div>
${orderHtml}
<div class="footer">
<p>Kecc Oil — keceoil.com</p>
<p style="margin-top:4px">Thank you for your purchase!</p>
</div>
<button class="print-btn" onclick="window.print()">🖨️ Print Receipt</button>
</body></html>`);
    w.document.close();
  }, []);

  const handlePayNowClick = useCallback(
    (url: string, reference: string, msgId: string, order?: ChatResponse['order']) => {
      window.open(url, '_blank', 'noopener,noreferrer');
      startPaymentPolling(reference, msgId, order);
    },
    [startPaymentPolling]
  );

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneInput.trim().replace(/\s+/g, '');
    if (cleaned.length < 10) return;
    setPhoneInput('');
    await startSession(cleaned);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping || !sessionActive) return;
    setInput('');
    await sendMessage(text);
  };

  const handleQuickAction = (label: string) => {
    if (isTyping || !sessionActive) return;
    sendMessage(label);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEndChat = async () => {
    setShowLogoutConfirm(false);
    await endSessionAction('logout');
  };

  // ── Floating button when closed ──
  if (!isOpen) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
        aria-label="Open chat"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">Chat with us</span>
      </button>
    );
  }

  // ── Minimized bar ──
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground rounded-full shadow-lg px-4 py-3 cursor-pointer hover:bg-primary/90 transition-colors">
        <button onClick={() => setMinimized(false)} className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Kecc Oil Chat</span>
          {sessionActive && ttl > 0 && (
            <span className={`text-[10px] font-mono ${ttlColor}`}>{formatTtl(ttl)}</span>
          )}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setMinimized(false);
          }}
          className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close chat"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // ── Full chat window ──
  return (
    <div
      className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full h-[100dvh] sm:w-[380px] sm:h-[min(520px,calc(100vh-6rem))] sm:max-w-[calc(100vw-2rem)] bg-card border-0 sm:border sm:border-border sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-sm">🛢️</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">Kecc Oil</h3>
            <div className="flex items-center gap-2">
              <p className="text-xs opacity-80">
                {isTyping ? 'Typing...' : sessionActive ? 'Online — AI Assistant' : 'Online — Enter your phone'}
              </p>
              {sessionActive && ttl > 0 && (
                <span className={`flex items-center gap-0.5 text-[10px] font-mono ${ttlColor}`}>
                  <Clock className="w-2.5 h-2.5" />
                  {formatTtl(ttl)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {sessionActive && (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="End chat"
              title="End chat session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMinimized(true)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Minimize"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logout confirmation banner */}
      {showLogoutConfirm && (
        <div className="px-4 py-3 bg-destructive/10 border-b border-destructive/20 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-destructive">End chat session?</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              This will clear your session and entire chat history.
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleEndChat}
                className="px-3 py-1 text-xs font-medium bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
              >
                End Chat
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-3 py-1 text-xs font-medium bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/10">
        {messages.map((msg) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="max-w-[90%] px-3 py-2 rounded-lg bg-muted/50 border border-border">
                  <p className="text-[11px] text-muted-foreground text-center whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            );
          }

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

      {/* Phone collection or chat input */}
      {!sessionActive ? (
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
          {/* Quick Actions — show only right after session start */}
          {messages.length <= 3 && (
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
