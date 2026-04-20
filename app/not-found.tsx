import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-6xl sm:text-8xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. Let&apos;s get you back on track.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-block px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors text-center"
              >
                Go Home
              </Link>
              <Link
                href="/products"
                className="inline-block px-8 py-4 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors text-center"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
