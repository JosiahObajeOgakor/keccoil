'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minus } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const GREETING: ChatMessage = {
  id: 'greeting',
  sender: 'ai',
  text: "Hello! 👋 Welcome to KeceoOil. I can help you browse our red palm oil products, place an order, or answer any questions.\n\nWhat can I help you with?",
  timestamp: new Date().toISOString(),
};

// Simulated AI responses based on keywords
function getAIResponse(input: string): string {
  const lower = input.toLowerCase();

  if (lower.includes('price') || lower.includes('how much') || lower.includes('cost')) {
    return "Here are our current prices:\n\n🛢️ 3L Cold-Pressed — ₦9,500\n🛢️ 5L Premium — ₦12,500\n🛢️ 5L Organic — ₦14,500\n🛢️ 10L Refined — ₦22,000\n🛢️ 20L Drum — ₦42,000\n🛢️ 25L Food Grade — ₦58,000\n🛢️ 50L Bulk — ₦95,000\n🛢️ 100L Tanker — ₦185,000\n\nWhich size are you interested in?";
  }

  if (lower.includes('order') || lower.includes('buy') || lower.includes('want')) {
    return "Great! To place an order, I'll need:\n\n1. Which product and size?\n2. How many units?\n3. Your delivery city and area\n\nYou can also order directly via WhatsApp for fastest processing! 💬";
  }

  if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('deliver')) {
    return "We deliver across Nigeria! 🚚\n\n• Lagos — Same day / Next day\n• Abuja — 1-2 business days\n• Other cities — 2-4 business days\n\nDelivery is arranged after payment confirmation.";
  }

  if (lower.includes('bulk') || lower.includes('wholesale') || lower.includes('large')) {
    return "For bulk orders (50L+), we offer special pricing! 💰\n\n🛢️ 50L Bulk — ₦95,000\n🛢️ 100L Tanker — ₦185,000\n\nContact us for custom quotes on larger volumes. We supply restaurants, manufacturers, and retailers.";
  }

  if (lower.includes('payment') || lower.includes('pay') || lower.includes('transfer')) {
    return "We accept:\n\n• Bank transfer\n• Online payment via our secure link\n\nAfter you place an order, we'll send you a payment link. Your order will be processed immediately after confirmation. ✅";
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('good')) {
    return "Hello! 😊 How can I help you today? I can assist with:\n\n• Product information & prices\n• Placing an order\n• Delivery details\n• Bulk/wholesale inquiries";
  }

  if (lower.includes('thank') || lower.includes('thanks')) {
    return "You're welcome! 😊 Is there anything else I can help you with?";
  }

  return "I'd be happy to help! You can ask me about:\n\n• 🛢️ Product sizes and prices\n• 📦 Placing an order\n• 🚚 Delivery information\n• 💰 Bulk/wholesale pricing\n• 💳 Payment methods\n\nYou can also reach our WhatsApp — it's handled by real people (not bots), available 24/7!";
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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

  const handleSend = () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI delay
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: getAIResponse(text),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
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
    <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
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
              {isTyping ? 'Typing...' : 'Online — We reply instantly'}
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
              <div className={`max-w-[85%]`}>
                <div className={`flex items-center gap-1.5 mb-1 ${isUser ? 'justify-end' : ''}`}>
                  {!isUser && <Bot className="w-3 h-3 text-muted-foreground" />}
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto">
          {['View Prices', 'Place Order', 'Delivery Info', 'Bulk Pricing'].map((label) => (
            <button
              key={label}
              onClick={() => {
                setInput(label);
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
                  setTimeout(() => {
                    const aiMsg: ChatMessage = {
                      id: `ai-${Date.now()}`,
                      sender: 'ai',
                      text: getAIResponse(label),
                      timestamp: new Date().toISOString(),
                    };
                    setMessages((prev) => [...prev, aiMsg]);
                    setIsTyping(false);
                  }, 800);
                }, 100);
              }}
              className="flex-shrink-0 px-3 py-1.5 text-xs font-medium bg-secondary text-foreground rounded-full hover:bg-secondary/80 transition-colors"
            >
              {label}
            </button>
          ))}
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
    </div>
  );
}
