import { useState } from 'react'

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-xl overflow-hidden transition-colors duration-300 hover:border-[var(--secondary)]/40"
        >
          <button
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
            className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)]"
          >
            <span className="heading text-base sm:text-lg font-bold text-[var(--text)] pr-4">
              {item.question}
            </span>
            <svg
              className={`w-5 h-5 shrink-0 text-[var(--secondary)] transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6">
              <p className="paragraph text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Accordion
