import Breadcrumbs from '../components/Breadcrumbs'

const PrivacyPolicy = () => {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'Privacy Policy' }]} />

      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-10 shadow-sm">
          <h1 className="heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-[var(--text)] mb-2">Privacy Policy</h1>
          <p className="paragraph text-sm text-[var(--text-muted)] mb-8">Last updated: August 2026</p>

          <div className="prose paragraph text-sm text-[var(--text-secondary)] leading-relaxed space-y-6">
            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">1. Introduction</h2>
              <p>Welcome to Hopenix School ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, interact with us, or enroll your child in our school.</p>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, home address, and other contact details you provide when filling out forms, registering, or contacting us.</li>
                <li><strong>Student Information:</strong> Academic records, medical information, emergency contacts, and other relevant data submitted during the admission process.</li>
                <li><strong>Application Data:</strong> Educational history, test scores, and other documents submitted as part of the admission application.</li>
                <li><strong>Usage Data:</strong> Information about how you use our website, including pages visited, time spent on the site, and browser type.</li>
                <li><strong>Communication Data:</strong> Any messages, inquiries, or feedback you send through our contact forms.</li>
              </ul>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">3. How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>To process admission applications and enrollment</li>
                <li>To communicate with parents and students about school matters</li>
                <li>To respond to inquiries and provide customer support</li>
                <li>To send newsletters and updates (with your consent)</li>
                <li>To improve our website and services</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">4. Data Sharing</h2>
              <p>We do not sell your personal information. We may share information with:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>School staff and teachers who need the information for educational purposes</li>
                <li>Service providers who assist in school operations (IT, transportation, etc.)</li>
                <li>Government authorities when required by law</li>
                <li>Third parties in connection with a school transfer or merger</li>
              </ul>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">5. Data Security</h2>
              <p>We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
                <li>Withdraw consent for data processing</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">7. Cookies</h2>
              <p>Our website may use cookies to enhance your browsing experience. You can control cookie settings through your browser preferences.</p>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">8. Children's Privacy</h2>
              <p>As a school, we handle student data with special care and in compliance with applicable education privacy laws. Student information is used solely for educational and administrative purposes.</p>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">9. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
            </div>

            <div>
              <h2 className="heading text-xl font-bold text-[var(--text)] mb-2">10. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at:</p>
              <p className="mt-1">Email: info@hopenixschool.edu<br />Phone: +92 (300) 1234567<br />Address: 123 Education Lane, Lahore, Punjab, Pakistan</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PrivacyPolicy
