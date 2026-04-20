'use client';

import { toast } from 'sonner';

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776681497/download_5_qdevvi.webp"
                alt="KeceoOil"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-semibold text-foreground">KeceoOil</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium red palm oil. Locally sourced, quality certified, wholesale pricing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-primary transition-colors">
                  Red Palm Oil
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-primary transition-colors">
                  Bulk Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:info@keceoil.com" className="hover:text-primary transition-colors">
                  Email Us
                </a>
              </li>
              <li>
                <button
                  onClick={() => toast.info('WhatsApp ordering is currently being configured. Please use our chat assistant or check back soon!', { duration: 4000 })}
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp Chat
                </button>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Why Us</h4>
            <p className="text-sm text-muted-foreground">
              Premium quality, competitive prices, fast delivery, and 24/7 support from real people — not bots. Local excellence.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>&copy; 2024 KeceoOil. All rights reserved. Premium Red Palm Oil.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
