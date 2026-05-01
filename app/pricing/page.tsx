import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing — KeceoOil Platform',
  description: 'Choose the right plan for your business. Start with a 3-day free trial.',
};

const plans = [
  {
    name: 'Starter',
    price: '₦5,000',
    period: '/month',
    description: 'Perfect for small businesses just getting started',
    features: [
      '100 AI responses/month',
      'WhatsApp chatbot integration',
      'Order management',
      'Basic analytics',
      'Email support',
    ],
    overage: '₦50/extra message',
    cta: 'Start Free Trial',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '₦15,000',
    period: '/month',
    description: 'For growing businesses that need more capacity',
    features: [
      '500 AI responses/month',
      'WhatsApp chatbot integration',
      'Order & customer management',
      'Advanced analytics',
      'Priority support',
      'CSV exports',
    ],
    overage: '₦40/extra message',
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Business',
    price: '₦40,000',
    period: '/month',
    description: 'For established businesses with high volume',
    features: [
      '2,000 AI responses/month',
      'WhatsApp chatbot integration',
      'Full customer & order management',
      'ML-powered analytics',
      'Dedicated support',
      'CSV exports',
      'Custom AI prompt',
      'Multi-user access',
    ],
    overage: '₦30/extra message',
    cta: 'Start Free Trial',
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="text-center pt-16 pb-12 px-4">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">KO</span>
          </div>
          <span className="font-semibold text-lg text-foreground">KECE Oil</span>
        </Link>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Start with a 3-day free trial. No credit card required. Upgrade or cancel anytime.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-card border rounded-2xl p-8 flex flex-col ${
                plan.highlighted
                  ? 'border-primary shadow-lg ring-2 ring-primary/20'
                  : 'border-border'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mb-4">
                Overage: {plan.overage}
              </p>
              <Link
                href="/register"
                className={`block text-center py-3 px-4 rounded-lg font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-border text-foreground hover:bg-secondary'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Trial Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border">
            <span className="text-sm text-muted-foreground">
              Free trial includes 8 AI responses over 3 days — no commitment required
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
