export const metadata = {
  title: 'Privacy Policy - Playzo',
  description: 'Privacy Policy for Playzo. Learn how we protect your data and privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="py-12">
      <div className="max-w-container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-headline font-black text-white mb-8">Privacy Policy</h1>

          <div className="prose prose-invert space-y-6">
            <section>
              <h2 className="text-2xl font-headline font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-playzo-cyan/80">
                Playzo ("we," "us," "our," or "Company") operates the Playzo website and application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline font-bold text-white mb-4">2. Information Collection and Use</h2>
              <p className="text-playzo-cyan/80">
                We collect several different types of information for various purposes to provide and improve our Service to you.
              </p>

              <h3 className="text-xl font-headline font-bold text-playzo-pink mt-4 mb-2">Types of Data Collected:</h3>
              <ul className="list-disc list-inside space-y-2 text-playzo-cyan/80">
                <li>Personal Data: Email address, name, phone number, address, cookies and usage data</li>
                <li>Usage Data: Browser type, IP address, pages visited, time and date stamps, referring/exit pages</li>
                <li>Device Information: Device type, operating system, unique device identifiers</li>
                <li>Game Data: Game preferences, scores, achievements, playtime data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-headline font-bold text-white mb-4">3. Use of Data</h2>
              <p className="text-playzo-cyan/80 mb-3">Playzo uses the collected data for various purposes:</p>
              <ul className="list-disc list-inside space-y-2 text-playzo-cyan/80">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To provide customer support and respond to inquiries</li>
                <li>To gather analysis or valuable information to improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent and address fraud and security issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-headline font-bold text-white mb-4">4. Security of Data</h2>
              <p className="text-playzo-cyan/80">
                The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline font-bold text-white mb-4">5. Changes to This Privacy Policy</h2>
              <p className="text-playzo-cyan/80">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the bottom of this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline font-bold text-white mb-4">6. Contact Us</h2>
              <p className="text-playzo-cyan/80">
                If you have any questions about this Privacy Policy, please contact us at privacy@playzo.com
              </p>
            </section>

            <div className="border-t border-playzo-cyan/20 pt-6 mt-8 text-sm text-playzo-cyan/50">
              <p>Last updated: January 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
