import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTo(0, 0)
    document.body.scrollTo(0, 0)

    // Reset scroll position for overflow-scroll container elements in admin/teacher layouts
    const scrollableContainers = document.querySelectorAll('main, .overflow-auto, .overflow-y-auto')
    scrollableContainers.forEach((container) => {
      container.scrollTop = 0
    })
  }, [pathname])

  return null
}

export default ScrollToTop
