import SectionHeading from '../components/SectionHeading'
import Accordion from '../components/Accordion'
import Breadcrumbs from '../components/Breadcrumbs'

const faqData = [
  {
    category: 'Admissions',
    items: [
      { question: 'What is the admission process?', answer: 'Our admission process involves 5 steps: submitting an online application, application review by our team, an age-appropriate assessment and family interview, admission decision notification, and finally enrollment with fee formalities and document submission.' },
      { question: 'What age groups do you accept?', answer: 'We accept students from Playgroup (age 2-3) through Grade 12 (age 17-18). Each grade level has specific age requirements which are listed on our Admissions page.' },
      { question: 'When does the admission cycle open?', answer: 'Applications for the 2026-27 academic session are currently open. The application deadline is September 30, 2026, with assessments in October and classes beginning April 2027.' },
      { question: 'What documents are required for admission?', answer: 'Required documents include: Birth Certificate/B-Form, Parent/Guardian CNIC, Previous School Record, Passport Size Photographs, and Transfer Certificate (if applicable).' },
    ],
  },
  {
    category: 'Fees',
    items: [
      { question: 'What are the tuition fees?', answer: 'Fee details vary by grade level. Please contact our admissions office at info@hopenixschool.edu or call +92 (300) 1234567 for detailed fee information specific to your child\'s grade level.' },
      { question: 'Are there any scholarships available?', answer: 'Yes, we offer merit-based scholarships and need-based financial aid. Scholarship applications are reviewed alongside admission applications. Please mention your interest in the application form.' },
      { question: 'What payment methods are accepted?', answer: 'We accept bank transfers, checks, and cash payments. Monthly tuition can also be set up with automatic bank debit. Details are provided upon enrollment.' },
    ],
  },
  {
    category: 'Academics',
    items: [
      { question: 'What curriculum do you follow?', answer: 'We follow a comprehensive curriculum that combines international best practices with local educational standards. Our curriculum covers core subjects including Mathematics, English, Science, Social Studies, and technology integration from an early age.' },
      { question: 'What classes and grades do you offer?', answer: 'We offer education from Playgroup through Grade 12, organized into four levels: Early Years (Playgroup-KG), Primary School (Grades 1-5), Middle School (Grades 6-8), and High School (Grades 9-12).' },
      { question: 'How are students assessed?', answer: 'We use a multi-faceted assessment approach including formative assessments (class activities, quizzes), portfolio reviews (collection of student work), and summative assessments (term exams and annual examinations).' },
    ],
  },
  {
    category: 'Transport & Timings',
    items: [
      { question: 'Is school transportation available?', answer: 'Yes, we provide safe and reliable school bus service covering major routes across the city. All buses are equipped with GPS tracking and staffed by trained drivers and attendants.' },
      { question: 'What are the school timings?', answer: 'School hours are Monday to Friday, 8:00 AM to 2:30 PM. Early drop-off is available from 7:30 AM and after-school care until 5:00 PM for working parents.' },
    ],
  },
  {
    category: 'Uniform & Policies',
    items: [
      { question: 'Is there a school uniform?', answer: 'Yes, students are required to wear the school uniform. The uniform consists of season-appropriate clothing with the school logo. Complete uniform details and vendor information are provided upon enrollment.' },
      { question: 'What is the school\'s attendance policy?', answer: 'Regular attendance is essential for academic success. Students are expected to maintain a minimum 90% attendance rate. Absences must be reported by parents, and medical certificates are required for extended absences.' },
    ],
  },
  {
    category: 'Contact & Events',
    items: [
      { question: 'How can I contact the school?', answer: 'You can reach us via email at info@hopenixschool.edu, by phone at +92 (300) 1234567, or by visiting our campus at 123 Education Lane, Lahore. Our office hours are Monday-Friday, 8 AM to 4 PM.' },
      { question: 'How can I stay updated on school events?', answer: 'You can stay updated by checking our Events page, subscribing to our newsletter, following our social media channels, or contacting the school office directly.' },
    ],
  },
]

const FAQ = () => {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'FAQ' }]} />

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <SectionHeading
          badge="FAQ"
          title="Frequently Asked Questions"
          description="Find answers to common questions about admissions, fees, academics, transportation, and more."
        />

        <div className="space-y-10">
          {faqData.map((section) => (
            <div key={section.category}>
              <h3 className="heading text-xl font-bold text-[var(--text)] mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[var(--secondary)] text-white text-sm font-bold flex items-center justify-center">
                  {section.category[0]}
                </span>
                {section.category}
              </h3>
              <Accordion items={section.items} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default FAQ
