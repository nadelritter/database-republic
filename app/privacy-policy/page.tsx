import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Link
        href="/"
        className="absolute top-6 left-6 z-10 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Homepage
      </Link>
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">1. General Information</h2>
            <p className="mb-6">
              This Privacy Policy explains how [Your Name/Company] (referred to as "we," "us," or "our") collects, processes, and protects personal data when you use this website.
            </p>
            <p className="mb-6">
              We are committed to protecting your privacy and complying with the EU General Data Protection Regulation (GDPR) and the German Federal Data Protection Act (BDSG). Please read this policy carefully to understand your rights and how we handle your data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">2. Data Controller</h2>
            <p className="mb-6">
              [Your Name/Company]<br />
              [Your Full Address]<br />
              Email: [your-email@domain.com]
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">3. Data Collection and Use</h2>
            <p className="mb-6">
              We collect only the minimum data necessary to operate and improve this website, such as:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>IP addresses and technical data (browser type, device info, log files) for security and performance monitoring</li>
              <li>Cookies for essential site functions and with your consent for analytics and user experience improvement</li>
              <li>Contact data you provide voluntarily (e.g., via contact forms or newsletter signup)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">4. Legal Basis for Processing</h2>
            <p className="mb-6">
              Personal data processing is based on:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Your consent (e.g., cookie consent)</li>
              <li>Legitimate interest to provide and improve website services (Art. 6 (1) (f) GDPR)</li>
              <li>Compliance with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">5. Cookies and Tracking</h2>
            <p className="mb-6">
              We use cookies to ensure the website functions properly. Non-essential cookies (e.g., analytics, tracking) are used only with your explicit consent via the cookie banner. You can manage cookie preferences anytime.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">6. Data Sharing and Transfers</h2>
            <p className="mb-6">
              We do not sell or share your personal data with third parties except:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Service providers who support website operations under strict confidentiality</li>
              <li>When legally required (court orders, law enforcement)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">7. Data Retention</h2>
            <p className="mb-6">
              We retain personal data only as long as necessary for the purposes outlined here or as legally required. User data connected to enquiries or subscriptions is deleted when no longer needed.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">8. Your Rights</h2>
            <p className="mb-6">
              Under GDPR, you have the right to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion ("right to be forgotten")</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time (without affecting the lawfulness of earlier processing)</li>
            </ul>
            <p className="mb-6">
              To exercise your rights, contact us at [your-email@domain.com].
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">9. Security</h2>
            <p className="mb-6">
              We implement technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">10. Changes to This Policy</h2>
            <p className="mb-6">
              We may update this Privacy Policy periodically. Please review it regularly to stay informed about how we protect your data.
            </p>
          </div>

          <div className="text-sm text-muted-foreground border-t pt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </main>
    </div>
  )
}
