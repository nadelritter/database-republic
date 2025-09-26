import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
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
        <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing and using this website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with these terms, please do not use this website.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">2. Service Description</h2>
            <p className="mb-6">
              This website provides information about stock additions and removals related to Trade Republic for informational and educational purposes only. The content is sourced from publicly available data and is updated regularly but may be subject to errors or delays.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">3. No Financial Advice</h2>
            <p className="mb-6">
              The information on this website does not constitute financial, investment, legal, or trading advice. We are not licensed financial advisors or brokers. Users should seek independent professional advice before making any investment decisions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">4. User Obligations</h2>
            <p className="mb-6">
              Users agree to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Use this website lawfully and responsibly</li>
              <li>Not interfere with or disrupt website functionality</li>
              <li>Not use automated systems or bots to access the website excessively or unlawfully</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">5. Intellectual Property</h2>
            <p className="mb-6">
              All content, trademarks, logos, and data on this site belong to their respective owners. This site is not affiliated with Trade Republic Bank GmbH or its affiliates. Use of third-party trademarks is for identification purposes only.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">6. Limitation of Liability</h2>
            <p className="mb-6">
              We do not guarantee the accuracy, completeness, or timeliness of the information provided. We disclaim all liability for any damages or losses arising from reliance on or use of this website.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">7. Changes to Terms</h2>
            <p className="mb-6">
              We reserve the right to modify or update these Terms of Service at any time. Continued use of the website after changes constitutes acceptance of the updated terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">8. Governing Law and Jurisdiction</h2>
            <p className="mb-6">
              These Terms shall be governed by and construed in accordance with the laws of Germany. Any disputes arising shall be subject to the exclusive jurisdiction of the courts in Lünen.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-foreground">9. Contact Information</h2>
            <p className="mb-6">
              For questions about these Terms, please contact:<br />
              Maximilian Freitag<br />
              Wagnerstr. 39, 44532 Lünen<br />
              Email: 68cent@mail.de
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
