'use client';

import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776681497/download_5_qdevvi.webp"
                alt="Kecc Oil"
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-semibold text-foreground text-xs">Kecc Oil</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Premium red palm oil. Locally sourced, quality certified, wholesale pricing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground text-xs mb-4">Shop</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
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
            <h4 className="font-semibold text-foreground text-xs mb-4">Contact</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="tel:07035291507" className="hover:text-primary transition-colors">
                  📞 07035291507
                </a>
              </li>
              <li>
                <a href="mailto:info@keceoil.com" className="hover:text-primary transition-colors">
                  Email Us
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/2347039986047?text=Hi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  WhatsApp Chat
                </a>
              </li>
              <li className="pt-2">
                <span className="text-muted-foreground">
                  📍 No 36 Okunola Road, Egbeda, Lagos
                </span>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-foreground text-xs mb-4">Why Us</h4>
            <p className="text-xs text-muted-foreground">
              Premium quality, competitive prices, fast delivery, and 24/7 support from real people — not bots. Local excellence.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>&copy; 2024 Kecc Oil. All rights reserved. Premium Red Palm Oil.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="/datadeletion" className="hover:text-primary transition-colors">
              Data Deletion
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
