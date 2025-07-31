import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Terms & Conditions
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> July 31, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 mb-4">
                By accessing and using React Job Board (&quot;the
                Service&quot;), you accept and agree to be bound by the terms
                and provision of this agreement. If you do not agree to abide by
                the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                2. Description of Service
              </h2>
              <p className="text-gray-700 mb-4">
                React Job Board is a job aggregation platform that collects and
                displays React developer job opportunities from various sources.
                We provide:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Job listings from multiple sources</li>
                <li>Search and filtering capabilities</li>
                <li>Direct links to job applications</li>
                <li>Automated job updates every 6 hours</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                3. User Responsibilities
              </h2>
              <p className="text-gray-700 mb-4">
                As a user of our service, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Use the service for lawful purposes only</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
                <li>Not interfere with the proper working of the service</li>
                <li>Respect the intellectual property rights of others</li>
                <li>
                  Provide accurate information when using our search features
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                4. Job Listings and External Links
              </h2>
              <p className="text-gray-700 mb-4">
                Our service aggregates job listings from various external
                sources. We do not:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Endorse or guarantee the accuracy of job listings</li>
                <li>Control the content of external job application pages</li>
                <li>Guarantee the availability of listed positions</li>
                <li>Have any affiliation with the companies posting jobs</li>
              </ul>
              <p className="text-gray-700 mb-4">
                When you click on &quot;Apply Now&quot; links, you will be
                redirected to external websites. We are not responsible for the
                content, privacy practices, or availability of these external
                sites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                5. Privacy and Data Collection
              </h2>
              <p className="text-gray-700 mb-4">
                We collect minimal data to provide our service. For detailed
                information about how we handle your data, please refer to our{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                6. Service Availability
              </h2>
              <p className="text-gray-700 mb-4">
                We strive to maintain high availability of our service, but we
                do not guarantee uninterrupted access. The service may be
                temporarily unavailable due to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Scheduled maintenance</li>
                <li>Technical issues</li>
                <li>Updates to our systems</li>
                <li>External factors beyond our control</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                7. Intellectual Property
              </h2>
              <p className="text-gray-700 mb-4">
                The React Job Board service, including its design,
                functionality, and content (excluding job listings), is owned by
                us and protected by copyright and other intellectual property
                laws. You may not reproduce, distribute, or create derivative
                works without our express written consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-4">
                React Job Board is provided &quot;as is&quot; without warranties
                of any kind. We are not liable for any damages arising from the
                use of our service, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Loss of data or information</li>
                <li>Interruption of service</li>
                <li>Inaccurate job information</li>
                <li>Issues with external job application processes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                9. Changes to Terms
              </h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting. Your continued use
                of the service after changes constitutes acceptance of the new
                terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                10. Contact Information
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms & Conditions, please
                contact us through our website or social media channels.
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
