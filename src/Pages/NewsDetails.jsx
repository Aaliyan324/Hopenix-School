import { useParams, Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import newsData from '../data/news'

const NewsDetails = () => {
  const { id } = useParams()
  const article = newsData.find((n) => n.id === id)

  if (!article) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'News', link: '/news' }, { label: 'Not Found' }]} />
        <section className="relative max-w-7xl mx-auto px-6 py-16 sm:py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--error-light)] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="heading text-2xl sm:text-3xl font-bold text-[var(--text)] mb-3">Article Not Found</h2>
          <p className="paragraph text-base text-[var(--text-secondary)] mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/news" className="inline-block px-8 py-3 rounded-full bg-[var(--secondary)] text-white font-semibold hover:bg-[var(--secondary-hover)] transition-colors">
            Back to News
          </Link>
        </section>
      </>
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  const relatedNews = newsData.filter((n) => n.id !== article.id && n.published).slice(0, 3)

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', link: '/' }, { label: 'News', link: '/news' }, { label: article.title }]} />

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="paragraph bg-[var(--secondary-light)] text-[var(--secondary-hover)] text-xs font-semibold uppercase px-3 py-1 rounded-md border border-[var(--secondary)]/20">
                {article.category}
              </span>
              <span className="paragraph text-sm text-[var(--text-muted)]">{formatDate(article.date)}</span>
              {article.author && (
                <>
                  <span className="text-[var(--neutral-300)]">&middot;</span>
                  <span className="paragraph text-sm text-[var(--text-muted)]">{article.author}</span>
                </>
              )}
            </div>
            <h1 className="heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[var(--text)] mb-4 leading-tight">
              {article.title}
            </h1>
            <p className="paragraph text-lg text-[var(--text-secondary)] leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {/* Featured Image */}
          {article.image && (
            <div className="rounded-2xl overflow-hidden mb-8 h-[300px] sm:h-[400px] bg-[var(--neutral-200)]">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl p-6 sm:p-10 shadow-sm mb-10">
            <div className="paragraph text-base text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {article.content}
            </div>
          </div>

          {/* Back Button */}
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--secondary)] hover:text-[var(--secondary-hover)] transition-colors mb-16"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to All News
          </Link>
        </div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div>
            <h2 className="heading text-2xl font-bold text-[var(--text)] mb-6">Related News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNews.map((news) => (
                <Link
                  key={news.id}
                  to={`/news/${news.id}`}
                  className="bg-[var(--surface)] border border-[var(--neutral-200)] rounded-2xl overflow-hidden shadow-sm hover:border-[var(--secondary)]/40 transition-colors duration-300"
                >
                  <div className="h-[140px] bg-[var(--neutral-200)]">
                    {news.image ? (
                      <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[var(--neutral-100)] to-[var(--neutral-200)] flex items-center justify-center">
                        <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className="paragraph text-[10px] font-semibold uppercase tracking-wider text-[var(--secondary)]">{news.category}</span>
                    <h3 className="heading text-base font-bold text-[var(--text)] mt-1 line-clamp-2">{news.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  )
}

export default NewsDetails
