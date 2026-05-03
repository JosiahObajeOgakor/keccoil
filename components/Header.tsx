'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const isAdminPage = pathname.startsWith('/admin');
  const isDashboardPage = pathname.startsWith('/dashboard');

  if (isAdminPage || isDashboardPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-700 bg-neutral-900 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776681497/download_5_qdevvi.webp"
              alt="Kecc Oil"
              width={56}
              height={56}
              priority
              className="h-14 sm:h-14 w-auto object-contain"
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'text-primary'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`text-sm font-medium transition-colors ${
                pathname === '/products'
                  ? 'text-primary'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Products
            </Link>
            {/* <Link
              href="/pricing"
              className={`text-sm font-medium transition-colors ${
                pathname === '/pricing'
                  ? 'text-primary'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Pricing
            </Link> */}
            {/* {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Login
              </Link>
            )} */}
          </nav>
        </div>
      </div>
    </header>
  );
}
