import { Layout } from "@/components/layout/Layout";

export default function Terms() {
  return (
    <Layout>
      <div className="bg-primary py-16">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
            Terms & Conditions
          </h1>
          <p className="text-primary-foreground/80 mt-4 text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="container-wide py-16">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using the Biz Millennium website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Biz Millennium provides business networking events, conferences, roundtables, and related services designed to connect professionals and organizations. Our services include event organization, content creation, and business facilitation.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">3. User Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When using our services, you agree to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Conduct yourself professionally at all events and interactions</li>
              <li>Respect the intellectual property rights of Biz Millennium and other participants</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Event Registration and Participation</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              By registering for our events:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>You confirm that all registration information provided is accurate</li>
              <li>You agree to abide by event-specific rules and guidelines</li>
              <li>You consent to being photographed or recorded for promotional purposes</li>
              <li>You understand that event schedules and speakers may be subject to change</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Cancellation and Refund Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cancellation policies vary by event. Please refer to the specific event terms at the time of registration. Generally, cancellations made 14 days or more before an event may be eligible for a full refund. Cancellations within 14 days may receive partial refunds or event credits at our discretion.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, is the property of Biz Millennium or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Biz Millennium shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount paid by you for the specific service giving rise to the claim.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify and hold harmless Biz Millennium, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your violation of these terms or your use of our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">9. Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your privacy is important to us. Please review our{" "}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>{" "}
              to understand how we collect, use, and protect your personal information.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Modifications to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on this page. Your continued use of our services after any changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms and Conditions shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms shall be resolved through appropriate legal channels.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms and Conditions, please contact us:
            </p>
            <div className="mt-4 p-6 bg-muted rounded-lg">
              <p className="text-foreground font-semibold">Biz Millennium</p>
              <p className="text-muted-foreground">Averance Pvt. Ltd.</p>
              <p className="text-muted-foreground">Email: info@bizmillennium.com</p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
