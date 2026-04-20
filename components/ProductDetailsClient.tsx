'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { Footer } from '@/components/Footer';
import { PRODUCTS, type Product } from '@/lib/mockData';
import { generateWhatsAppLink } from '@/lib/utils/whatsapp';
import { OrderModal } from '@/components/OrderModal';

interface ProductDetailsClientProps {
  productId: string;
}

export function ProductDetailsClient({ productId }: ProductDetailsClientProps) {
  const product = PRODUCTS.find((p) => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

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

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const whatsappLink = generateWhatsAppLink(
    '234 812 345 6789',
    product.name,
    product.id,
    quantity
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
              <span className="text-muted-foreground">{product.category}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <div className="relative w-full aspect-square bg-secondary rounded-xl overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
                  {product.category}
                </div>
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
                    ₦{product.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">per unit</div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`inline-block px-3 py-1 rounded-lg font-medium text-sm ${
                      product.stock > 10
                        ? 'bg-green-100 text-green-700'
                        : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
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
              />

              {/* Additional Info */}
              <div className="mt-12 pt-8 border-t border-border space-y-4">
                <div className="flex gap-4">
                  <div className="text-2xl">📦</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Fast Delivery</h4>
                    <p className="text-sm text-muted-foreground">
                      Quick shipping to all major cities
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Quality Guaranteed</h4>
                    <p className="text-sm text-muted-foreground">
                      All products verified and authentic
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl">💬</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Real Human Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Our WhatsApp is handled by real people — not bots. Reach our team 24/7.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
