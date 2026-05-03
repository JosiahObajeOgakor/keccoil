'use client';

import { useEffect, useState } from 'react';
import { Truck, Phone, Package, ChevronRight, MapPin, AlertCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ProductCard } from '@/components/ProductCard';
import * as api from '@/lib/api';
import type { PricingData } from '@/lib/api';
import type { Product } from '@/lib/types';
import Link from 'next/link';

export function DeliveryPricing() {
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    api.getPricing()
      .then((data) => setPricing(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-72 bg-secondary/50 rounded-lg" />
          <div className="h-5 w-96 bg-secondary/30 rounded" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-secondary/20 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!pricing) return null;

  const { delivery, contact } = pricing;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border">
      {/* Section Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Delivery & Pricing
          </h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Fast and reliable delivery across Lagos. Contact us for delivery outside Lagos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Delivery Tiers Accordion */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-secondary/30 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Delivery Fee Tiers (Lagos)
              </h3>
            </div>

            <Accordion type="single" collapsible className="px-6">
              {delivery.tiers.map((tier, index) => (
                <AccordionItem key={index} value={`tier-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">{tier.range}</p>
                        <p className="text-sm text-muted-foreground">
                          {tier.fee_naira === 0
                            ? 'Negotiable'
                            : `₦${tier.fee_naira.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="ml-13 pl-4 border-l-2 border-primary/20 py-2">
                      <div className="flex items-start gap-2">
                        <Package className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-foreground font-medium">
                            {tier.fee_naira === 0
                              ? 'Contact us for pricing'
                              : `Delivery fee: ₦${tier.fee_naira.toLocaleString()}`}
                          </p>
                          <p className="text-muted-foreground mt-1">{tier.note}</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}

              {/* Outside Lagos */}
              <AccordionItem value="outside-lagos">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 font-bold text-sm">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Outside Lagos</p>
                      <p className="text-sm text-muted-foreground">Call for pricing</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="ml-13 pl-4 py-2 border-l-2 border-amber-500/20">
                    <p className="text-muted-foreground">{delivery.outside_lagos}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Contact Card */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden sticky top-8">
            <div className="px-6 py-4 bg-primary text-primary-foreground">
              <h3 className="font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Need Help?
              </h3>
              <p className="text-sm opacity-80 mt-1">Call us for bulk orders &amp; custom delivery</p>
            </div>

            <div className="p-6 space-y-4">
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-colors group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {contact.phone}
                  </p>
                  <p className="text-xs text-muted-foreground">Tap to call</p>
                </div>
              </a>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Contact us for:
                </p>
                <ul className="space-y-2">
                  {contact.use_cases.map((useCase, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <ChevronRight className="w-3 h-3 text-primary shrink-0" />
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fallback: Link to products page if no products in pricing response */}
      {(!pricing.products || pricing.products.length === 0) && (
        <div className="mt-12 flex justify-center">
          <Link
            href="/products"
            className="group flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Package className="w-5 h-5" />
            Browse Our Products
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}
    </section>
  );
}
