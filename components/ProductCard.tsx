'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/constants';
import { generateWhatsAppLink } from '@/lib/utils/whatsapp';
import { OrderModal } from '@/components/OrderModal';

interface ProductCardProps {
  product: Product;
  showPrice?: boolean;
}

export function ProductCard({ product, showPrice = true }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);
  const whatsappLink = generateWhatsAppLink(
    '234 812 345 6789',
    product.name,
    String(product.id)
  );

  return (
    <div className="group rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      {/* Image Container */}
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden bg-secondary h-56 sm:h-64">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No Image
            </div>
          )}
          {!product.available && (
            <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Unavailable
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mt-4 mb-4">
          {showPrice && (
            <div className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </div>
          )}
          <div className={`text-xs px-2 py-1 rounded-lg ${
            product.available
              ? 'text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
              : 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {product.available ? 'Available' : 'Unavailable'}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setShowModal(true)}
          disabled={!product.available}
          className="block w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-center hover:bg-primary/90 transition-colors active:scale-95 duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Order Now
        </button>
      </div>

      <OrderModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        productName={product.name}
        whatsappLink={whatsappLink}
      />
    </div>
  );
}
