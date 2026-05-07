import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Deletion',
  description: 'Kece Oil data deletion instructions — how to request deletion of your personal data.',
};

export default function DataDeletionPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-secondary/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Data Deletion Instructions</h1>
            <p className="text-lg text-muted-foreground">
              How to request deletion of your personal data from Kece Oil
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10">

            {/* Overview */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Right to Data Deletion</h2>
              <p className="text-muted-foreground leading-relaxed">
                Under the Nigeria Data Protection Regulation (NDPR), you have the right to request the deletion of your personal data held by Kece Oil. We are committed to respecting your privacy and will process all legitimate deletion requests promptly.
              </p>
            </div>

            {/* What Data We Hold */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">What Data We May Hold</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Depending on your interactions with Kece Oil, we may hold the following data about you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Contact Information:</strong> Phone number, name, and email address.</li>
                <li><strong className="text-foreground">Order History:</strong> Products ordered, quantities, delivery addresses, and transaction amounts.</li>
                <li><strong className="text-foreground">Payment Records:</strong> Payment references and status (card details are held by Paystack, not us).</li>
                <li><strong className="text-foreground">Chat History:</strong> Conversations with our AI chat assistant.</li>
                <li><strong className="text-foreground">Delivery Information:</strong> City, area, and street address used for past orders.</li>
              </ul>
            </div>

            {/* How to Request */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">How to Request Data Deletion</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can request deletion of your data through any of the following methods:
              </p>

              {/* Method 1 */}
              <div className="bg-secondary/30 border border-border rounded-xl p-6 mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-3">Option 1: Email Request</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Send an email to <a href="mailto:info@keceoil.com" className="text-primary hover:underline">info@keceoil.com</a> with the subject line <strong className="text-foreground">&quot;Data Deletion Request&quot;</strong> and include:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Your full name</li>
                  <li>The phone number associated with your account</li>
                  <li>A brief description of what data you want deleted (or &quot;all data&quot;)</li>
                </ul>
              </div>

              {/* Method 2 */}
              <div className="bg-secondary/30 border border-border rounded-xl p-6 mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-3">Option 2: Chat Assistant</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Use our AI chat assistant on the website and request data deletion. Our team will follow up to verify your identity and process the request.
                </p>
              </div>

              {/* Method 3 */}
              <div className="bg-secondary/30 border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Option 3: WhatsApp</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Send a message to our WhatsApp business number requesting data deletion. Include your name and registered phone number for verification.
                </p>
              </div>
            </div>

            {/* Verification */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Identity Verification</h2>
              <p className="text-muted-foreground leading-relaxed">
                To protect your privacy, we may ask you to verify your identity before processing a deletion request. Verification is typically done by confirming the phone number associated with your orders or responding from the email address on file.
              </p>
            </div>

            {/* What Happens */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">What Happens After Your Request</h2>
              <ol className="list-decimal pl-6 space-y-3 text-muted-foreground">
                <li><strong className="text-foreground">Acknowledgement:</strong> We will acknowledge your request within 2 business days.</li>
                <li><strong className="text-foreground">Verification:</strong> We may contact you to verify your identity if needed.</li>
                <li><strong className="text-foreground">Processing:</strong> Your data will be deleted within 14 business days of verification.</li>
                <li><strong className="text-foreground">Confirmation:</strong> You will receive a confirmation once deletion is complete.</li>
              </ol>
            </div>

            {/* Exceptions */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Data We May Need to Retain</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                In certain circumstances, we may be required to retain some data even after a deletion request:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Legal Obligations:</strong> Financial transaction records required by Nigerian tax and accounting regulations.</li>
                <li><strong className="text-foreground">Fraud Prevention:</strong> Records flagged for fraud investigation may be retained until resolution.</li>
                <li><strong className="text-foreground">Dispute Resolution:</strong> Data related to unresolved disputes or pending orders.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                If any data must be retained, we will inform you of the specific data, the reason for retention, and how long it will be kept.
              </p>
            </div>

            {/* Third-Party Data */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Data</h2>
              <p className="text-muted-foreground leading-relaxed">
                Payment data processed by Paystack is subject to Paystack&apos;s own data retention and deletion policies. To request deletion of payment data held by Paystack, please contact Paystack directly or let us know and we will assist in forwarding your request. Similarly, messages sent via WhatsApp are subject to WhatsApp&apos;s data policies.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-secondary/30 border border-border rounded-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">Need Help?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about data deletion or need assistance with your request:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Email:</strong> <a href="mailto:info@keceoil.com" className="text-primary hover:underline">info@keceoil.com</a></li>
                <li><strong className="text-foreground">Website:</strong> <a href="https://keceoil.com" className="text-primary hover:underline">keceoil.com</a></li>
                <li><strong className="text-foreground">Response Time:</strong> Within 2 business days</li>
              </ul>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
