import Breadcrumbs from '../components/Breadcrumbs'

const Terms = () => {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'Terms & Conditions' }]} />

      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-10 shadow-sm">
          <h1 className="heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--text)] mb-2">Terms & Conditions</h1>
          <p className="paragraph text-sm text-[var(--text-muted)] mb-8">Last updated: August 2026</p>

          <div className="prose paragraph text-sm text-[var(--text-secondary)] leading-relaxed space-y-6">
            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">1. Acceptance of Terms</h2>
              <p>By accessing and using the Hopenix School website ("Website"), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Website.</p>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">2. Use of Website</h2>
              <p>You agree to use this Website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the Website. Prohibited activities include:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Using the Website in any way that violates local, national, or international laws</li>
                <li>Uploading or transmitting malicious code or viruses</li>
                <li>Attempting to gain unauthorized access to any part of the Website</li>
                <li>Scraping or collecting data from the Website without permission</li>
                <li>Misrepresenting your relationship with the school</li>
              </ul>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">3. Admission Information</h2>
              <p>Information provided on this Website regarding admission procedures, requirements, fees, and deadlines is for general guidance only. The school reserves the right to modify admission policies, fees, and procedures at any time without prior notice. Always confirm details directly with the admissions office.</p>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">4. Intellectual Property</h2>
              <p>All content on this Website, including text, images, graphics, logos, and software, is the property of Hopenix School and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">5. Student & Parent Responsibilities</h2>
              <p>Enrolled families are expected to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Ensure regular attendance and punctuality</li>
                <li>Comply with school policies and codes of conduct</li>
                <li>Maintain open communication with teachers and administration</li>
                <li>Pay fees and charges by the specified deadlines</li>
                <li>Support the school's mission and values</li>
              </ul>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">6. Limitation of Liability</h2>
              <p>Hopenix School shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of or inability to use this Website or from any reliance on information provided on the Website.</p>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">7. External Links</h2>
              <p>Our Website may contain links to external websites. We are not responsible for the content or privacy practices of these external sites. Visiting external links is at your own risk.</p>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">8. Fee & Refund Policy</h2>
              <p>All fees are due by the dates specified by the school. Late payments may incur additional charges. Refund requests are handled on a case-by-case basis in accordance with school policy. Please refer to the admissions office for specific fee and refund details.</p>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">9. Termination</h2>
              <p>The school reserves the right to terminate or suspend a student's enrollment for violation of school policies, non-payment of fees, or conduct that is detrimental to the school community, following due process.</p>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">10. Changes to Terms</h2>
              <p>We reserve the right to modify these Terms and Conditions at any time. Changes will be posted on this page with an updated revision date. Continued use of the Website constitutes acceptance of modified terms.</p>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">11. Governing Law</h2>
              <p>These Terms and Conditions are governed by and construed in accordance with the laws of Pakistan. Any disputes shall be subject to the exclusive jurisdiction of the courts in Lahore, Pakistan.</p>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">12. Contact Information</h2>
              <p>For questions about these Terms and Conditions, please contact us:</p>
              <p className="mt-1">Email: info@hopenixschool.edu<br />Phone: +92 (300) 1234567<br />Address: 123 Education Lane, Lahore, Punjab, Pakistan</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Terms
