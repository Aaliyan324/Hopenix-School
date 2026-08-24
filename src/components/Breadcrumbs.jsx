import { Link } from 'react-router-dom'

const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="pt-24 pb-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {item.link ? (
                <Link
                  to={item.link}
                  className="paragraph text-[var(--text-secondary)] hover:text-[var(--secondary)] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="paragraph text-[var(--text-muted)] font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

export default Breadcrumbs
