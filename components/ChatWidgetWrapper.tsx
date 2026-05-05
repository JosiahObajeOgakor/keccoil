'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const ChatWidget = dynamic(
  () => import('@/components/ChatWidget').then((m) => ({ default: m.ChatWidget })),
  { ssr: false }
);

export function ChatWidgetWrapper() {
  const pathname = usePathname();
  // Don't show on admin pages
  if (pathname.startsWith('/admin')) return null;
  return <ChatWidget />;
}
