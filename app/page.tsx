'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { Footer } from '@/components/Footer';
import { HeroSlider, type HeroSlide } from '@/components/HeroSlider';
import { DeliveryPricing } from '@/components/DeliveryPricing';
import type { Product } from '@/lib/types';
import * as api from '@/lib/api';
import Link from 'next/link';

const heroSlides: HeroSlide[] = [
  {
    id: '1',
    type: 'video',
    src: 'https://res.cloudinary.com/detpqzhnq/video/upload/q_auto/f_auto/v1776676930/Kecc_Oil_yanrla.mp4',
    title: '',
    subtitle: '',
    ctaText: 'Browse Products',
    ctaLink: '/products',
  },
  {
    id: '2',
    type: 'image',
    src: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776640671/download_2_a0a1og.png',
    title: '',
    subtitle: '',
    ctaText: 'Shop Now',
    ctaLink: '/products',
  },
  {
    id: '3',
    type: 'image',
    src: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776640705/download_3_shnwng.png',
    title: '',
    subtitle: '',
    ctaText: 'Get a Quote',
    ctaLink: '/products',
  },
  {
    id: '4',
    type: 'image',
    src: 'https://res.cloudinary.com/detpqzhnq/image/upload/q_auto/f_auto/v1776676511/download_3_eqepft.webp',
    title: '',
    subtitle: '',
    ctaText: 'Learn More',
    ctaLink: '/products',
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getProducts().then((data) => {
      setProducts(data);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  const featuredProducts = products.slice(0, 6);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Slider Section */}
        <section>
          <HeroSlider slides={heroSlides} autoPlayInterval={5000} videoInterval={20000} />
        </section>

        {/* Featured Products */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border">
          <div className="mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Premium Red Palm Oil Collection
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose from 5L to 100L. All our palm oil is sourced directly from trusted local Nigerian producers and food-grade certified.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-80 bg-secondary/30 rounded-xl animate-pulse" />
                ))
              : featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          <div className="text-center">
            <Link
              href="/products"
              className="inline-block px-8 py-4 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </section>

        {/* Delivery Pricing */}
        <DeliveryPricing />

        {/* Why Choose Kecc Oil */}
        <section className="bg-secondary/30 border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-center">
                Why Choose Kecc Oil?
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12">
                Sourced from trusted local producers. Certified quality, unbeatable prices, delivered to your doorstep.
              </p>

              <div className="space-y-8">
                {/* Authentic */}
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-lg">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Authentic & Pure
                    </h3>
                    <p className="text-muted-foreground">
                      100% pure red palm oil sourced from local Nigerian farms. Our producers are passionate and trusted. Quality you can count on.
                    </p>
                  </div>
                </div>

                {/* Certified */}
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent text-foreground font-bold flex items-center justify-center text-lg">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Food-Grade Certified
                    </h3>
                    <p className="text-muted-foreground">
                      Oil with international food-grade certification. All our products are certified and quality-assured. Trust in every drop.
                    </p>
                  </div>
                </div>

                {/* Flexible */}
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-lg">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Flexible Sizing
                    </h3>
                    <p className="text-muted-foreground">
                      From 3L to 100L. Great prices for bulk orders. A wide range of options to suit your needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready for Premium Red Palm Oil?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Explore our full range of authentic red palm oil. Order via WhatsApp or chat with our AI assistant right here on the website. Unbeatable prices and fast delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-block px-8 py-4 bg-primary-foreground text-primary font-semibold rounded-lg hover:bg-primary-foreground/90 transition-colors"
              >
                Shop Now
              </Link>
              <button
                onClick={() => {
                  const chatBtn = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement;
                  if (chatBtn) chatBtn.click();
                }}
                className="inline-block px-8 py-4 border-2 border-primary-foreground text-primary-foreground font-semibold rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                Chat With Us
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
