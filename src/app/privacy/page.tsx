import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> July 31, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                React Job Board (&quot;we&quot;, &quot;our&quot;, or
                &quot;us&quot;) is committed to protecting your privacy. This
                Privacy Policy explains how we collect, use, and safeguard your
                information when you use our job board service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                2. Information We Collect
              </h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                2.1 Information You Provide
              </h3>
              <p className="text-gray-700 mb-4">
                We collect minimal information that you voluntarily provide when
                using our service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Search queries and filters you use</li>
                <li>Job preferences and selections</li>
                <li>Feedback or communications you send us</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                2.2 Automatically Collected Information
              </h3>
              <p className="text-gray-700 mb-4">
                We automatically collect certain information when you visit our
                website:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>IP address and general location</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Pages visited and time spent</li>
                <li>Referral sources</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide and maintain our job board service</li>
                <li>Improve search functionality and user experience</li>
                <li>Analyze usage patterns to enhance our service</li>
                <li>Ensure security and prevent fraud</li>
                <li>Comply with legal obligations</li>
                <li>Provide customer support when needed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                4. Information Sharing
              </h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties, except in the following
                circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  <strong>Service Providers:</strong> We may share data with
                  trusted third-party service providers who assist us in
                  operating our website and providing services
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose
                  information if required by law or to protect our rights and
                  safety
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger
                  or acquisition, your information may be transferred
                </li>
                <li>
                  <strong>Consent:</strong> We may share information with your
                  explicit consent
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                5. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your
                experience:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  <strong>Essential Cookies:</strong> Required for basic website
                  functionality
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how
                  visitors use our site
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your search
                  preferences and settings
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                You can control cookie settings through your browser
                preferences, though disabling certain cookies may affect website
                functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                6. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your
                information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure hosting infrastructure</li>
              </ul>
              <p className="text-gray-700 mb-4">
                However, no method of transmission over the internet is 100%
                secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                7. Third-Party Links
              </h2>
              <p className="text-gray-700 mb-4">
                Our service contains links to external job application websites.
                We are not responsible for the privacy practices of these
                external sites. We encourage you to review their privacy
                policies before providing any personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                8. Children&apos;s Privacy
              </h2>
              <p className="text-gray-700 mb-4">
                Our service is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13. If you believe we have collected such information,
                please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                9. Your Rights
              </h2>
              <p className="text-gray-700 mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>
                  <strong>Access:</strong> Request information about what data
                  we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  data
                </li>
                <li>
                  <strong>Portability:</strong> Request a copy of your data in a
                  portable format
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain types of
                  processing
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                10. Data Retention
              </h2>
              <p className="text-gray-700 mb-4">
                We retain your information only as long as necessary to provide
                our services and comply with legal obligations. Analytics data
                is typically retained for up to 2 years, while other data may be
                retained for shorter periods.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                11. International Transfers
              </h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in
                countries other than your own. We ensure appropriate safeguards
                are in place to protect your data in accordance with this
                Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                12. Changes to This Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new policy on
                this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                13. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us through our website or social media
                channels.
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← Back to Job Board
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
