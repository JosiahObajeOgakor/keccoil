'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/constants';
import * as api from '@/lib/api';
import type { PricingData } from '@/lib/api';
import { generateWhatsAppLink, type DeliveryMethod } from '@/lib/utils/whatsapp';
import { OrderModal } from '@/components/OrderModal';

interface ProductDetailsClientProps {
  productId: string;
}

export function ProductDetailsClient({ productId }: ProductDetailsClientProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('dispatch');

  useEffect(() => {
    Promise.all([
      api.getProductById(Number(productId)),
      api.getProducts(),
      api.getPricing(),
    ]).then(([prod, all, pricingData]) => {
      setProduct(prod);
      setAllProducts(all);
      setPricing(pricingData);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, [productId]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="aspect-square bg-secondary/30 rounded-xl animate-pulse" />
              <div className="space-y-4">
                <div className="h-8 w-48 bg-secondary/30 rounded animate-pulse" />
                <div className="h-4 w-full bg-secondary/30 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-secondary/30 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The product you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const relatedProducts = allProducts.filter(
    (p) => p.id !== product.id
  ).slice(0, 3);

  const whatsappLink = generateWhatsAppLink(
    '2347039986047',
    product.name,
    String(product.id),
    quantity,
    deliveryMethod
  );

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-secondary/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/products" className="text-muted-foreground hover:text-foreground">
                Products
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="flex items-start justify-center">
              <div className="relative w-full aspect-square bg-secondary rounded-xl overflow-hidden sticky top-8">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">No Image</div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <div className="mb-6">
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Price and Stock */}
              <div className="border-b border-border pb-8 mb-8">
                <div className="flex items-baseline gap-4 mb-4">
                  <div className="text-4xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </div>
                  <div className="text-sm text-muted-foreground">per unit</div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`inline-block px-3 py-1 rounded-lg font-medium text-sm ${
                      product.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.available ? 'Available' : 'Out of stock'}
                  </div>
                </div>
              </div>

              {/* Quantity and CTA */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3 w-full sm:w-48">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-secondary transition-colors"
                    >
                      −
                    </button>
                    <div className="flex-1 text-center font-semibold text-foreground">
                      {quantity}
                    </div>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex-1 px-4 py-3 border border-border rounded-lg hover:bg-secondary transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delivery Method Selector */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Delivery Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        deliveryMethod === 'pickup'
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/30 hover:bg-secondary/50'
                      }`}
                    >
                      {deliveryMethod === 'pickup' && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <span className="text-2xl">🏪</span>
                      <span className={`text-sm font-medium ${deliveryMethod === 'pickup' ? 'text-primary' : 'text-foreground'}`}>
                        Pickup
                      </span>
                      <span className="text-xs text-muted-foreground text-center">
                        Collect from our shop
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('dispatch')}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        deliveryMethod === 'dispatch'
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/30 hover:bg-secondary/50'
                      }`}
                    >
                      {deliveryMethod === 'dispatch' && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <span className="text-2xl">🚚</span>
                      <span className={`text-sm font-medium ${deliveryMethod === 'dispatch' ? 'text-primary' : 'text-foreground'}`}>
                        Dispatch
                      </span>
                      <span className="text-xs text-muted-foreground text-center">
                        Deliver to my address
                      </span>
                    </button>
                  </div>
                  {deliveryMethod === 'dispatch' && (
                    <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                      <span>📍</span> Our assistant will ask for your delivery address
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setShowModal(true)}
                  className="block w-full py-4 px-6 bg-primary text-primary-foreground font-semibold text-center rounded-lg hover:bg-primary/90 transition-colors active:scale-95 duration-100"
                >
                  Order Now
                </button>
                <p className="text-center text-sm text-muted-foreground">
                  Choose WhatsApp or chat with our AI assistant
                </p>
              </div>

              <OrderModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                productName={`${product.name} × ${quantity}`}
                whatsappLink={whatsappLink}
                deliveryMethod={deliveryMethod}
              />

              {/* Delivery Pricing */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  🚚 Delivery Pricing
                </h3>

                {pricing ? (
                  <div className="space-y-4">
                    <Accordion type="single" collapsible className="rounded-xl border border-border overflow-hidden">
                      {pricing.delivery.tiers.map((tier, i) => (
                        <AccordionItem key={i} value={`tier-${i}`} className="border-border">
                          <AccordionTrigger className="px-4 hover:no-underline hover:bg-secondary/50">
                            <div className="flex items-center justify-between w-full pr-2">
                              <span className="font-medium text-foreground">{tier.range}</span>
                              <span className="text-sm font-semibold text-primary">
                                {tier.fee_naira === 0 ? 'Negotiable' : `₦${tier.fee_naira.toLocaleString()}`}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 text-muted-foreground">
                            {tier.note}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                      <AccordionItem value="outside-lagos" className="border-border">
                        <AccordionTrigger className="px-4 hover:no-underline hover:bg-secondary/50">
                          <div className="flex items-center justify-between w-full pr-2">
                            <span className="font-medium text-foreground">Outside Lagos</span>
                            <span className="text-sm font-semibold text-amber-600">Call</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 text-muted-foreground">
                          {pricing.delivery.outside_lagos}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {/* Contact */}
                    <a
                      href={`tel:${pricing.contact.phone}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-colors"
                    >
                      <span className="text-lg">📞</span>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{pricing.contact.phone}</p>
                        <p className="text-xs text-muted-foreground">Bulk orders &amp; custom delivery</p>
                      </div>
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="text-2xl">📦</div>
                      <div>
                        <h4 className="font-semibold text-foreground">Fast Delivery</h4>
                        <p className="text-sm text-muted-foreground">Quick shipping to all major cities</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-2xl">✅</div>
                      <div>
                        <h4 className="font-semibold text-foreground">Quality Guaranteed</h4>
                        <p className="text-sm text-muted-foreground">All products verified and authentic</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-2xl">💬</div>
                      <div>
                        <h4 className="font-semibold text-foreground">Real Human Support</h4>
                        <p className="text-sm text-muted-foreground">Reach our team 24/7 on WhatsApp</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
