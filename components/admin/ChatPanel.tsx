'use client';

import { useState, useEffect, useRef } from 'react';
import { getConversation, sendMessage } from '@/lib/api';
import type { ConversationMessage } from '@/lib/mockData';
import { Send, Bot, User, Shield } from 'lucide-react';

interface ChatPanelProps {
  customerPhone: string;
}

export function ChatPanel({ customerPhone }: ChatPanelProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    getConversation(customerPhone).then((data) => {
      setMessages(data);
      setIsLoading(false);
    });
  }, [customerPhone]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;
    setInput('');
    setIsSending(true);
    const msg = await sendMessage(customerPhone, text);
    setMessages((prev) => [...prev, msg]);
    setIsSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const senderConfig = {
    user: { label: 'Customer', icon: User, align: 'left' as const, bg: 'bg-secondary', color: 'text-foreground' },
    ai: { label: 'AI Bot', icon: Bot, align: 'left' as const, bg: 'bg-blue-50 dark:bg-blue-900/20', color: 'text-blue-900 dark:text-blue-100' },
    admin: { label: 'Admin', icon: Shield, align: 'right' as const, bg: 'bg-primary/10', color: 'text-primary' },
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className="h-12 w-48 bg-secondary/30 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px]">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            No conversation history
          </div>
        ) : (
          messages.map((msg) => {
            const config = senderConfig[msg.sender];
            const Icon = config.icon;
            const isRight = config.align === 'right';

            return (
              <div
                key={msg.id}
                className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${isRight ? 'order-1' : ''}`}>
                  <div className={`flex items-center gap-1.5 mb-1 ${isRight ? 'justify-end' : ''}`}>
                    <Icon className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">
                      {config.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm ${config.bg} ${config.color} ${
                      isRight ? 'rounded-br-md' : 'rounded-bl-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message as admin..."
            rows={1}
            className="flex-1 px-4 py-2.5 text-sm border border-border rounded-xl bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
