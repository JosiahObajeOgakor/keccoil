import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'KeceoOil privacy policy — how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-secondary/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: January 1, 2025
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">

            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                KeceoOil (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at keceoil.com, use our AI chat assistant, or place an order through our platform. By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">2.1 Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                When you interact with our services, we may collect the following personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Contact Information:</strong> Phone number, name, and email address provided during chat or order placement.</li>
                <li><strong className="text-foreground">Delivery Information:</strong> City, area, and street address for order fulfillment.</li>
                <li><strong className="text-foreground">Payment Information:</strong> Payment references and transaction details processed through Paystack. We do not store your card details directly.</li>
                <li><strong className="text-foreground">Order History:</strong> Details of products purchased, quantities, order status, and transaction amounts.</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Usage Data:</strong> Pages visited, time spent on pages, and interaction patterns.</li>
                <li><strong className="text-foreground">Device Information:</strong> Browser type, operating system, and device identifiers.</li>
                <li><strong className="text-foreground">Chat Data:</strong> Conversations with our AI assistant are stored to provide context-aware support and improve service quality.</li>
              </ul>
            </div>

            {/* How We Use Information */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Order Fulfillment:</strong> To process, confirm, and deliver your orders.</li>
                <li><strong className="text-foreground">Payment Processing:</strong> To generate payment links and verify transactions via Paystack.</li>
                <li><strong className="text-foreground">Customer Support:</strong> To provide personalized assistance through our AI chat and WhatsApp support.</li>
                <li><strong className="text-foreground">Communication:</strong> To send order confirmations, delivery updates, and respond to inquiries.</li>
                <li><strong className="text-foreground">Service Improvement:</strong> To analyze usage patterns and improve our products and services.</li>
                <li><strong className="text-foreground">Fraud Prevention:</strong> To detect and prevent fraudulent transactions and protect our customers.</li>
              </ul>
            </div>

            {/* Data Sharing */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Sharing &amp; Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We do not sell your personal information. We may share your data with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Payment Processors:</strong> Paystack processes your payment securely. Their privacy policy governs payment data handling.</li>
                <li><strong className="text-foreground">Delivery Partners:</strong> Delivery personnel receive only the information necessary to fulfill your order (name, phone, address).</li>
                <li><strong className="text-foreground">Legal Requirements:</strong> We may disclose information if required by law, court order, or to protect our rights and safety.</li>
              </ul>
            </div>

            {/* Data Security */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information. This includes encrypted data transmission (HTTPS/TLS), secure API authentication, and access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            {/* Data Retention */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, including order history for accounting and dispute resolution. Chat conversation memory is maintained to provide context-aware customer support. You may request deletion of your data at any time by contacting us.
              </p>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Under the Nigeria Data Protection Regulation (NDPR), you have the following rights:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Right of Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong className="text-foreground">Right to Rectification:</strong> Request correction of inaccurate personal data.</li>
                <li><strong className="text-foreground">Right to Deletion:</strong> Request deletion of your personal data, subject to legal obligations.</li>
                <li><strong className="text-foreground">Right to Object:</strong> Object to processing of your data for marketing purposes.</li>
                <li><strong className="text-foreground">Right to Data Portability:</strong> Request your data in a structured, machine-readable format.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                To exercise any of these rights, please contact us at <a href="mailto:info@keceoil.com" className="text-primary hover:underline">info@keceoil.com</a>.
              </p>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Cookies &amp; Local Storage</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website uses sessionStorage to maintain admin authentication state and local preferences. We do not use third-party tracking cookies. Essential cookies may be used for site functionality. By continuing to use our website, you consent to the use of these essential technologies.
              </p>
            </div>

            {/* Third-Party Services */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our platform integrates with third-party services including Paystack (payment processing), Cloudinary (image hosting), and WhatsApp (customer communication). Each service has its own privacy policy, and we encourage you to review them. We are not responsible for the privacy practices of these third parties.
              </p>
            </div>

            {/* Children */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Children&apos;s Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a minor, please contact us immediately.
              </p>
            </div>

            {/* Changes */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">11. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last updated&quot; date. Continued use of our services after changes constitutes acceptance of the revised policy.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-secondary/30 border border-border rounded-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
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
