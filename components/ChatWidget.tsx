'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minus, Phone, CreditCard } from 'lucide-react';
import { sendChatMessage } from '@/lib/api';
import type { ChatResponse } from '@/lib/types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  meta?: ChatResponse;
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
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.meta?.payment?.authorization_url && (
                    <a
                      href={msg.meta.payment.authorization_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-sm no-underline"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay Now — {msg.meta.payment.amount ? `₦${(msg.meta.payment.amount / 100).toLocaleString()}` : 'Paystack'}
                    </a>
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
