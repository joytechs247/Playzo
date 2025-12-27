export const metadata = {
  title: 'Terms of Service - Playzo',
  description: 'Terms of Service for Playzo. Review the terms and conditions of using our platform.',
};

export default function TermsPage() {
  return (
    <div className="py-12">
      <div className="max-w-container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-headline font-black text-white mb-8">Terms of Service</h1>

          <div className="prose prose-invert space-y-6">
            <section>
              <h2 className="text-2xl font-headline font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-playzo-cyan/80">
                By accessing and using Playzo, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline font-bold text-white mb-4">2. Use License</h2>
              <p className="text-playzo-cyan/80">
                Permission is granted to temporarily download one copy of the materials (information or software) on Playzo for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-playzo-cyan/80 mt-3">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on Playzo</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-headline font-bold text-white mb-4">3. Disclaimer</h2>
              <p className="text-playzo-cyan/80">
                The materials on Playzo are provided on an 'as is' basis. Playzo makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline font-bold text-white mb-4">4. Limitations</h2>
              <p className="text-playzo-cyan/80">
                In no event shall Playzo or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Playzo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline font-bold text-white mb-4">5. Accuracy of Materials</h2>
              <p className="text-playzo-cyan/80">
                The materials appearing on Playzo could include technical, typographical, or photographic errors. Playzo does not warrant that any of the materials on Playzo are accurate, complete, or current. Playzo may make changes to the materials contained on its website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline font-bold text-white mb-4">6. Links</h2>
              <p className="text-playzo-cyan/80">
                Playzo has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Playzo of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline font-bold text-white mb-4">7. Modifications</h2>
              <p className="text-playzo-cyan/80">
                Playzo may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-headline font-bold text-white mb-4">8. Governing Law</h2>
              <p className="text-playzo-cyan/80">
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Playzo operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
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
