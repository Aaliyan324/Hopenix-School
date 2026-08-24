import { Link } from 'react-router-dom'

const CTASection = ({ title, description, buttonText, buttonLink, variant = 'primary' }) => {
  const variants = {
    primary: {
      bg: 'bg-[var(--secondary)]',
      text: 'text-white',
      desc: 'text-white/80',
      btnBg: 'bg-white',
      btnText: 'text-[var(--secondary)]',
      btnHover: 'hover:bg-white/90',
    },
    secondary: {
      bg: 'bg-[var(--background-alt)]',
      text: 'text-[var(--text-primary)]',
      desc: 'text-[var(--text-secondary)]',
      btnBg: 'bg-[var(--secondary)]',
      btnText: 'text-white',
      btnHover: 'hover:bg-[var(--secondary-hover)]',
    },
  }

  const v = variants[variant] || variants.primary

  return (
    <section className={`relative m-2 sm:m-4 overflow-hidden rounded-[2rem] sm:rounded-3xl ${v.bg} p-8 sm:p-12 md:p-16 lg:p-20 text-center`}>
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h2 className={`heading text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 leading-tight ${v.text}`}>
          {title}
        </h2>
        {description && (
          <p className={`paragraph text-base sm:text-lg max-w-xl mb-8 leading-relaxed ${v.desc}`}>
            {description}
          </p>
        )}
        {buttonText && buttonLink && (
          <Link
            to={buttonLink}
            className={`inline-block px-10 py-4 rounded-full ${v.btnBg} ${v.btnText} font-bold text-base sm:text-lg ${v.btnHover} transition-colors duration-300 shadow-lg active:scale-95`}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  )
}

export default CTASection
