'use client';

import { usePathname } from 'next/navigation';
import { ChatWidget } from '@/components/ChatWidget';

export function ChatWidgetWrapper() {
  const pathname = usePathname();
  // Don't show on admin pages
  if (pathname.startsWith('/admin')) return null;
  return <ChatWidget />;
}
