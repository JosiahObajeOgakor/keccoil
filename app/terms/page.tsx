import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'KeceoOil terms and conditions — rules governing the use of our website and services.',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-secondary/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Terms &amp; Conditions</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: January 1, 2025
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">

            {/* Acceptance */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using the KeceoOil website (keceoil.com), placing an order, or interacting with our AI chat assistant, you agree to be bound by these Terms and Conditions. If you do not agree to all of these terms, you must not use our services. These terms constitute a legally binding agreement between you and KeceoOil Nigeria.
              </p>
            </div>

            {/* Definitions */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Definitions</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">&quot;Platform&quot;</strong> refers to the KeceoOil website, AI chat assistant, and all associated services.</li>
                <li><strong className="text-foreground">&quot;Customer&quot; or &quot;You&quot;</strong> refers to any person who accesses or uses our Platform.</li>
                <li><strong className="text-foreground">&quot;Products&quot;</strong> refers to the red palm oil products listed on our Platform.</li>
                <li><strong className="text-foreground">&quot;Order&quot;</strong> refers to a request to purchase Products placed through our Platform.</li>
                <li><strong className="text-foreground">&quot;We&quot;, &quot;Us&quot;, &quot;Our&quot;</strong> refers to KeceoOil Nigeria.</li>
              </ul>
            </div>

            {/* Products & Pricing */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Products &amp; Pricing</h2>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">3.1 Product Descriptions</h3>
              <p className="text-muted-foreground leading-relaxed">
                We make every effort to display and describe our products accurately. However, we do not warrant that product descriptions, images, pricing, or other content on our Platform are accurate, complete, reliable, current, or error-free. Product images are for illustration purposes and may vary slightly from the actual product.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">3.2 Pricing</h3>
              <p className="text-muted-foreground leading-relaxed">
                All prices are displayed in Nigerian Naira (₦) and are inclusive of applicable taxes unless otherwise stated. Prices are subject to change without prior notice. The price charged for a product will be the price in effect at the time the order is placed. Delivery fees are calculated separately and displayed before payment.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">3.3 Availability</h3>
              <p className="text-muted-foreground leading-relaxed">
                All products are subject to availability. We reserve the right to discontinue any product at any time. If a product becomes unavailable after you have placed an order, we will notify you and provide a full refund.
              </p>
            </div>

            {/* Orders */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Orders &amp; Payment</h2>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">4.1 Placing an Order</h3>
              <p className="text-muted-foreground leading-relaxed">
                Orders can be placed through our AI chat assistant or WhatsApp. By placing an order, you are making an offer to purchase the Products at the stated price. All orders are subject to acceptance by us. We reserve the right to refuse or cancel any order for any reason, including suspected fraud.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">4.2 Payment</h3>
              <p className="text-muted-foreground leading-relaxed">
                Payment is processed securely through Paystack. You will receive a payment link after order confirmation. Orders are not processed until payment is successfully received. We accept debit cards, bank transfers, and other payment methods supported by Paystack. All transactions are encrypted and secure.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">4.3 Order Confirmation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Upon successful payment, you will receive an order confirmation with your order number and details. This confirmation constitutes our acceptance of your order. Please retain your order number for tracking and reference purposes.
              </p>
            </div>

            {/* Delivery */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Delivery</h2>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">5.1 Delivery Areas</h3>
              <p className="text-muted-foreground leading-relaxed">
                We currently deliver to major cities across Nigeria including Lagos, Abuja, and other metropolitan areas. Delivery availability to your specific area will be confirmed during the order process. We are continuously expanding our delivery coverage.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">5.2 Delivery Timeframes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Estimated delivery times are provided as guidance only and are not guaranteed. Delivery timeframes depend on your location, product availability, and logistical factors. We will make reasonable efforts to deliver within the estimated timeframe and will communicate any delays.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">5.3 Delivery Fees</h3>
              <p className="text-muted-foreground leading-relaxed">
                Delivery fees vary based on your location and order size. The applicable delivery fee will be clearly displayed before payment. We may offer free delivery promotions from time to time at our sole discretion.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">5.4 Risk of Loss</h3>
              <p className="text-muted-foreground leading-relaxed">
                Risk of loss and title for Products pass to you upon delivery to the address you provided. Please ensure someone is available to receive the delivery at the specified address.
              </p>
            </div>

            {/* Cancellations & Refunds */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Cancellations &amp; Refunds</h2>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">6.1 Order Cancellation</h3>
              <p className="text-muted-foreground leading-relaxed">
                You may request cancellation of your order before it has been shipped. Once an order is shipped, it cannot be cancelled. To request a cancellation, contact us immediately via our chat assistant or email.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">6.2 Refund Policy</h3>
              <p className="text-muted-foreground leading-relaxed">
                If you receive a damaged or incorrect product, please contact us within 24 hours of delivery with photographic evidence. We will arrange a replacement or full refund at our discretion. Refunds are processed to the original payment method within 5–10 business days.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">6.3 Non-Refundable Circumstances</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Products that have been opened and used (unless defective)</li>
                <li>Orders cancelled after shipment has commenced</li>
                <li>Delivery delays caused by incorrect address information provided by the customer</li>
                <li>Refusal to accept delivery without valid reason</li>
              </ul>
            </div>

            {/* Quality Guarantee */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Quality Guarantee</h2>
              <p className="text-muted-foreground leading-relaxed">
                All KeceoOil products are food-grade certified and sourced from trusted local Nigerian producers. We stand behind the quality of our products. If you are unsatisfied with the quality of any product, please contact us within 48 hours of delivery and we will work to resolve the issue promptly.
              </p>
            </div>

            {/* AI Chat Assistant */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. AI Chat Assistant</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Our Platform includes an AI-powered chat assistant to help you browse products, place orders, and get support. By using the chat assistant:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You acknowledge that responses are generated by artificial intelligence and may not always be perfectly accurate.</li>
                <li>Orders placed through the chat assistant are binding once payment is confirmed.</li>
                <li>Chat conversations are stored to maintain context and improve service quality.</li>
                <li>You agree to provide accurate information including your phone number and delivery details.</li>
              </ul>
            </div>

            {/* User Conduct */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. User Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Use our Platform for any unlawful purpose or in violation of any applicable laws.</li>
                <li>Provide false, inaccurate, or misleading information.</li>
                <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts.</li>
                <li>Interfere with or disrupt the operation of our Platform.</li>
                <li>Engage in fraudulent transactions or use stolen payment information.</li>
                <li>Abuse, harass, or send threatening messages through our chat systems.</li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content on our Platform, including text, graphics, logos, images, product descriptions, and software, is the property of KeceoOil or its licensors and is protected by Nigerian and international copyright laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">11. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, KeceoOil shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our Platform or Products. Our total liability shall not exceed the amount you paid for the specific order giving rise to the claim.
              </p>
            </div>

            {/* Indemnification */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">12. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless KeceoOil, its officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, and expenses arising out of your use of our Platform, violation of these Terms, or infringement of any third-party rights.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">13. Governing Law &amp; Dispute Resolution</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms or your use of our Platform shall first be resolved through good-faith negotiation. If negotiation fails, disputes shall be submitted to the jurisdiction of the courts of Nigeria.
              </p>
            </div>

            {/* Modifications */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">14. Modifications to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to this page. Your continued use of our Platform after changes are posted constitutes acceptance of the modified Terms. We encourage you to review these Terms periodically.
              </p>
            </div>

            {/* Severability */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">15. Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. The invalid or unenforceable provision shall be replaced with a valid provision that most closely achieves the original intent.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-secondary/30 border border-border rounded-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">16. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For any questions regarding these Terms and Conditions, please reach out to us:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Email:</strong> <a href="mailto:info@keceoil.com" className="text-primary hover:underline">info@keceoil.com</a></li>
                <li><strong className="text-foreground">Website:</strong> <a href="https://keceoil.com" className="text-primary hover:underline">keceoil.com</a></li>
                <li><strong className="text-foreground">Business Name:</strong> KeceoOil Nigeria</li>
              </ul>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
