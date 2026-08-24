import { useState, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHeading from '../components/SectionHeading'
import Breadcrumbs from '../components/Breadcrumbs'
import newsData from '../data/news'

gsap.registerPlugin(ScrollTrigger)

const News = () => {
  const sectionRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', ...new Set(newsData.map((n) => n.category))]

  const filtered = newsData
    .filter((n) => n.published)
    .filter((n) => selectedCategory === 'All' || n.category === selectedCategory)
    .filter((n) => n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))

  const featuredNews = filtered.find((n) => n.featured) || filtered[0]
  const regularNews = filtered.filter((n) => n.id !== featuredNews?.id)

  useLayoutEffect(() => {
    if (!sectionRef.current) return
    const section = sectionRef.current

    const ctx = gsap.context(() => {
      gsap.set(['.news-featured', '.news-card'], { y: 35, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 80%', once: true, invalidateOnRefresh: true },
        defaults: { ease: 'power3.out' },
      })

      tl.to('.news-featured', { y: 0, opacity: 1, duration: 0.7 })
        .to('.news-card', { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.3')

      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, section)

    return () => ctx.revert()
  }, [])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'News & Announcements' }]} />

      <section ref={sectionRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <SectionHeading
          badge="News"
          title="News & Announcements"
          description="Stay up to date with the latest news, events, and announcements from Hopenix School."
        />

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--neutral-200)] text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--secondary)] transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`paragraph px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                  selectedCategory === cat
                    ? 'bg-[var(--secondary)] text-white'
                    : 'bg-[var(--surface)] border border-[var(--neutral-200)] text-[var(--text-secondary)] hover:border-[var(--secondary)]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured News */}
        {featuredNews && (
          <Link
            to={`/news/${featuredNews.id}`}
            className="news-featured block bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl overflow-hidden shadow-sm hover:border-[var(--secondary)]/40 transition-colors duration-300 mb-10 transform-gpu"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="h-[200px] lg:h-auto bg-[var(--neutral-200)]">
                {featuredNews.image ? (
                  <img src={featuredNews.image} alt={featuredNews.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--secondary-light)] to-[var(--primary-light)] flex items-center justify-center">
                    <svg className="w-16 h-16 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="paragraph bg-[var(--secondary)] text-white text-xs font-bold uppercase px-3 py-1 rounded-md">Featured</span>
                  <span className="paragraph text-xs text-[var(--text-muted)]">{formatDate(featuredNews.date)}</span>
                </div>
                <h2 className="heading text-xl sm:text-2xl font-bold text-[var(--text)] mb-3">{featuredNews.title}</h2>
                <p className="paragraph text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">{featuredNews.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--secondary)]">
                  Read More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* News Grid */}
        {regularNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularNews.map((news) => (
              <Link
                key={news.id}
                to={`/news/${news.id}`}
                className="news-card bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl overflow-hidden shadow-sm hover:border-[var(--secondary)]/40 transition-colors duration-300 transform-gpu"
              >
                <div className="h-[160px] bg-[var(--neutral-200)]">
                  {news.image ? (
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--neutral-100)] to-[var(--neutral-200)] flex items-center justify-center">
                      <svg className="w-10 h-10 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="paragraph text-[10px] font-semibold uppercase tracking-wider text-[var(--secondary)]">{news.category}</span>
                    <span className="text-[var(--neutral-300)]">&middot;</span>
                    <span className="paragraph text-[10px] text-[var(--text-muted)]">{formatDate(news.date)}</span>
                  </div>
                  <h3 className="heading text-lg font-bold text-[var(--text)] mb-2 line-clamp-2">{news.title}</h3>
                  <p className="paragraph text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{news.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="paragraph text-lg text-[var(--text-muted)]">No news articles found matching your criteria.</p>
          </div>
        )}
      </section>
    </>
  )
}

export default News
